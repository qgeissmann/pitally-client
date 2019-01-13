<template>
  <div class="container pa4">
    <!-- <div class="">
      <svg class="img-fluid" style="width:100%" viewBox="0 0 640 480">
        <image id="captured_image" xlink:href width="100%" height="100%" position="absolute"></image>

        <image
          id="pitally_animation"
          href="~@/assets/svg/pitally_animation.svg"
          width="100%"
          height="100%"
          position="absolute"
          class="show_during_capture_only"
        ></image>
        <g class="show_during_preview_only">
          <image id="preview_image" href width="100%" height="100%" position="absolute"></image>

          <text
            id="preview_stamp"
            x="15"
            y="30"
            fill="black"
            stroke="rgba(255,255,255,200)"
            stroke-width="0.5"
            font-size="32"
            font-weight="900"
          ></text>
        </g>
      </svg>
      <div id="error" style="display: none;">
        <button id="restart_camera_button" class="btn btn-primary">Restart Camera</button>
        <button id="restart_server_button" class="btn btn-danger">Restart Server</button>

        <h2>Error!</h2>
        <code></code>
      </div>
    </div>-->
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
