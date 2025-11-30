<template>
  <div>
    <h2 class="ui header" style="text-align: center;">Test Yourself</h2>

    <div
      v-if="!current"
      style="display: flex; justify-content: center; margin-top: 1rem;"
    >
      <button class="ui button primary" @click="start">Start Test</button>
    </div>

    <div
      v-else
      class="ui segment"
      style="max-width: 500px; margin: 1rem auto;"
    >
      <h3>
        What is the
        <span v-if="targetLang === 'german'">German</span>
        <span v-else>Vietnamese</span>
        word for:
      </h3>

      <p style="text-align: center;"><strong>{{ current.english }}</strong></p>

      <div
        v-if="current.imageUrl"
        style="
          margin: 0.75rem 0 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          "
        >
        <img
          :src="current.imageUrl"
          :alt="`Image for ${current.english}`"
          style="max-height: 180px; object-fit: contain;"
        />
      </div>

      <div class="ui form">
        <div class="field">
          <input
            type="text"
            v-model="answer"
            :placeholder="targetLang === 'german'
              ? 'Type German...'
              : 'Type Vietnamese...'"
            @keyup.enter="check"
          />
        </div>
      </div>

      <div style="margin-top: 1rem; justify-content: center; display: flex; gap: 0.5rem;">
        <button class="ui button green" @click="check">Check</button>
        <button class="ui button blue" @click="next">Skip / Next</button>
        <button class="ui button red" @click="current = null">End Test</button>
      </div>

      <div style="margin-top: 1rem; justify-content: center; display: flex; gap: 0.5rem;">
        <div class="ui buttons">
          <button
            class="ui button"
            :class="{ positive: targetLang === 'german' }"
            @click="setTarget('german')"
          >
            German
          </button>
          <button
            class="ui button"
            :class="{ positive: targetLang === 'vietnamese' }"
            @click="setTarget('vietnamese')"
          >
            Vietnamese
          </button>
        </div>
      </div>

      <div
        v-if="result"
        class="ui message"
        :class="result.correct ? 'positive' : 'negative'"
        style="margin-top: 1rem;"
      >
        <p>{{ result.message }}</p>
        <p>
          Correct answer:
          <strong>
            {{ targetLang === 'german' ? current.german : current.vietnamese }}
          </strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "../helpers/helpers";

export default {
  name: "test-words",
  data() {
    return {
      words: [],
      current: null,
      answer: "",
      targetLang: "german",
      result: null
    };
  },
  async created() {
    try {
      const res = await api.getWords();
      this.words = res.data || res;
    } catch (e) {
      this.flash("Failed to load words for test", "error");
    }
  },
  methods: {
    start() {
      if (!this.words.length) {
        this.flash("No words available to test.", "warning");
        return;
      }
      this.next();
    },
    next() {
      if (!this.words.length) {
        this.current = null;
        return;
      }

      const index = Math.floor(Math.random() * this.words.length);
      const word = this.words[index];

      if (word.imageUrl == null) {
        word.imageUrl = "";
      }

      this.current = word;
      this.answer = "";
      this.result = null;
    },
    setTarget(lang) {
      this.targetLang = lang;
      this.result = null;
      this.answer = "";
    },
    check() {
      if (!this.current) return;

      const user = (this.answer || "").trim().toLowerCase();
      const correct =
        this.targetLang === "german"
          ? (this.current.german || "").trim().toLowerCase()
          : (this.current.vietnamese || "").trim().toLowerCase();

      if (!user) {
        this.result = {
          correct: false,
          message: "Please type an answer."
        };
        return;
      }

      if (user === correct) {
        this.result = {
          correct: true,
          message: "Correct!"
        };
      } else {
        this.result = {
          correct: false,
          message: "Wrong!"
        };
      }
    }
  }
};
</script>