import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Pokemon } from '../models/pokemon.model';
import { Favorite } from '../models/favorite.model';
import { User } from '../models/user.model';

@Injectable()
export class PokemonService {
  async toggleFavorite(
    userId: number,
    pokemonId: number,
  ): Promise<{ isFavorited: boolean }> {
    const trx = await Pokemon.startTransaction();

    try {
      const user = await User.query(trx).findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const pokemon = await Pokemon.query(trx).findById(pokemonId);
      if (!pokemon) {
        throw new NotFoundException('Pokemon not found');
      }

      if (pokemon.organization_id !== user.organization_id) {
        throw new ForbiddenException(
          'You can only favorite Pokemon from your own organization',
        );
      }

      const favorite = await Favorite.query(trx).findOne({
        user_id: userId,
        pokemon_id: pokemonId,
      });

      let isFavorited: boolean;

      if (favorite) {
        // If favorite exists, remove it
        await Favorite.query(trx).deleteById(favorite.id);
        isFavorited = false;
      } else {
        // If favorite doesn't exist, create it
        await Favorite.query(trx).insert({
          user_id: userId,
          pokemon_id: pokemonId,
        });
        isFavorited = true;
      }

      await trx.commit();
      return { isFavorited };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async getPokemonWithFavoriteStatus(
    userId: number,
    organizationId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ pokemons: any[]; total: number }> {
    const query = Pokemon.knex()
      .from('pokemons')
      .select('pokemons.*')
      .leftJoin('favorites', function () {
        this.on('favorites.pokemon_id', '=', 'pokemons.id').andOn(
          'favorites.user_id',
          '=',
          Pokemon.knex().raw('?', [userId]),
        );
      })
      .where('pokemons.organization_id', organizationId)
      .select(
        Pokemon.knex().raw(
          'CASE WHEN favorites.id IS NOT NULL THEN true ELSE false END as is_favorite',
        ),
      )
      .orderBy('pokemons.id', 'asc')
      .offset((page - 1) * limit)
      .limit(limit);

    const [result, countResult] = await Promise.all([
      query,
      Pokemon.knex()
        .from('pokemons')
        .where('organization_id', organizationId)
        .count('id as count')
        .first(),
    ]);

    return {
      pokemons: result,
      total: parseInt(countResult.count as string, 10),
    };
  }

  async getPokemonById(id: number): Promise<Pokemon> {
    const pokemon = await Pokemon.query().findById(id);
    if (!pokemon) {
      throw new NotFoundException('Pokemon not found');
    }
    return pokemon;
  }

  async getPokemonByOrganization(organizationId: number): Promise<Pokemon[]> {
    return Pokemon.query().where('organizationId', organizationId);
  }
}
