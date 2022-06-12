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
      this.$confirm('此操作将永久删除该关系网，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('http://www.pandub.cn:8080/network/deleteNetworkByNetId/' + this.netId)
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


.img-box {
  width: 100px;
  height: 170px;
  padding: 20px;

  .btn {
  }

}
</style>