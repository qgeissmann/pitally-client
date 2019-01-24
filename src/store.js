import axios from "axios";
import dayjs from "dayjs";
import Vue from "vue";

const httpClient = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:5000" : "/"
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
    videoSettings: {
      prefix: "my-video",
      resolution: "640x480",
      bitrate: 2500000,
      fps:25,
      duration:-1,
    },
    previewImg: null,
    videoPreviewImg: null, 
    images: [],
    loadings: {
      isCapturingImg: false
    },
    selectedImgs: [],
    availableVideoResolutions: ["640x480", "1640x1232"],
    currentVideoResolution: "1640x1232",
    availableResolutions: ["640x480", "1640x1232", "3280x2464"],
    previewResolution: "640x480",
    isPreviewing: false,
    deviceList: [],
    deviceInfo: {} // device_info = device_info = {"id": MACHINE_ID, "status": "idle", "since": time.time()}
  }),
  created () {
    this.updateDeviceInfo()
    setInterval(this.updateDeviceInfo, 1000);
    setInterval(this.previewVideo, 1000);
  },
  destroyed () {
    clearInterval(this.updateDeviceInfo);
    clearInterval(this.previewVideo);

  },

  methods: {
    async updateDeviceInfo() {
      try{
        const response = await httpClient.get("/device_info")
        this.deviceInfo = response.data;
        }
      catch(e){
        console.log("no_info")
        this.deviceInfo.status="unreachable"
      }
    },

    async listDevices() {
      const response = httpClient.get("/list_devices").then(
        response => {
          this.deviceList=response.data;
        });
    },
    async startVideo(e, _settings) {
      const settings = _settings || this.postVideoData;
      console.log(this.postVideoData);
      
      settings['time'] = Date.now();
      await httpClient.post("/start_video", settings).then(
        response => {
          this.deviceInfo = response.data;         
        }
      )
    },
    async stopVideo() {
      await httpClient.post("/stop_video", {}).then(
        response => {
          this.deviceInfo = response.data;         
        }
      )
    },
    async previewVideo() {
      if(this.deviceInfo.status != "recording"){
        return null;
      }
        
      await httpClient.post("/video_preview").then(
        response => {
          const newImage = {
            "image": response.data.image,
            "videoBasename": response.data.video_name,
          };
          console.log(newImage);
          this.videoPreviewImg = newImage;
          
        }
      )
    },
    async captureImage(e, _settings) {
      const settings = _settings || this.postCaptureData;
      const timestamp = dayjs().toJSON();
      this.loadings.isCapturingImg = true;

      try {
        const { prefix, image } = await httpClient.post("/capture/1", settings);
        const newImage = {
          timestamp,
          filename: `${prefix}_${timestamp}.jpg`,
          image,
          selected: true
        };
        this.images.unshift(newImage);
        return newImage;
      } finally {
        this.loadings.isCapturingImg = false;
      }
    },
    async previewImage(_settings) {
      const settings = _settings || this.postCaptureData;
      const timestamp = dayjs().toJSON();
      await httpClient.post("/capture/1", settings).then(
        response => {
          const newImage = {
            "image": response.data.image,
            "timestamp": timestamp,
          };
          console.log(newImage);
          this.previewImg = newImage;
          
        }
      )
    },
    removeImages(imgs) {
      for (const img of imgs) {
        const index = this.images.findIndex(_img => _img === img);
        Vue.delete(this.images, index);
      }
      this.selectedImgs = [];
    }
  },
  watch: {
    isPreviewing(val) {
      const previewRecursive = async () => {
        await this.previewImage();
        if (this.isPreviewing) previewRecursive();
      };
      if (val) {
        previewRecursive();
      }
    }
  },
  computed: {
    postVideoData: { 
      get () {
        const res = this.videoSettings.resolution.split("x");
        const out = this.videoSettings;
        out['w'] = res[0];
        out['h'] = res[1];
        return(out)
      }
    } ,
    postCaptureData: { 
      get () {
        const res = this.settings.resolution.split("x");
        const out = this.settings;
        out['w'] = res[0];
        out['h'] = res[1];
        return(out)
      }
    } ,
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
          resolve({
            image:
              "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
            prefix: ""
          }),
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
