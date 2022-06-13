<template>
  <div>
    <div class="info-wrapper">
      <div class="category">{{ category.tagName }}</div>
      <div class="more">
        <!--        <el-button id="rn-more">更多</el-button>-->
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="4" v-for="(list,index) in lists" :key="index" style="margin-bottom: 20px">
          <el-card :body-style="{ padding: '0px',cursor:'pointer'}">
            <div @click="toNetworkView (list.netId)">
              <img :src="list.ext3" class="image">
              <div style="padding: 12px;">
                <!--              <div class="bottom clearfix">-->
                <!--                <div>-->
                <!--                  <img src="../../../assets/picture/like.png" class="like_at">-->
                <!--                  <div class="title">200</div>-->
                <!--                </div>-->
                <!--                <div>-->
                <!--                  <img src="../../../assets/picture/at.png" class="like_at">-->
                <!--                  <div class="title">200</div>-->
                <!--                </div>-->
                <!--              </div>-->
                <span>{{ list.netName }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CategorizedRns',
  components: {},
  data () {
    return {//保证每一次都是返回全新的
      lists: []
    }
  },

  created () {
    this.getRns()
  },
  props: ['category'],

  methods: {
    getRns () {
      axios.get('http://116.62.36.50:8080/userTag/get/net/' + this.category.tagId).then(({ data }) => {
        data.forEach((rn) => {
          axios.get('http://116.62.36.50:8080/network/getNetworkByNetId/' + rn).then(({ data }) => {
            if (data) {
              this.lists.push(data)
            }
          }).catch((err) => {
            console.log(err)
          })
        })
      })
    },
    toNetworkView (i) {
      console.log(i)
      const net = this.$router.resolve({ path: '/networkView', query: { netId: i } })
      window.open(net.href, '_blank')
    },
  }
}
</script>

<style scoped>
#content {
  background: #ffffff;
}

.info-wrapper {
  /* 弹性布局 水平、垂直居中 */
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  width: 100%;
  background: #ffffff;
}

.category {
  width: 64px;
  height: 48px;
  color: rgba(0, 0, 0, 1);
  font-size: 25px;
  line-height: 150%;
  text-align: center;
  font-weight: bold;
  margin: 1% 0 0 0
}

.image {
  width: 100%;
  display: block;
}

.el-row {
  display: flex;
  flex-wrap: wrap;
}


</style>