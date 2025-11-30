<template>
  <form @submit.prevent="onSubmit">

    <p v-if="errorsPresent" class="ui negative message">
      {{ errorText }}
    </p>

    <div class="ui labeled input fluid" style="margin-bottom: 0.5rem;">
      <div class="ui label"><i class="united kingdom flag"></i> English</div>
      <input v-model="word.english" placeholder="Enter English..." />
    </div>

    <div class="ui labeled input fluid" style="margin-bottom: 0.5rem;">
      <div class="ui label"><i class="germany flag"></i> German</div>
      <input v-model="word.german" placeholder="Enter German..." />
    </div>

    <div class="ui labeled input fluid" style="margin-bottom: 0.5rem;">
      <div class="ui label"><i class="vietnam flag"></i> Vietnamese</div>
      <input v-model="word.vietnamese" placeholder="Enter Vietnamese..." />
    </div>

    <div class="ui labeled input fluid" style="margin-bottom: 0.5rem;">
      <div class="ui label"><i class="picture icon"></i> Image (Optional)</div>
      <input
        type="text"
        v-model="word.imageUrl"
        placeholder="https://example.com/image.png or /uploads/file.png"
      />
    </div>

    <div class="field" style="margin-top: 0.75rem;">
      <label>Upload image from your computer (Optional)</label>
      <input type="file" accept="image/*" @change="onFileChange" />

      <div
        v-if="uploading"
        class="ui active inline loader"
        style="margin-top: 0.5rem;"
      ></div>

      <p
        v-if="uploadError"
        class="ui negative message"
        style="margin-top: 0.5rem;"
      >
        {{ uploadError }}
      </p>
    </div>

    <div
      v-if="word.imageUrl"
      style="margin-top: 1rem; display: flex; justify-content: center;"
    >
      <img
        :src="word.imageUrl"
        alt="Preview"
        style="max-height: 160px; object-fit: contain;"
      />
    </div>

    <div style="display: flex; justify-content: center; margin-top: 1rem;">
      <button class="ui primary button" type="submit">Save Word</button>
    </div>

  </form>
</template>

<script>
import axios from "axios";

export default {
  name: "word-form",
  props: {
    word: {
      type: Object,
      default: () => ({
        english: "",
        german: "",
        vietnamese: "",
        imageUrl: ""
      })
    }
  },
  data() {
    return {
      errorsPresent: false,
      errorText: "",
      uploading: false,
      uploadError: null
    };
  },
  methods: {
    async onFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file); 

      this.uploading = true;
      this.uploadError = null;

      try {
        const res = await axios.post(
          "http://localhost:3000/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        this.word.imageUrl = res.data.imageUrl;
      } catch (err) {
        console.error(
          "Upload error:",
          err.response?.status,
          err.response?.data || err.message
        );

        this.uploadError =
          "Failed to upload image: " +
          (err.response?.data?.error ||
            `${err.response?.status || ""} ${err.message}`);
      } finally {
        this.uploading = false;
      }
    },

    onSubmit() {
      const english = (this.word.english || "").trim();
      const german  = (this.word.german || "").trim();
      const vietnamese = (this.word.vietnamese || "").trim();

      const hasDigits = str => /\d/.test(str);
      const isEmpty = str => !str || str.trim().length === 0;

      if (isEmpty(english) || isEmpty(german) || isEmpty(vietnamese)) {
        this.errorText = "Fields must not be empty or whitespace only.";
        this.errorsPresent = true;
      return;
      }

      if (hasDigits(english) || hasDigits(german) || hasDigits(vietnamese)) {
        this.errorText = "Fields must not contain numbers.";
        this.errorsPresent = true;
      return;
      }

      this.errorsPresent = false;
      this.errorText = "";

      this.word.english = english;
      this.word.german = german;
      this.word.vietnamese = vietnamese;

      this.$emit("createOrUpdate", this.word);
    }
  }
};
</script>