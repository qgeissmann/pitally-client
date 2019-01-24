<template>
  <v-data-table
    v-model="$store.deviceList"
    :headers="headers"
    :items="devicesData"
    item-key="hostname"
    select-all
  >
    <template slot="items" slot-scope="props">
      <td>
        <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
      </td>
      <td>
        <a :href="'http://' + props.item.hostname" width="100">{{ props.item.hostname }}</a>
      </td>
      <td>{{ props.item.ip }}</td>
      <td>{{ props.item.mac }}</td>
    </template>

  </v-data-table>
</template>
<script>
export default {  
  name: 'DeviceTable',
  data: () => ({
    headers: [
      { text: 'Name', value: 'hostname'},
      { text: 'IP address', value: 'ip'},
      { text: 'MAC', value: 'mac' },
    ]
  }),
  computed: {
    devicesData() {
      return this.$store.deviceList
    }
  },
}
</script>
<style scoped>
</style>

