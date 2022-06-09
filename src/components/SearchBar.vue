<template>
  <div id="searchbar">
    <el-input type="text" placeholder="输入搜索内容" v-model="keyWord" id="sb-input"></el-input>

    <el-button id="sb-button" @click="searchRns">搜索</el-button>
<!--    <ul >-->
<!--      <li v-for="(p,index) of filRns" :key="index">-->
<!--        {{ p.net_id }}-{{ p.net_name }}-->
<!--      </li>-->
<!--    </ul>-->
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      keyWord:'',
      rns:[],
      //filRns:[] //如果使用watch实现的话就需要这个来暂存每一次过滤的结果
    };
  },
  /* computed实现对后端来的数据进行模糊查询*/
  computed:{
    filRns(){
      return this.rns.filter((p)=>{
        return p.net_name.indexOf(this.keyWord) !== -1
      })
    }
  },
  /* watch实现对后端来的数据进行模糊查询*/
  /*
  watch:{
    keyWord:{
      immediate:true, //上来就执行一次handler里的代码，保证模糊查询的用户交互（一开始就监视）
      handler(val) {
        this.filRns = this.rns.filter((p) => {
          return p.net_name.indexOf(val) !== -1
        })
      }
    }
  }*/

  methods:{
    sendRnRequest(){
      axios.get('http://www.pandub.cn:8080/')
    },
    searchRns(){
      axios.get('http://www.pandub.cn:8080/user/getInfoByNickname/'+this.keyWord)
          .then((data) => {
            console.log(data)
          })
          .catch((err) => {
            console.log(err)
          })
    }
  }
};
</script>

<style>
#searchbar{
  /* 弹性布局 水平、垂直居中 */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
#sb-input{
  position: relative;
  margin-left: 10px;
  width: 1080px;
  border: rgba(0, 110, 85, 1) solid 1px;
  border-radius: 33px;
  font-size: 15px;
}
#sb-button{
  position: relative;
  margin-left: 10px;
  width: 100px;
  color: rgba(255, 255, 255, 1);
  background-color: rgba(0, 110, 85, 1);
  border-radius: 16px;
  font-size: 18px;
}
</style>