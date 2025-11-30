<template>
  <div>
    <h1 style="text-align: center;">Create New Word</h1>

    <word-form
      :word="word"
      @createOrUpdate="createOrUpdate"
    />
  </div>
</template>

<script>
import WordForm from "../components/WordForm.vue";
import { api } from "../helpers/helpers";

export default {
  name: "new-word",
  components: { WordForm },

  data() {
    return {
      word: {
        english: "",
        german: "",
        vietnamese: "",
        imageUrl: ""   
      }
    };
  },

  methods: {
    async createOrUpdate(word) {
      try {
        await api.createWord(word);

        this.flash("Word created successfully!", "success");
        this.$router.push(`/words/`);
      } catch (err) {}
    }
  }
};
</script>