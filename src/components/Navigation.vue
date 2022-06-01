<template>
  <div id="top">
    <div id="title">Heldon</div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">首页</el-menu-item>
      <el-menu-item index="2">创作</el-menu-item>
      <el-menu-item index="3">收藏</el-menu-item>
      <el-menu-item index="4">我的</el-menu-item>
    </el-menu>
    <img src="../assets/picture/background.png" class="user_picture">
  </div>
</template>

<script>
export default {
  name: "Navigation",
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped>
#top{
  background: white;
  display: flex;
}
#title{
  float: left;
  color: #006e55;
  font-size: 32px;
  font-weight: 900;
  line-height: 55px;
  margin: 0 200px 0 100px;
}
.el-menu-demo{
  float: left;
  font-size: 20px;
}
.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: 5px solid #006e55;
  color: #006e55;
}
.el-menu-item {
  font-size: 20px;
  padding: 0 55px;
}
.user_picture{
  width: 100px;
  height: 100px;
}
</style>