<template>
  <div>
    <router-link :to="{path:'/networkCreate/'+netId}">
      <img :src="imgUrl">
      <div>{{ netName }}</div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NetworkBlock',
  data () {
    return {}
  },
  props: ['imgUrl', 'netName', 'netId']
}
</script>

<style scoped>

</style>