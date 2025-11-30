<template>
  <div class="ui segment" style="max-width: 500px; margin: 2rem auto;">
    <h2 class="ui header center aligned">
      <i class="user icon"></i>
      <div class="content">Login</div>
    </h2>

    <form class="ui form" @submit.prevent="onSubmit">
      <div class="field">
        <label>Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>

      <div class="field">
        <label>Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter password"
          required
        />
      </div>

      <div class="ui message" style="margin-top: 1rem;">
        New here?
        <router-link to="/register">Create an account</router-link>.
      </div>

      <button class="ui primary button fluid" :class="{ loading: loading }">
        Login
      </button>

      <div v-if="error" class="ui negative message" style="margin-top: 1rem;">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      error: null
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      this.error = null;

      try {
        await axios.post(
          "http://localhost:3000/auth/login",
          {
            email: this.email,
            password: this.password
          },
          { withCredentials: true }
        );

        const me = await axios.get("http://localhost:3000/auth/me", {
          withCredentials: true
        });

        this.$root.user = me.data;

        // FIX HERE
        this.flash("Welcome back!", "success");

        this.$router.push("/words");
      } catch (err) {
        console.error("Login failed:", err);
        this.error =
          err?.response?.data?.error || "Login failed. Please try again.";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>