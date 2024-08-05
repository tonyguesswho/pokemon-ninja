<script lang="ts">
  import { auth } from '../stores/auth';
  import { navigate } from 'svelte-routing';
  import api from '../services/api';
  import type { Organization } from '../types';
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let organizationId: number | null = null;
  let organizations: Organization[] = [];
  let error = '';
  let loading = false;
  let fetchingOrganizations = true;

  onMount(() => {
      if ($auth) {
          navigate('/pokemon');
      }
      fetchOrganizations();
  });

  async function fetchOrganizations() {
      try {
          const response = await api.getOrganizations();
          organizations = response.data;
      } catch (err) {
          error = 'Failed to fetch organizations';
      } finally {
          fetchingOrganizations = false;
      }
  }

  async function handleSubmit() {
      if (organizationId === null) {
          error = 'Please select an organization';
          return;
      }
      loading = true;
      error = '';
      try {
          const response = await api.register(email, password, organizationId);
          auth.login(response.data.access_token);
          navigate('/pokemon');
      } catch (err: any) {
          error = err.response?.data?.message || 'An error occurred';
      } finally {
          loading = false;
      }
  }
</script>

<div class="max-w-md mx-auto bg-white p-8 border rounded-lg shadow-lg">
  <h1 class="text-2xl font-bold mb-6 text-center">Register</h1>
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div>
          <label for="email" class="block mb-1">Email</label>
          <input id="email" type="email" bind:value={email} placeholder="Email" required
                 class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div>
          <label for="password" class="block mb-1">Password</label>
          <input id="password" type="password" bind:value={password} placeholder="Password" required
                 class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div>
          <label for="organization" class="block mb-1">Organization</label>
          {#if fetchingOrganizations}
              <div class="w-full px-3 py-2 border rounded text-gray-500">Loading organizations...</div>
          {:else}
              <select id="organization" bind:value={organizationId} required
                      class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value={null}>Select an organization</option>
                  {#each organizations as org}
                      <option value={org.id}>{org.name}</option>
                  {/each}
              </select>
          {/if}
      </div>
      <button type="submit" class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200" disabled={loading || fetchingOrganizations}>
          {#if loading}
              <span class="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
          {/if}
          Register
      </button>
  </form>
  {#if error}
      <p class="text-red-500 mt-4">{error}</p>
  {/if}
</div>