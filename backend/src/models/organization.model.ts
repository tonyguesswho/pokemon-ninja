import { Model } from 'objection';
import { User } from './user.model';
import { Pokemon } from './pokemon.model';

export class Organization extends Model {
  static tableName = 'organizations';

  id!: number;
  name!: string;

  static relationMappings = () => ({
    users: {
      relation: Model.HasManyRelation,
      modelClass: User,
      join: {
        from: 'organizations.id',
        to: 'users.organization_id',
      },
    },
    pokemons: {
      relation: Model.HasManyRelation,
      modelClass: Pokemon,
      join: {
        from: 'organizations.id',
        to: 'pokemons.organization_id',
      },
    },
  });
}
