<template>
  <div>
    <h1 style="text-align: center;">Edit Word</h1>

    <word-form
      v-if="loaded"
      :word="word"
      @createOrUpdate="createOrUpdate"
    />

    <div v-else style="margin-top: 2rem; text-align: center;">
      <div class="ui active inline loader"></div>
    </div>

    <div style="margin-top: 20px; text-align: center;">
      <router-link :to="{ name: 'words' }" class="ui button red">
        Back to List
      </router-link>
    </div>
  </div>
</template>

<script>
import WordForm from "../components/WordForm.vue";
import { api } from "../helpers/helpers";

export default {
  name: "edit-word",
  components: { WordForm },
  data() {
    return {
      word: {
        _id: null,        
        english: "",
        german: "",
        vietnamese: "",
        imageUrl: ""
      },
      loaded: false
    };
  },
  async created() {
    try {
      const id = this.$route.params.id;

      const data = await api.getWord(id);

      this.word = {
        _id: data._id,                        
        english: data.english || "",
        german: data.german || "",
        vietnamese: data.vietnamese || "",
        imageUrl: data.imageUrl || ""
      };

      this.loaded = true;
    } catch (err) {
      console.error(err);
      this.flash("Failed to load word", "error");
      this.$router.push({ name: "words" });
    }
  },
  methods: {
    async createOrUpdate(word) {
      try {
        await api.updateWord(word);

        this.flash("Word updated successfully!", "success");
        this.$router.push({ name: "words" });
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>