<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Nav from "./components/Nav.svelte";
  import Home from "./routes/Home.svelte";
  import Login from "./routes/Login.svelte";
  import Register from "./routes/Register.svelte";
  import Pokemon from "./routes/Pokemon.svelte";
</script>

<Router>
  <div class="min-h-screen bg-gray-100">
    <Nav />
    <main class="container mx-auto mt-4 p-4">
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/pokemon" component={Pokemon} />
    </main>
  </div>
</Router>