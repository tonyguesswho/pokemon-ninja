<script lang="ts">
    import { Link } from "svelte-routing";
    import { auth } from '../stores/auth';
  </script>

  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-6">Welcome to the Pokémon App!</h1>

    <div class="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4">About Our App</h2>
      <p class="mb-4">
        Explore the world of Pokémon with our interactive application! Here you can:
      </p>
      <ul class="list-disc list-inside mb-4">
        <li>View Pokémon from your organization</li>
        <li>Like your favorite Pokémon</li>
        <li>Browse through paginated lists of Pokémon</li>
      </ul>
      <p>
        Join now to start your Pokémon adventure!
      </p>
    </div>

    {#if $auth}
      <div class="text-center">
        <p class="mb-4">You're logged in. Start exploring Pokémon now!</p>
        <Link to="/pokemon" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          View Pokémon
        </Link>
      </div>
    {:else}
      <div class="text-center">
        <p class="mb-4">Log in or register to start your Pokémon journey!</p>
        <div class="space-x-4">
          <Link to="/login" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Log In
          </Link>
          <Link to="/register" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Register
          </Link>
        </div>
      </div>
    {/if}
  </div>