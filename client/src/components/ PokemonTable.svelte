<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Pokemon } from '../types';

  export let pokemons: Pokemon[] = [];

  const dispatch = createEventDispatcher();

  function toggleFavorite(pokemonId: number) {
    dispatch('toggleFavorite', { pokemonId });
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
      {#each pokemons as pokemon (pokemon.id)}
        <tr class="border-b">
          <td class="py-2 px-4">{pokemon.name}</td>
          <td class="py-2 px-4">{pokemon.height}</td>
          <td class="py-2 px-4">{pokemon.weight}</td>
          <td class="py-2 px-4">
            <button on:click={() => toggleFavorite(pokemon.id)}
                    class="focus:outline-none transition-colors duration-200">
              {pokemon.is_favorite ? '❤️' : '🤍'}
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>