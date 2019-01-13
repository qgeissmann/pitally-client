import axios from "axios";
import dayjs from "dayjs";
import Vue from "vue";

const httpClient = axios.create({
  baseURL: "https://api.example.com"
});

export default new Vue({
  data: () => ({
    settings: {
      iso: 200,
      resolution: "640x480",
      shutter_speed: 10000,
      awb_gain_r: 1,
      awb_gain_b: 1,
      prefix: "my-image"
    },
    images: [],
    selectedImgs: [],
    availableResolutions: ["640x480", "1640x1232", "3280x2464"],
    isPreviewing: false
  }),
  methods: {
    async captureImage(settings) {
      const timestamp = dayjs().toJSON();
      const { prefix, image } = await httpClient.post("/capture/1", settings);
      const newImage = {
        filename: `${prefix}_${timestamp}.jpg`,
        image,
        selected: true
      };
      this.images.push(newImage);
      return newImage;
    }
  }
});

// DeV test
if (process.env.NODE_ENV === "development") {
  httpClient.interceptors.response.use(
    function(response) {
      // Do something with response data
      return { image: "", prefix: "" };
    },
    function(error) {
      // Do something with response error
      return { image: "", prefix: "" };
    }
  );
}
