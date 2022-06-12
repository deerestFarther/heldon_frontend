<template>
  <div>
    <div class="img-box">
      <img class="img" :src="imgUrl">
      <div class="btn">
        <el-button icon="el-icon-view" circle @click="toNetworkView"></el-button>
        <el-button icon="el-icon-edit-outline" circle @click="toNetworkCreate"></el-button>
        <el-button icon="el-icon-delete" circle @click="deleteNetwork"></el-button>
      </div>
    </div>
    <div class="net-name">{{ netName }}</div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'NetworkBlock',
  data () {
    return {}
  },
  methods: {
    toNetworkView () {
      this.$router.push({
        name: 'networkView',
        query: {
          netId: this.netId
        }
      })
    },
    toNetworkCreate () {
      this.$router.push({
        name: 'networkCreate',
        query: {
          netId: this.netId
        }
      })
    },
    deleteNetwork () {
      axios.delete(this.serverUrl + 'network/deleteNetworkByNetId/' + this.netId)
          .then(({ data }) => {

          })
          .catch((err) => {

          })
    }
  },
  props: ['imgUrl', 'netName', 'netId']
}
</script>

<style scoped lang="scss">
a {
  text-decoration: none;
  color: black;
}


.img-box {
  width: 100px;
  height: 170px;
  padding: 20px;

  .btn {
  }

}
</style>