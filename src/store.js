import axios from "axios";
import dayjs from "dayjs";
import Vue from "vue";

const httpClient = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "localhost:5000" : "/"
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
    loadings: {
      isCapturingImg: false
    },
    selectedImgs: [],
    availableResolutions: ["640x480", "1640x1232", "3280x2464"],
    previewResolution: "640x480",
    isPreviewing: false
  }),
  methods: {
    async captureImage(settings) {
      const timestamp = dayjs().toJSON();
      this.loadings.isCapturingImg = true;
      try {
        const { prefix, image } = await httpClient.post("/capture/1", settings);
        const newImage = {
          filename: `${prefix}_${timestamp}.jpg`,
          image,
          selected: true
        };
        this.images.push(newImage);
        return newImage;
      } finally {
        this.loadings.isCapturingImg = false;
      }
    },
    removeImages(imgs) {
      for (const img of imgs) {
        const index = this.images.findIndex(_img => _img === img);
        Vue.delete(this.images, index);
      }
      this.selectedImgs = [];
    }
  },
  computed: {
    currentResolution: {
      get() {
        return this.isPreviewing
          ? this.previewResolution
          : this.settings.resolution;
      },
      set(val) {
        this.settings.resolution = val;
      }
    }
  }
});

// DeV test
if (process.env.VUE_APP_MOCK) {
  const createResp = () =>
    new Promise(resolve => {
      setTimeout(
        () =>
          resolve({ image: "https://via.placeholder.com/640x480", prefix: "" }),
        1000
      );
    });
  httpClient.interceptors.response.use(
    function(response) {
      // Do something with response data
      return createResp();
    },
    function(error) {
      // Do something with response error
      return createResp();
    }
  );
}
