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
      </el-main>
    </el-container>
  </div>
</template>

<script>
import UserPicture from '@/components/UserPicture'
import NetworkBlock from '@/views/home/creation/components/NetworkBlock'

export default {
  name: 'Creation',
  components: { UserPicture, NetworkBlock },
  data () {
    return {
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
      ]
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
}
</style>