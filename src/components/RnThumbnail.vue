<template>
  <div id="content">
    <img :src="this.netImg" id="rn-thumb"></img>
    <div id="rn-name">{{ netName }}</div>
<!--    <div id="rn-time">{{ createTime }}</div>-->
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RnThumbnail",
  data() {
    return {
      netName:'',
      netImg:'',
      createTime:''
    }
  },
  props: ['netId'],
  created() {
    axios.get('http://localhost:8080/network/getNetworkByNetId/'+this.netId).then(({data})=>{
      if (data){
        this.netName = data.netName
        this.netImg = data.ext3
        this.createTime = data.createTime
      }
    })
  }
}
</script>

<style scoped>
#content {
  /* 弹性布局 水平、垂直居中 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f8f8f8;
  /*调整组件内部的间距分别对应上、右、下、左*/
  padding: 0 12% 0 5%;
}

#rn-thumb {
  width: 180px;
  height: 180px;
}
</style>