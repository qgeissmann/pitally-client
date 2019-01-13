import axios from "axios";
import Vue from "vue";

async function captureImage(settings) {
  const timestamp = new Date().format("yyyy-mm-dd'T'HH:MM:ss");
  const { prefix, image } = await axios.post("/capture/1", settings);
  const newImage = {
    filename: `${prefix}_${timestamp}.jpg`,
    image,
    selected: true
  };
  return newImage;
}

export default new Vue({
  data: () => ({
    images: []
  }),
  methods: {
    captureImage
  }
});
