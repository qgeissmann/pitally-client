import axios from "axios";
import dayjs from "dayjs";
import Vue from "vue";

const httpClient = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:5000" : "/"
});

export default new Vue({
  data: () => ({
    devMode: process.env.NODE_ENV,
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
      resolution: "1640x1232",
      bitrate: 2500000,
      fps:25,
      duration:-1,
    },
    previewImg: null,
    videoPreviewImg: null, 
    images: [],
    loadings: {
      isCapturingImg: false,
      isStartingVideo: false,
      isStoppingVideo: false
    },
    selectedImgs: [],
    availableVideoResolutions: ["640x480", "1640x1232"],
    availableResolutions: ["640x480", "1640x1232", "3280x2464"],
    previewResolution: "640x480",
    isPreviewing: false,
    deviceList: [],
    deviceInfo: {}, // device_info = device_info = {"id": MACHINE_ID, "status": "idle", "since": time.time()}
    modal: null, // "upload", "video_start","",
    updateFile: '',
  }),
  created () {
    this.updateDeviceInfo()
    setInterval(this.updateDeviceInfo, 1000);
    setInterval(this.updateAllDevicesInfo, 3000);
    setInterval(this.previewVideo, 1000);
  },
  destroyed () {
    clearInterval(this.updateDeviceInfo);
    clearInterval(this.updateAllDevicesInfo);
    clearInterval(this.previewVideo);
  },

  methods: {
    async updateDeviceInfo() {
      try{
        const response = await httpClient.get("/device_info");
        this.deviceInfo = response.data;
        }
      catch(e){
        console.log("no_info");
        this.deviceInfo.status="unreachable"
      }
    },

    async updateAllDevicesInfo() {
      if(process.env.NODE_ENV === "development"){
        return null;
      }
      if (process.env.VUE_APP_MOCK){
        return null;
      } 

      for(const i in this.deviceList){
        const url = this.deviceList[i].url + "/device_info"
        if(url){
          axios.get(url).then((response) => {
            console.log(response.data)
          for(const k in response.data){
            this.deviceList[i][k] = response.data[k]; 
            }}
            )
          }          
        }
    },

    async listDevices() {
      if(process.env.VUE_APP_MOCK){
        this.deviceList  = [
          { hostname: 'pitally-uvwxyz', url: 'http://pitally-uvwxyz.lan' , status: 'idle', ip: '1.2.3.4', selected:false},
          { hostname: 'pitally-fghijk', url: 'http://pitally-fghijk.lan', status: 'idle', ip: '1.2.3.5', selected:false},
          { hostname: 'pitally-klmnop', url: 'http://pitally-klmnop.lan', status: 'recording', ip:'1.2.3.4', selected:false},
        ]
      }
      else{
        const response = httpClient.get("/list_devices").then(
        response => {
          this.deviceList=response.data;
          for(const i in this.deviceList){
            this.deviceList[i]["selected"]=false;
          }
        });
      }
    },
    async startVideo(e, _settings) {
      const settings = _settings || this.postVideoData;
      console.log(this.postVideoData);
      
      settings['time'] = Date.now();
      
      try{
        this.loadings.isStartingVideo = true;
        await httpClient.post("/start_video", settings).then(
          response => {
            this.deviceInfo = response.data;         
          }
        )
      }
      finally{
        this.loadings.isStartingVideo = false;
      }
    },
    async stopVideo() {
      try{
        this.loadings.isStoppingVideo = true;
        await httpClient.post("/stop_video", {}).then(
          response => {
            this.deviceInfo = response.data;         
          }
        )
      }
      finally{
        this.loadings.isStoppingVideo = false;
      }
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
    },
    updateUpdateFile(file){
      this.updateFile =  file;
    },
    uploadUpdateFile(e_, port=8080, route="/"){
      console.log(this.updateFile)
      let formData = new FormData();
      formData.append('package_file', this.updateFile);
      var report = {}
      var promises = []
      var devs = this.selectedDevices;
      try{
          for(const i in devs){
            report[devs[i].hostname] = "processing"
            const url = devs[i].url
            const finalUrl = url + ":" + port + route
            const p = axios.post( finalUrl,
                        formData,
                        {
                          headers: {
                              'Content-Type': 'multipart/form-data'
                          }
                        }).then(function(){
                          report[devs[i].hostname] = "success"
                        }).catch(function(){
                          report[devs[i].hostname] = "failure"
                          console.log(finalUrl)
                        })
            promises.push(p)
            }
            console.log(report);
            axios.all(promises).then(function(){console.log("all finished")});
            console.log(report);

      }
      finally{
        //  this.modal="null"
        this.updateFile = ""
      }
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
    selectedDevices:{
      get(){
        const out = [];
        for(const i in this.deviceList){
          if(this.deviceList[i].selected)
          out.push(this.deviceList[i]);    
        }
        return out;
    }
    },
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

// // DeV test
// if (process.env.VUE_APP_MOCK) {
//   const createResp = () =>
//     new Promise(resolve => {
//       setTimeout(
//         () =>
//           resolve({
//             image:
//               "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
//             prefix: ""
//           }),
//         1000
//       );
//     });
//   httpClient.interceptors.response.use(
//     function(response) {
//       // Do something with response data
//       return createResp();
//     },
//     function(error) {
//       // Do something with response error
//       return createResp();
//     }
//   );
// }
