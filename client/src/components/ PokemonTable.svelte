<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import api from '../services/api';
    import type { Pokemon } from '../types';

    export let pokemons: Pokemon[] = [];

    const dispatch = createEventDispatcher();

    async function toggleFavorite(pokemonId: number) {
      try {
        await api.toggleFavorite(pokemonId);
        dispatch('toggleFavorite');
      } catch (err) {
        console.error('Failed to toggle favorite', err);
      }
    }
  </script>

  <div class="overflow-x-auto">
    <table class="min-w-full bg-white">
      <thead class="bg-gray-100">
        <tr>
          <th class="py-2 px-4 text-left">Name</th>
          <th class="py-2 px-4 text-left">Height</th>
          <th class="py-2 px-4 text-left">Weight</th>
          <th class="py-2 px-4 text-left">Like/Dislike</th>
        </tr>
      </thead>
      <tbody>
        {#each pokemons as pokemon}
          <tr class="border-b">
            <td class="py-2 px-4">{pokemon.name}</td>
            <td class="py-2 px-4">{pokemon.height}</td>
            <td class="py-2 px-4">{pokemon.weight}</td>
            <td class="py-2 px-4">
              <button on:click={() => toggleFavorite(pokemon.id)}
                      class="focus:outline-none">
                {pokemon.is_favorite ? '❤️' : '🤍'}
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>