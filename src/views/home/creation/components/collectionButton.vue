<template>
  <div>
    <el-tooltip effect="dark" content="取消收藏" placement="bottom">
      <el-button class="el-icon-star-on" circle style="color: gold;font-size: 20px"
                 v-show="ifCollected" @click="cancelCollect"></el-button>
    </el-tooltip>
    <el-tooltip effect="dark" content="收藏" placement="bottom">
      <el-button class="el-icon-star-off" circle style="color: gold;font-size: 20px"
                 v-show="!ifCollected" @click="clickCollectionButton"></el-button>
    </el-tooltip>
    <el-dialog title="选择收藏夹" :visible.sync="collectionDialogVisible" width="30%" :close-on-click-modal=false>
      <el-form>
        <el-form-item prop="collectionId">
          <el-select v-model="collectionId" placeholder="请选择">
            <el-option
                v-for="item in collectionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="collect">提交</el-button>
          <el-button @click="collectionDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import axios from 'axios'

export default {
  name: 'collectionButton',
  props: ['netId'],
  data () {
    return {
      collectionDialogVisible: false,
      collectionOptions: [],
      collectionId: null,
      containsId: null,
      ifCollected: false
    }
  },
  computed: {},
  watch: {
    netId: function () {
      axios.post('http://www.pandub.cn:8080/collectionNetwork/add/cn/' + this.netId + '/' + sessionStorage.getItem('userId'))
          .then(({ data }) => {
            console.log(data)
            if (data.length > 0) {
              this.containsId = data[0].containsId
              this.ifCollected = true
            } else {
              this.ifCollected = false
            }
          })
          .catch((err) => {
            console.log(err)
            this.ifCollected = false
          })
    }
  },
  mounted () {
    this.getCollectionList()
  },
  methods: {
    getCollectionList () {
      axios.get('http://www.pandub.cn:8080/collection/get/collections/' + sessionStorage.getItem('userId'))
          .then(({ data }) => {
            this.collectionOptions = []
            data.forEach((col) => {
              this.collectionOptions.push({
                label: col.collectionName,
                value: col.collectionId,
              })
            })
          })
          .catch((err) => {
            console.log(err)
          })
    },
    clickCollectionButton () {
      this.collectionDialogVisible = true
      this.getCollectionList()
      this.collectionId = this.collectionOptions[0].value
    },
    //收藏
    collect () {
      axios.post('http://www.pandub.cn:8080/collectionNetwork/add/cn/' +
          this.collectionId + '&&' + this.netId)
          .then(({ data }) => {
            if (data) {
              this.collectionDialogVisible = false
              this.ifCollected = true
              console.log(data)
              this.containsId = data.containsId
              this.$message({
                type: 'success',
                message: '收藏成功'
              })
            } else {
              this.$message({
                type: 'error',
                message: '收藏失败'
              })
            }
          })
          .catch((err) => {
            console.log(err)
            this.$message({
              type: 'error',
              message: '收藏失败'
            })
          })
    },
    //取消收藏
    cancelCollect () {
      axios.delete('http://www.pandub.cn:8080/collectionNetwork/remove/cn/' + this.containsId)
          .then((data) => {
            if (data) {
              this.ifCollected = false
              this.$message({
                type: 'success',
                message: '取消收藏成功'
              })
            } else {
              this.$message({
                type: 'error',
                message: '取消收藏失败'
              })
            }
          })
          .catch((err) => {
            console.log(err)
            this.$message({
              type: 'error',
              message: '取消收藏失败'
            })
          })
    }
  }
}
</script>


<style scoped>

</style>