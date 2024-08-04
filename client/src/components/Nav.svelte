<!-- src/components/Nav.svelte -->
<script lang="ts">
    import { Link, navigate } from "svelte-routing";
    import { auth } from "../stores/auth";

    function handleLogout() {
      auth.logout(() => {
        navigate('/');
      });
    }
  </script>

  <nav class="bg-blue-600 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <Link to="/" class="text-xl font-bold">Pokémon App</Link>
      <div>
        {#if $auth}
          <span class="mr-4">{$auth.email} (Org: {$auth.organization_name})</span>
          <Link to="/pokemon" class="mr-4">Pokémon</Link>
          <button on:click={handleLogout} class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Logout</button>
        {:else}
          <Link to="/login" class="mr-4">Login</Link>
          <Link to="/register" class="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">Register</Link>
        {/if}
      </div>
    </div>
  </nav>