<template>
  <div class>
    <div class="preview fixed absolute--fill bg-light-gray w-50">
      <div class="absolute right-0 ma3">
        <v-btn type="submit" color="primary" @click="$store.captureImage">
          <v-icon left>photo_camera</v-icon>Capture
        </v-btn>
        <div>
          <v-switch v-model="$store.isPreviewing" label="Preview"></v-switch>
        </div>
      </div>
      <pre>{{ $store.$data }}</pre>
    </div>

    <div class="settings bg-white relative z-1 shadow-1">
      <v-tabs color="primary" dark>
        <v-tab>Images</v-tab>
        <v-tab>Settings</v-tab>
        <v-tab-item>
          <div class="pa4">
            <!-- <div>
              <button type="button">Download</button>
              <button type="button">Delete</button>
            </div>-->
            <p v-if="!$store.images.length">You don't have any image for now</p>
            <div v-else>
              <ImagesTable/>
            </div>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div class="pa4">
            <CameraSettingsForm/>
          </div>
        </v-tab-item>
      </v-tabs>
    </div>
  </div>
</template>

<script>
import CameraSettingsForm from '../CameraSettingsForm'
import ImagesTable from '../ImagesTable'
export default {
  name: 'IndexRoute',
  components: {
    CameraSettingsForm,
    ImagesTable,
  },
  data: () => ({

  }),
}
</script>
<style scoped>
.settings {
  margin-left: 50%;
  min-height: 100vh;
}
</style>
