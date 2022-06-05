<template>
  <div id="content">
    <div id="info-wrapper">
      <div id="category">{{categories}}</div>
      <div id="more">
<!--        <el-button id="rn-more">更多</el-button>-->
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <div id="rn-wrapper">
      <RnThumbnail/>
      <RnThumbnail/>
      <RnThumbnail/>
      <RnThumbnail/>
    </div>
  </div>
</template>

<script>
import RnThumbnail from "@/components/RnThumbnail";
export default {
  name: "CategorizedRns",
  components:{RnThumbnail},
  data(){
    return {//保证每一次都是返回全新的
      categories:"篮球"

    };
  },
}
</script>

<style scoped>
#content{
  /* 弹性布局 水平、垂直居中 */
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: center;
  background: #ffffff;
}
#info-wrapper{
  /* 弹性布局 水平、垂直居中 */
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  width: 100%;
  background: #ffffff;
}
#category{
  width: 64px;
  height: 48px;
  color: rgba(0, 0, 0, 1);
  font-size: 25px;
  line-height: 150%;
  text-align: center;
  font-weight: bold;
  margin: 3% 3% 0 5%
}
#rn-wrapper{
  /* 弹性布局 水平、垂直居中 */
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;

  background: #ffffff;
}
</style>