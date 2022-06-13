<template>
  <div id="searchbar">
    <el-autocomplete class="inline-input"
                     v-model="state1"
                     :fetch-suggestions="querySearch"
                     placeholder="请输入内容"
                     @select="handleSelect"
                     id="sb-input"></el-autocomplete>

    <el-button id="sb-button" @click="searchRns">搜索</el-button>
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
      restaurants: [],
      state1: '',
      state2: ''
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
      axios.get('http://116.62.36.50:8080/')
    },
    searchRns(){
      axios.get('http://116.62.36.50:8080/user/getInfoByNickname/'+this.state1)
          .then((data) => {
            console.log(data)
          })
          .catch((err) => {
            console.log(err)
          })
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    loadAll() {
      return [
        { "value": "百年孤独人物关系网", "content": "" },
        { "value": "仙剑奇侠传人物关系网", "content": "" },
        { "value": "月亮与十五便士人物关系网", "content": "" },
      ];
    },
    handleSelect(item) {
      console.log(item);
    }
  },
  mounted() {
    this.restaurants = this.loadAll();
  }
};
</script>

<style scoped>
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