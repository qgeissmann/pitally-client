<template>
  <form @submit.prevent="onSubmit" novalidate role="form" class="form">
    <div>
      <button type="submit">Capture</button>
      <label>
        <input type="checkbox"> Preview
      </label>
    </div>
    <div class="fields">
      <FormItem label="Prefix">
        <input type="text" value="my-image" name="prefix">
      </FormItem>
      <FormItem label="Resolution">
        <select name="resolution"></select>
      </FormItem>
      <FormItem label="ISO">
        <input type="number" value="200" name="iso" min="100" max="800" step="100">
      </FormItem>
      <FormItem label="Shutter speed">
        <input
          type="number"
          value="10000"
          name="shutter_speed"
          min="1000"
          max="10000000"
          step="100"
        >
      </FormItem>
      <FormItem label="Red gain">
        <input type="number" value="1" step="0.05" min="0.0" max="8.0" name="awb_gain_r">
      </FormItem>
      <FormItem label="Blue gain">
        <input
          type="number"
          value="1"
          step="0.05"
          min="0.0"
          max="8.0"
          name="awb_gain_b"
          id="gain_b"
        >
      </FormItem>
    </div>
  </form>
</template>
<script>
export default {
  name: 'CameraSettingsForm',
  methods: {
    onSubmit() {
      this.$store.captureImage()
    }
  }
}
</script>
<style scoped>
.fields {
  display: grid;
  grid-gap: 1.2rem;
}
</style>

