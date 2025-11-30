import axios from "axios";
import Vue from "vue";
import vueFlashMessage from "vue-flash-message";
import "vue-flash-message/dist/vue-flash-message.min.css";

Vue.use(vueFlashMessage, {
  messageOptions: {
    timeout: 3000,
    pauseOnInteract: true
  }
});

const vm = new Vue();

const baseURL = "http://localhost:3000/words/";

const handleError = fn => async (...params) => {
  try {
    return await fn(...params);
  } catch (error) {
    const status = error?.response?.status;
    const statusText = error?.response?.statusText;
    const backendMsg = error?.response?.data?.error;

    const msg =
      backendMsg ||
      (status ? `${status}: ${statusText}` : error.message || "Request failed");

    vm.flash(msg, "error");

    throw error;
  }
};

export const api = {
  getWord: handleError(async id => {
    const res = await axios.get(baseURL + id);
    return res.data;
  }),
  getWords: handleError(async () => {
    const res = await axios.get(baseURL);
    return res.data;
  }),
  deleteWord: handleError(async id => {
    const res = await axios.delete(baseURL + id);
    return res.data;
  }),
  createWord: async function(payload) {
    try {
        const res = await axios.post(baseURL, payload);
        return res.data;
    } catch (error) {
        if (error.response && error.respoonse.status >= 500) {
            vm.flash("Server error occurred. Please try again later.", "error");
        }
        throw error;
    }
  },
  updateWord: handleError(async payload => {
    const res = await axios.put(baseURL + payload._id, payload);
    return res.data;
  })
};