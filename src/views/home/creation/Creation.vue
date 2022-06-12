<template>
  <div id="content">
    <el-container>
      <el-aside width="20%" style="margin:5% 0 0 6%;height: 615px;">
        <user-picture/>
      </el-aside>
      <el-main class="main">
        <div v-for="item in networkList" :key="item.netId">
          <network-block :img-url="item.url" :net-id="item.netId" :net-name="item.netName"
                         @networkDeleted="getNetworkListByUserId"></network-block>
        </div>
        <div>
          <el-button icon="el-icon-plus" @click="dialogVisible=true"></el-button>
          <el-dialog :visible.sync="dialogVisible" width="30%" :close-on-click-modal=false>

            <el-form :model="networkForm" status-icon :rules="rules" ref="nodeIdForm" label-width="100px"
                     class="demo-ruleForm">
              <cropper-image @imgUploaded="updateNetPic($event,networkForm)" style="margin-bottom: 10px"
                             :img-url="networkForm.url" v-if="dialogVisible"></cropper-image>
              <el-form-item label="关系网名称" prop="netName">
                <el-input v-model="networkForm.netName" maxlength="15" show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="关系网标签" prop="tagId">
                <el-select v-model="networkForm.tagId" placeholder="请选择">
                  <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"
                           @click="addNewNetwork(networkForm.netName,networkForm.tagId,networkForm.url)">
                  提交
                </el-button>
                <el-button @click="dialogVisible=false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import UserPicture from '@/components/UserPicture'
import NetworkBlock from '@/views/home/creation/components/NetworkBlock'
import axios from 'axios'
import CropperImage from '@/views/home/creation/components/CropperImage'

export default {
  name: 'Creation',
  components: { CropperImage, UserPicture, NetworkBlock },
  data () {
    return {
      dialogVisible: false,
      networkList: [],
      networkForm: {
        netName: '',
        tagId: null,
        url: 'https://relation-network.oss-cn-chengdu.aliyuncs.com/pictures/defaultNetwork.png',
      },
      rules: {
        netName: [{ required: true, message: '请输入关系网名称', trigger: 'blur' }],
        tagId: [{ required: true, message: '请选择关系网标签', trigger: 'blur' }],
      },
      tagOptions: [],
    }
  },
  mounted () {
    this.getTags()
    this.getNetworkListByUserId()
  },
  methods: {
    updateNetPic (event, data) {
      data.url = event
    },

    addNewNetwork (netName, tagId, url) {
      axios.post('http://localhost:8080/network/insertNetwork/',
          {
            netName, tagId,
            userId: sessionStorage.getItem('userId'), url,
          })
          .then(({ data }) => {
            this.dialogVisible = false
            this.$message({
              type: 'success',
              message: '创建成功!'
            })
            this.getNetworkListByUserId()
          })
          .catch((err) => {
            console.log(err)
          })
    },
    getNetworkListByUserId () {
      this.networkList = []
      axios.get('http://localhost:8080/network/getNetworkByUserId/' + sessionStorage.getItem('userId'))
          .then(({ data }) => {
            data.forEach((net) => {
              this.networkList.push({
                netId: net.netId,
                netName: net.netName,
                url: net.ext3,//ext3存放关系网的缩略图
              })
            })
          })
          .catch((err) => {
            console.log(err)
          })
    },
    getTags () {
      axios.get('http://localhost:8080/tag/getTags')
          .then(({ data }) => {
            data.forEach((tag) => {
              this.tagOptions.push({
                value: tag.tagId,
                label: tag.tagName,
              })
            })
          })
          .catch((err) => {
            console.log(err)
          })
    }
  }
}
</script>

<style scoped>
#content {
  background: #f8f8f8;
}

.main {
  padding: 0;
  margin: 5% 10% 2% 3%;
  background: white;
  display: flex;
}
</style>