<template>
  <div class="ui segment" style="max-width: 500px; margin: 2rem auto;">
    <h2 class="ui header center aligned">
      <i class="user plus icon"></i>
      <div class="content">Create Account</div>
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
          placeholder="Enter a password (min 8 characters)"
          required
        />
      </div>

      <div class="ui message" style="margin-top: 1rem;">
        Already have an account?
        <router-link to="/login">Login here</router-link>.
      </div>

      <button class="ui primary button fluid" :class="{ loading }">
        Register
      </button>

      <div
        v-if="error"
        class="ui negative message"
        style="margin-top: 1rem;"
      >
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterPage",
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
          "http://localhost:3000/auth/register",
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
        this.flash("Account created! You are now logged in.", "success");

        this.$router.push("/words");
      } catch (err) {
        console.error("Register failed:", err);
        this.error =
          err?.response?.data?.error || "Registration failed. Please try again.";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>