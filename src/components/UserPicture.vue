<template>
<div>
  <div class="user_picture"></div>
  <div class="user_name">{{ UserName }}</div>
<!--  <div class="user_info">-->
<!--    <div class="user_inf">-->
<!--      <div class="user_info_title">点赞</div>-->
<!--      <div class="user_info_num">3.5万</div>-->
<!--    </div>-->
<!--    <div class="user_inf">-->
<!--      <div class="user_info_title">收藏</div>-->
<!--      <div class="user_info_num">1030个</div>-->
<!--    </div>-->
<!--  </div>-->
</div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserPicture",
  data(){
    return{
      UserId:'',
      UserName:''
    }
  },
  created() {
    this.username()
  },
  methods:{
    username(){
      this.UserId=sessionStorage.getItem('userId');
      axios.get("http://116.62.36.50:8080/user/getInfoByUserId/"+this.UserId).then(({data})=>{
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
.user_picture{
  background-image: url(../assets/picture/background.png);
  display: inline-block;
  background-repeat: no-repeat; /*背景图像不平铺*/
  background-position:center;/*图片居中显示*/
  background-size: cover; /*隐藏不需要显示的图片*/
  height: 250px;
  width: 250px;
  border-radius: 10px;
  box-shadow: 10px 10px 5px #d0d0d0;
}
.user_name{
  font-size: 20px;
  font-weight: 900;
  margin:20px 30px;;
  text-align: left;
  color: #006e55;
}
.user_info{
  background: white;
  margin:20px 30px;
  display: flex;
}
.user_inf{
  float: left;
  line-height: 50px;
  margin: 0 22px;
}
.user_info_title{
  font-size: 12px;
  float: left;
  margin-right: 5px;
}
.user_info_num{
  font-size: 18px;
  float: left;
  color: #006e55;
}
</style>