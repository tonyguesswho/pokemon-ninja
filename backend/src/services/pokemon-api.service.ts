// src/services/pokemon-api.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { RateLimiter } from 'limiter';
import {
  pokemonListSchema,
  pokemonDetailsSchema,
} from '../schemas/pokemon.schema';

@Injectable()
export class PokemonApiService {
  private readonly apiUrl: string;
  private limiter: RateLimiter;

  constructor(configService: ConfigService | null, apiUrl?: string) {
    this.apiUrl = configService
      ? configService.get<string>('POKEMON_API_URL')
      : apiUrl || 'https://pokeapi.co/api/v2';
    this.limiter = new RateLimiter({
      tokensPerInterval: 100,
      interval: 'minute',
    });
  }

  async fetchPokemonList(limit: number = 100): Promise<any[]> {
    try {
      await this.limiter.removeTokens(1);
      const response = await axios.get(`${this.apiUrl}/pokemon?limit=${limit}`);
      const { error, value } = pokemonListSchema.validate(response.data, {
        stripUnknown: true,
      });
      if (error) {
        throw new HttpException(
          `Invalid Pokemon list data: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return value.results;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch Pokemon list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchPokemonDetails(url: string): Promise<any> {
    try {
      await this.limiter.removeTokens(1);
      const response = await axios.get(url);
      const data = response.data;
      const transformedData = {
        name: data.name,
        height: data.height,
        weight: data.weight,
        baseExperience: data.base_experience,
        sprite_front: data.sprites.front_default,
        sprite_back: data.sprites.back_default,
        stat_speed: data.stats[0].base_stat,
        url: url,
      };

      const { error, value } = pokemonDetailsSchema.validate(transformedData, {
        stripUnknown: true,
      });
      if (error) {
        throw new HttpException(
          `Invalid Pokemon data: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return value;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to fetch Pokemon details for ${url}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchAllPokemonData(limit: number = 100): Promise<any[]> {
    const pokemonList = await this.fetchPokemonList(limit);
    const detailedPokemons = await Promise.all(
      pokemonList.map((pokemon) => this.fetchPokemonDetails(pokemon.url)),
    );
    return detailedPokemons;
  }
}
