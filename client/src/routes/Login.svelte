<script lang="ts">
  import { auth } from '../stores/auth';
  import { navigate } from 'svelte-routing';
  import api from '../services/api';
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  onMount(() => {
      if ($auth) {
          navigate('/pokemon');
      }
  });

  async function handleSubmit() {
      loading = true;
      error = '';
      try {
          const response = await api.login(email, password);
          console.log(response.data.access_token);
          await auth.login(response.data.access_token);
          navigate('/pokemon');
      } catch (err: any) {
          error = err.response?.data?.message || 'An error occurred';
      } finally {
          loading = false;
      }
  }
</script>

<div class="max-w-md mx-auto bg-white p-8 border rounded-lg shadow-lg">
  <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
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
      <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200" disabled={loading}>
          {#if loading}
              <span class="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
          {/if}
          Login
      </button>
  </form>
  {#if error}
      <p class="text-red-500 mt-4">{error}</p>
  {/if}
</div>