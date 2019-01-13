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
    settings: {
      iso: 200,
      shutter_speed: 10000,
      awb_gain_r: 1,
      awb_gain_b: 1,
      prefix: "my-image"
    },
    images: [],
    availableResolutions: ["640x480", "1640x1232", "3280x2464"],
    isPreviewing: false
  }),
  methods: {
    captureImage
  }
});
