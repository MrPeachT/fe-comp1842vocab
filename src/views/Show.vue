<template>
  <div v-if="word">
    <h1 style="text-align: center;">Word Details</h1>

    <p><strong>English:</strong> {{ word.english }}</p>
    <p><strong>German:</strong> {{ word.german }}</p>
    <p><strong>Vietnamese:</strong> {{ word.vietnamese }}</p>

    <div v-if="word.imageUrl" style="text-align:center; margin: 1rem 0;">
      <img :src="word.imageUrl" style="max-height:150px;">
    </div>

    <div style="display:flex; justify-content:center; gap:1rem; margin-top:20px;">
      <router-link
        v-if="canModify"
        :to="`/words/${word._id}/edit`"
        class="ui green button"
      >
        Edit
      </router-link>

      <button
        v-if="canModify"
        @click="deleteWord"
        class="ui red button"
      >
        Delete
      </button>

      <router-link to="/words" class="ui button">
        Back to List
      </router-link>
    </div>
  </div>

  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script>
import { api } from '../helpers/helpers';

export default {
  name: 'show',
  data() {
    return {
      word: null
    };
  },
  computed: {
    user() {
      return this.$root.user;
    },
    canModify() {
      if (!this.user || !this.word) return false;
      if (this.user.role === 'admin') return true;
      return this.word.owner === this.user.id;
    }
  },
  methods: {
    async deleteWord() {
      const sure = window.confirm('Are you sure you want to delete this word?');
      if (!sure) return;

      await api.deleteWord(this.word._id);
      this.flash('Word deleted successfully!', 'success');
      this.$router.push('/words');
    }
  },
  async mounted() {
    this.word = await api.getWord(this.$route.params.id);
  }
};
</script>