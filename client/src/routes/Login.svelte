<script lang="ts">
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    import api from '../services/api';

    import { onMount } from 'svelte';

  onMount(() => {
    if ($auth) {
      navigate('/pokemon');
    }
  })

    let email = '';
    let password = '';
    let error = '';

    async function handleSubmit() {
      try {
        const response = await api.login(email, password);
        console.log(response.data.access_token)
        await auth.login(response.data.access_token);
        navigate('/pokemon');
      } catch (err) {
        error ='An error occurred';
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
      <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">Login</button>
    </form>
    {#if error}
      <p class="text-red-500 mt-4">{error}</p>
    {/if}
  </div>