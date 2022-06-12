<template>
  <div>
    <el-tooltip class="item" effect="dark" content="取消收藏" placement="bottom">
      <el-button class="el-icon-star-on" circle style="color: gold;font-size: 20px"
                 v-if="ifCollected" @click="cancelCollect"></el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="收藏" placement="bottom">
      <el-button class="el-icon-star-off" circle style="color: gold;font-size: 20px"
                 v-if="!ifCollected" @click="collectNetwork"></el-button>
    </el-tooltip>
    <el-dialog title="选择收藏夹" :visible.sync="collectionDialogVisible" width="30%" :close-on-click-modal=false>
      <el-form>
        <el-form-item prop="collectionId">
          <el-select :value="collectionId" placeholder="请选择">
            <el-option
                v-for="item in collectionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="collectNetwork(collectionId)">提交</el-button>
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
      collectionId: null
    }
  },
  computed: {
    ifCollected: function () {
      if (!this.netId) return false
      axios.post('http://localhost:8080/collectionNetwork/add/cn/' + this.netId + '/' + sessionStorage.getItem('userId'))
          .then(({ data }) => {
            return data
          })
          .catch((err) => {
            console.log(err)
          })
      return false
    }
  },
  mounted () {
    this.getCollectionList()
  },
  methods: {

    getCollectionList () {
      axios.get('http://localhost:8080/collection/get/collections/' + sessionStorage.getItem('userId'))
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
    //收藏
    collectNetwork (collectionId) {
      this.collectionDialogVisible = true
      this.getCollectionList()
      collectionId = this.collectionOptions[0].value
    },
    //取消收藏
    cancelCollect () {

    }
  }
}
</script>


<style scoped>

</style>