<template>
  <div id="content">
    <img src="../assets/logo.png" id="rn-thumb"></img>
    <div id="rn-name">{{netName}}</div>
    <div id="rn-time">{{createTime}}</div>
  </div>
</template>

<script>
export default {
  name: "RnThumbnail",
  data(){
    return {
      netName:"全职高手",
      createTime:"2022-06-01 23:39:18"
    }
  }
}
</script>

<style scoped>
#content{
  /* 弹性布局 水平、垂直居中 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f8f8f8;
  /*调整组件内部的间距分别对应上、右、下、左*/
  padding: 0 12% 0 5%;
}
#rn-thumb{
  width: 180px;
  height: 180px;
}
</style>