<!-- src/routes/Pokemon.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import PokemonTable from '../components/ PokemonTable.svelte'
    import api from '../services/api';
    import type { Pokemon } from '../types';
    import { auth } from '../stores/auth';

    let pokemons: Pokemon[] = [];
    let currentPage = 1;
    let totalPages = 1;
    let error = '';
    let limit = 10; // Default limit
    let total = 0;

    $: organizationName = $auth?.organization_name || 'Unknown Organization';

    async function fetchPokemons() {
      try {
        const response = await api.getPokemons(currentPage, limit);
        pokemons = response.data.pokemons;
        total = response.data.total;
        totalPages = Math.ceil(total / limit);
      } catch (err) {
        error = 'Failed to fetch Pokemons';
      }
    }

    function handlePageChange(newPage: number) {
      currentPage = newPage;
      fetchPokemons();
    }

    function handleLimitChange() {
      currentPage = 1; // Reset to first page when changing limit
      fetchPokemons();
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
    {:else}
      <PokemonTable {pokemons} on:toggleFavorite={fetchPokemons} />
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