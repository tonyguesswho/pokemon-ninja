import { Model } from 'objection';
import { User } from './user.model';
import { Pokemon } from './pokemon.model';

export class Favorite extends Model {
  static tableName = 'favorites';

  id!: number;
  user_id!: number;
  pokemon_id!: number;

  static relationMappings = () => ({
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'favorites.user_id',
        to: 'users.id',
      },
    },
    pokemon: {
      relation: Model.BelongsToOneRelation,
      modelClass: Pokemon,
      join: {
        from: 'favorites.pokemon_id',
        to: 'pokemons.id',
      },
    },
  });
}
