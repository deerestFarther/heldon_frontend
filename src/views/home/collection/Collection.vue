<template>
<div id="content">
  <el-container>
    <el-aside width="20%" style="margin:5% 0 0 6%;height: 615px;">
      <user-picture/>
    </el-aside>
    <el-main class="main">
      <el-container>
        <el-aside width="200px">
          <div>
            <el-button @click="dialogVisible = true" id="button">
              <i class="el-icon-folder-add" style="float:left; font-size: 18px;line-height: 56px;padding: 0 8px 0 3px;"></i>
              <div style="float: left">新建文件夹</div>
            </el-button>
          </div>
          <el-dialog
              title="新建收藏夹"
              :visible.sync="dialogVisible"
              width="30%">
            <el-dialog
                width="30%"
                title="是否创建该收藏夹"
                :visible.sync="innerVisible"
                append-to-body>
              <div slot="footer" class="dialog-footer">
                <el-button @click="innerVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSuccess">确 定</el-button>
              </div>
            </el-dialog>
            <el-form :model="form">
              <el-form-item>
                <el-input v-model="form.name"
                          placeholder="请输入收藏夹名称"
                          maxlength="10"
                          show-word-limit></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="form.info"
                          type="textarea"
                          maxlength="30"
                          show-word-limit
                          placeholder="请输入收藏夹描述信息"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="innerVisible = true">确 定</el-button>
  </span>
          </el-dialog>

          <el-menu
                default-active="1"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose">
              <el-menu-item index="1">
                <i class="el-icon-folder"></i>
                <span slot="title">导航三</span>
                <div class="num">数量</div>
              </el-menu-item>
              <el-menu-item index="2">
                <i class="el-icon-folder"></i>
                <span slot="title">导航四</span>
                <div class="num">数量</div>
              </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
          <el-container>
            <el-header>
              <div style="margin-bottom: 10px;display: flex;" v-show="!editVisible">
                <div style="float: left;">我喜欢</div>
                <i class="el-icon-edit-outline"
                   v-show="Delete"
                   @click="editVisible=true"
                   style="margin: 3px 0 0 5px"></i>
              </div>
              <div style="margin-bottom: 10px;" v-show="editVisible">
                <el-input v-model="input" placeholder="请添加收藏夹描述" style="display: table-cell;"></el-input>
                <el-button type="success" icon="el-icon-check" circle
                           style="position: fixed; margin: -30px -112px;"
                           size="small"
                           @click="editVisible=false"></el-button>
                <el-button type="danger" icon="el-icon-close" circle
                           style="position: fixed; margin: -30px -72px;"
                           size="small"
                           @click="editVisible=false"></el-button>
              </div>
              <div style="float: left;" v-show="!inputVisible">
                请添加收藏夹描述
                <i class="el-icon-edit-outline" @click="inputVisible=true"></i>
              </div>
              <div style="float: left;" v-show="inputVisible">
                <el-input v-model="input" placeholder="请添加收藏夹描述"></el-input>
                <el-button type="success" icon="el-icon-check" circle
                           style="position: fixed; margin-left: 10px"
                           size="small"
                           @click="inputVisible=false"></el-button>
                <el-button type="danger" icon="el-icon-close" circle
                           style="position: fixed;"
                           size="small"
                           @click="inputVisible=false"></el-button>
              </div>
              <el-button type="text" @click="open" class="button_text" v-show="Delete">删除收藏夹</el-button>
            </el-header>
            <el-main>
              <el-row :gutter="20">
                <el-col :span="8" v-for="(o, index) in 3" :key="o" :offset="index > 0 ? 0.5 : 0">
                  <el-card :body-style="{ padding: '0px' }">
                    <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
                    <div style="padding: 12px;">
                      <div class="bottom clearfix">
                        <div>
                          <img src="../../../assets/picture/like.png" class="like_at">
                          <div class="title">200</div>
                        </div>
                        <div>
                          <img src="../../../assets/picture/at.png" class="like_at">
                          <div class="title">200</div>
                        </div>
                      </div>
                      <span>好吃的汉堡</span>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              <el-button type="success" round>去  添  加</el-button>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</div>
</template>

<script>
import UserPicture from "@/components/UserPicture";
export default {
  name: "Collection",
  components: {UserPicture},
  data(){
    return{
      menu_list:[],
      dialogVisible: false,
      innerVisible: false,
      inputVisible:false,
      editVisible:false,
      input: '',
      Delete: true,
      currentDate: new Date(),
      form: {
        name: '',
        info: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSuccess(){
      this.innerVisible = false;
      this.dialogVisible = false;
      this.$notify({
        title: '成功',
        message: '创建成功',
        type: 'success'
      });
    },
    open() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style scoped>
#content{
  background: #f8f8f8;
}
.main{
  padding: 0;
  margin: 5% 10% 2% 3%;
  background: white;
}
.el-container {
  height: 100%;
}
.el-menu-item {
  display: -webkit-box;
}
.el-menu-item.is-active {
  color: #006e55;
  background-color: #deefe8;
}
 .el-menu-item:focus, .el-menu-item:hover {
   outline: 0;
   background-color: #deefe8;
 }
 .el-menu .num{
   display: inline;
   position: absolute;
   right: 0;
   padding-right: 20px;
   font-size: 12px;
 }
.el-menu {
  border-right: 0;
  margin-top: -4px;
}
#button {
  line-height: 56px;
  border: 0;
  border-radius: 0;
  width: 100%;
  padding: 0 20px;
}
#button:focus, #button:hover {
  color: #006e55;
  background-color: #deefe8;
}
.el-button:focus, .el-button:hover {
  border-color: #b9e3d3;
  color: #006e55;
  background-color: #deefe8;
}
.el-button--primary {
  color: #FFF;
  background-color: #006e55;
  border-color: #006e55;
}
.el-button--primary:focus, .el-button--primary:hover {
  border-color: #01a57f;
  background-color: #01a57f;
  color: #FFF;
}
/deep/ .el-input__inner {
  height: 30px;
  line-height: 30px;
  display: flex;
}
.el-button+.el-button, .el-checkbox.is-bordered+.el-checkbox.is-bordered {
  margin-left: 50px;
}
.button_text{
  float: right;
  padding: 0;
  color: red;
}
.button_text:focus, .button_text:hover {
  border-color: #fff;
  color: #ff6666;
  background-color: #fff;
}

.bottom {
  margin-bottom: 10px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
.like_at{
  width: 15px;
  float: left;
}
.title{
  float: left;
  line-height: 15px;
  font-size: 12px;
}
</style>