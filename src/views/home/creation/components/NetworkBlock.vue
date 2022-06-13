<template>
  <div>
    <div class="img-box">
      <img class="img" :src="imgUrl">
      <div class="btn">
        <el-button icon="el-icon-view" circle @click="toNetworkView" size="small"></el-button>
        <el-button icon="el-icon-edit-outline" circle @click="toNetworkCreate" size="small"></el-button>
        <el-button icon="el-icon-delete" circle @click="deleteNetwork" size="small"></el-button>
      </div>
    </div>
    <div class="net-name" style="padding: 10px 0;">{{ netName }}</div>
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
      const net = this.$router.resolve({path: '/networkView', query: {netId: this.netId}})
      window.open(net.href,'_blank')
    },
    toNetworkCreate () {
      const net = this.$router.resolve({path: '/networkCreate', query: {netId: this.netId}})
      window.open(net.href,'_blank')
    },
    deleteNetwork () {
      this.$confirm('此操作将永久删除该关系网，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('http://116.62.36.50:8080/network/deleteNetworkByNetId/' + this.netId)
            .then(({ data }) => {
              this.$message({
                type: 'success',
                message: '关系网删除成功!'
              })
              this.$emit('networkDeleted')
            })
            .catch((err) => {
              this.$message({
                type: 'error',
                message: '关系网删除成功!'
              })
            })
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

.img{
  width: 100%;
}

.img-box {
  .btn {
    padding: 5px 0;
  }
}
</style>