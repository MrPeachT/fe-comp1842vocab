<template>
  <div id="app">
    <div class="ui inverted segment navbar">
      <div class="ui center aligned container">
        <div class="ui large secondary inverted pointing menu compact">
          <router-link to="/words" exact class="item">
            <i class="comment outline icon"></i> Dictionary
          </router-link>

          <router-link
            v-if="user"
            to="/words/new"
            class="item"
          >
            <i class="plus circle icon"></i> Add Word
          </router-link>

          <router-link to="/test" class="item">
            <i class="graduation cap icon"></i> Quiz Test
          </router-link>

          <div class="right menu">
            <router-link
              v-if="!user"
              to="/login"
              class="item"
            >
              <i class="user icon"></i> Login
            </router-link>

            <div v-else class="item">
              <i class="user circle icon"></i>
              <span style="margin-right: 0.75rem;">
                {{ user.email }}
              </span>
              <a href="#" @click.prevent="logout" class="ui tiny red button">
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="ui text container">
      <flash-message class="myFlash"></flash-message>
      <div class="ui one column grid">
        <div class="column">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      user: null
    };
  },
  async created() {
    try {
      const res = await axios.get("http://localhost:3000/auth/me", {
        withCredentials: true
      });
      this.user = res.data; 
    } catch (err) {
      console.error("Failed to load current user", err);
      this.user = null;
    }
  },
  methods: {
    async logout() {
      try {
        await axios.post(
          "http://localhost:3000/auth/logout",
          {},
          { withCredentials: true }
        );
        this.user = null;
        this.$flash("Logged out", "success");
        this.$router.push("/words");
      } catch (err) {
        console.error("Logout failed", err);
        this.$flash("Logout failed", "error");
      }
    }
  }
};
</script>

<style>
#app > div.navbar {
  margin-bottom: 1.5em;
}

.myFlash {
  width: 250px;
  margin: 10px;
  position: absolute;
  top: 50;
  right: 0;
}

input {
  width: 300px;
}

div.label {
  width: 120px;
}

div.input {
  margin-bottom: 10px;
}

button.ui.button {
  margin-top: 15px;
  display: block;
}
</style>