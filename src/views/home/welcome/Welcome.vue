<template>
  <div id="content">
    <div class="el-container-search" id="search">
      <SearchBar/>
    </div>
    <div class="el-container-rns" id="rns-wrapper">
      <div v-for="item in categories">
        <CategorizedRns :category="item"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
//引入组件
import SearchBar from '@/components/SearchBar'
import CategorizedRns from '@/components/CategorizedRns'

export default {
  name: 'Welcome',
  //注册组件
  components: { SearchBar, CategorizedRns },
  data () {
    return {
      categories: []
    }
  },
  created () {
    axios.get('http://116.62.36.50:8080/tag/getTags').then(({ data }) => {
      //console.log(data)
      data.forEach((category) => {
        this.categories.push({
          tagId: category.tagId,
          tagName: category.tagName
        })
      })
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
}

.el-container-search {
  background: #ffffff;
  margin: 1% 1% 0 1%;
  width: 80%;
  height: 90px;
  box-shadow: 5px 5px 5px #cccccc;
}

.el-container-rns {
  /* 弹性布局 水平、垂直居中 */
  display: flex;
  flex-direction: column;
  background: #ffffff;
  margin: 1% 1% 0 1%;
  width: 80%;
  height: auto;
  box-shadow: 5px 5px 5px #cccccc;
}

</style>