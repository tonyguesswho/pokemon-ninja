import { BaseModel } from './base.model';
import { Organization } from './organization.model';
import { Pokemon } from './pokemon.model';

export class User extends BaseModel {
  static tableName = 'users';

  id!: number;
  email!: string;
  password!: string;
  organization_id!: number;

  static relationMappings = () => ({
    organization: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Organization,
      join: {
        from: 'users.organization_id',
        to: 'organizations.id',
      },
    },

    favoritePokemon: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: Pokemon,
      join: {
        from: 'users.id',
        through: {
          from: 'favorites.user_id',
          to: 'favorites.pokemon_id',
        },
        to: 'pokemons.id',
      },
    },
  });
}
