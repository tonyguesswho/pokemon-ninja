
<script lang="ts">
  import { onMount } from 'svelte';
 import PokemonTable from '../components/ PokemonTable.svelte';
  import api from '../services/api';
  import type { Pokemon } from '../types';
  import { auth } from '../stores/auth';

  let pokemons: Pokemon[] = [];
  let currentPage = 1;
  let totalPages = 1;
  let error = '';
  let limit = 10;
  let total = 0;
  let loading = true;

  $: organizationName = $auth?.organization_name || '';

  async function fetchPokemons() {
    loading = true;
    try {
      const response = await api.getPokemons(currentPage, limit);
      pokemons = response.data.pokemons;
      total = response.data.total;
      totalPages = Math.ceil(total / limit);
    } catch (err) {
      error = 'Failed to fetch Pokemons';
    } finally {
      loading = false;
    }
  }

  function handlePageChange(newPage: number) {
    currentPage = newPage;
    fetchPokemons();
  }

  function handleLimitChange() {
    currentPage = 1;
    fetchPokemons();
  }

  async function handleToggleFavorite(event: CustomEvent<{pokemonId: number}>) {
    const { pokemonId } = event.detail;
    const pokemonIndex = pokemons.findIndex(p => p.id === pokemonId);

    if (pokemonIndex !== -1) {
      pokemons[pokemonIndex].is_favorite = !pokemons[pokemonIndex].is_favorite;
      pokemons = [...pokemons];

      try {
        await api.toggleFavorite(pokemonId);
      } catch (err) {
        pokemons[pokemonIndex].is_favorite = !pokemons[pokemonIndex].is_favorite;
        pokemons = [...pokemons];
        console.error('Failed to toggle favorite:', err);
      }
    }
  }

  $: if (limit) {
    handleLimitChange();
  }

  onMount(fetchPokemons);
</script>

<div class="bg-white p-6 rounded-lg shadow-lg">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">Pokémons</h1>
    <div class="text-right">
      <span class="text-sm text-gray-600">Organization:</span>
      <h2 class="text-lg font-semibold">{organizationName}</h2>
    </div>
  </div>

  <div class="mb-4">
    <label for="limit" class="mr-2">Items per page:</label>
    <select id="limit" bind:value={limit} class="border rounded p-1">
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
    </select>
  </div>

  {#if error}
    <p class="text-red-500">{error}</p>
  {:else if loading}
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  {:else}
    <PokemonTable {pokemons} on:toggleFavorite={handleToggleFavorite} />
    <div class="mt-4 flex justify-between items-center">
      <button on:click={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300">
        Previous
      </button>
      <span>Page {currentPage} of {totalPages} (Total items: {total})</span>
      <button on:click={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300">
        Next
      </button>
    </div>
  {/if}
</div>