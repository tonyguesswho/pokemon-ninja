import { Model } from 'objection';
import { User } from './user.model';
import { Organization } from './organization.model';

export class Pokemon extends Model {
  static tableName = 'pokemons';

  id!: number;
  name!: string;
  pokedex_number!: number;
  height!: number;
  weight!: number;
  base_experience!: number;
  sprite_front!: string | null;
  sprite_back!: string | null;
  stat_speed!: number;
  organization_id!: number;
  url!: string;

  static relationMappings = () => ({
    organization: {
      relation: Model.BelongsToOneRelation,
      modelClass: Organization,
      join: {
        from: 'pokemons.organization_id',
        to: 'organizations.id',
      },
    },
    favorites: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      join: {
        from: 'pokemons.id',
        through: {
          from: 'favorites.pokemon_id',
          to: 'favorites.user_id',
        },
        to: 'users.id',
      },
    },
  });
}
