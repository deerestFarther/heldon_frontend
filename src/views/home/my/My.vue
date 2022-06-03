<template>
  <div id="content">
    <el-container>
      <el-aside width="20%" style="margin:5% 0 0 6%;height: 615px;">
        <user-picture/>
      </el-aside>
      <el-main class="main">
        <div style="font-size: 20px">基本信息</div>
        <el-divider></el-divider>
        <div class="row">
          <div class="name">用户昵称</div>
          <div class="s_name">hhhhhh</div>
        </div>
        <div class="row">
          <div class="name">注册时间</div>
          <div class="s_name">hhhhhh</div>
        </div>
        <div class="row">
          <div class="name">上次登陆时间</div>
          <div class="s_name">hhhhhh</div>
        </div>
        <div class="row">
          <div class="name">个人简介</div>
          <div class="s_name" v-show="!inputVisible">hhhhhh</div>
          <i class="el-icon-edit-outline" style="margin-left: 10px" @click="inputVisible=true"  v-show="!inputVisible"></i>
          <div v-show="inputVisible" class="s_name" style="width: 70%;">
            <el-input v-model="input"
                      placeholder="请添加收藏夹描述"
                      type="textarea"
                      maxlength="30"
                      show-word-limit></el-input>
            <el-button type="success" icon="el-icon-check" circle
                       style="position: fixed; margin-left: 10px"
                       @click="inputVisible=false"></el-button>
            <el-button type="danger" icon="el-icon-close" circle
                       style="position: fixed;"
                       @click="inputVisible=false"></el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import UserPicture from "@/components/UserPicture";
export default {
  name: "My",
  components: {UserPicture},
  data(){
    return{
      inputVisible:false,
      input:''
    }
  }
}
</script>

<style scoped>
#content{
  background: #f8f8f8;
}
.main{
  margin: 5% 10% 2% 3%;
  background: white;
}
.row{
  margin: 70px;
  font-size: 18px;
  line-height: 20px;
  display: flex;
}
.name{
  float: left;
}
.s_name{
  margin-left: 20px;
  float: left;
}
.el-button+.el-button, .el-checkbox.is-bordered+.el-checkbox.is-bordered {
  margin-left: 60px;
}
</style>