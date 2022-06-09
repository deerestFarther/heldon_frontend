<template>
  <div id="content">
    <el-container>
      <el-aside width="20%" style="margin:5% 0 0 6%;height: 615px;">
        <user-picture/>
      </el-aside>
      <el-main class="main">
        <div v-for="item in networkList" :key="item.netId">
          <network-block :img-url="item.url" :net-id="item.netId" :net-name="item.netName"></network-block>
        </div>
        <div>
          <el-button icon="el-icon-plus" @click="dialogVisible=true"></el-button>
          <el-dialog :visible.sync="dialogVisible" width="30%" :close-on-click-modal=false>
            <el-form :model="networkForm" status-icon :rules="rules" ref="nodeIdForm" label-width="100px"
                     class="demo-ruleForm">
              <el-form-item label="关系网名称" prop="nodeId">
                <el-input v-model="networkForm.netName" maxlength="15" show-word-limit></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="addNewNetwork(networkForm.netName)">提交</el-button>
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

export default {
  name: 'Creation',
  components: { UserPicture, NetworkBlock },
  data () {
    return {
      dialogVisible: false,
      networkList: [
        {
          netId: 2,
          url: 'http://relation-network.oss-cn-chengdu.aliyuncs.com/1654320896995_1dcff1a4.png',
          netName: '123'
        },
        {
          netId: 3,
          url: 'http://relation-network.oss-cn-chengdu.aliyuncs.com/1654320896995_1dcff1a4.png',
          netName: '123'
        },
        {
          netId: 4,
          url: 'http://relation-network.oss-cn-chengdu.aliyuncs.com/1654320896995_1dcff1a4.png',
          netName: '123'
        }
      ],
      networkForm: { netName: '' },
      rules: {}
    }
  },
  methods: {
    addNewNetwork (netName) {
      axios.post('http://www.pandub.cn:8080/network/insertNetwork/' + netName + '/' + sessionStorage.getItem('userId'))
          .then(({ data }) => {
            console.log(data)
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