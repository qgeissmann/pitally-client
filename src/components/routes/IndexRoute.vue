<template>
  <div class>
   <pre class="absolute z-2 top-0">{{ $store.$data }}</pre>
  <div class="pa4">
  <v-btn
        type="submit"
        color="primary"
        @click="$store.listDevices"
      >
        <v-icon left>photo_camera</v-icon>Map
      </v-btn>
  <DeviceTable/>
  </div>
   </div>

</template>

<script>
import DeviceTable from '../DeviceTable'
export default {
  name: 'IndexRoute',
  components: {
    DeviceTable
  },
  data: () => ({

  }),
}
</script>
<style scoped>
</style>
