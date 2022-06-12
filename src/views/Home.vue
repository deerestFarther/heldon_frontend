<template>
  <div>
  <el-container>
    <el-header>
      <div id="title">亿网达尽</div>
      <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" @select="handleSelect" :router="true">
        <el-menu-item index="/welcome">首页</el-menu-item>
        <el-menu-item index="/creation">创作</el-menu-item>
        <el-menu-item index="/collection">收藏</el-menu-item>
        <el-menu-item index="/my">我的</el-menu-item>
      </el-menu>
      <div style="display: inline-block;">
        <div class="img_content"/>
        <div class="username">{{ UserName }}</div>
        <div class="return" @click="back">退出</div>
      </div>
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      activeIndex: '/welcome',
      UserId:'',
      UserName:''
    };
  },
  created() {
    this.username()
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    back(){
      sessionStorage.clear();
      this.$router.push('/login')
    },
    username(){
      this.UserId=sessionStorage.getItem('userId');
      axios.get("http://www.pandub.cn:8080/user/getInfoByUserId/"+this.UserId).then(({data})=>{
        if (data) {
          this.UserName=data.nickname
          console.log('user',data.nickname)
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
#title{
  float: left;
  color: #006e55;
  font-size: 32px;
  font-weight: 900;
  line-height: 60px;
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
.img_content{
  background-image: url(../assets/picture/background.png);
  display: inline-block;
  background-repeat: no-repeat; /*背景图像不平铺*/
  background-position:center;/*图片居中显示*/
  background-size: cover; /*隐藏不需要显示的图片*/
  height: 50px;
  width: 50px;
  border-radius: 100px;
  float: left;
  margin-top: 7px;
}
.username{
  float: left;
  line-height: 60px;
  margin-left: 10px;
}

.return{
  float: left;
  line-height: 60px;
  margin-left: 10px;
  font-size: 12px;
}

.el-card__body, .el-main {
  padding: 0;
}
</style>