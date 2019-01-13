<template>
  <div class>
    <div class="preview fixed absolute--fill bg-light-gray">
      <pre>{{ $store.$data }}</pre>
    </div>

    <div class="formcontainer pa4 bg-white relative z-1 shadow-1">
      <div class="flex">
        <CameraSettingsForm/>
        <div>
          <div>
            <button type="button">Download</button>
            <button type="button">Delete</button>
          </div>
          <div>
            <div>
              <table></table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CameraSettingsForm from '../CameraSettingsForm'
export default {
  name: 'IndexRoute',
  components: {
    CameraSettingsForm,
  },
  data: () => ({

  }),
}
</script>
<style scoped>
.formcontainer {
  margin-left: 50%;
  min-height: 100vh;
}
</style>
