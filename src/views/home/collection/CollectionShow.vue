<template>
  <el-container v-if="reFresh">
    <el-header style="height: 80px">
      <div style="margin-bottom: 10px;display: flex;" v-show="!editVisible">
        <div style="float: left;">{{ collection_name }}</div>
        <i class="el-icon-edit-outline"
           v-show="Delete"
           @click="editVisible=true"
           style="margin: 3px 0 0 5px"></i>
      </div>
      <div v-show="editVisible">
        <el-form :model="ruleForm1" status-icon :rules1="rules1" ref="ruleForm1">
          <el-form-item>
            <el-input v-model="ruleForm1.name" :placeholder="collection_name" style="display: table-cell;"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="success" icon="el-icon-check" circle
                   style="position: fixed; margin: -40px -112px;"
                   size="small"
                   @click="submitForm1('ruleForm1')"></el-button>
        <el-button type="danger" icon="el-icon-close" circle
                   style="position: fixed; margin: -40px -72px;"
                   size="small"
                   @click="editVisible=false"></el-button>
      </div>
      <div style="float: left;" v-show="!inputVisible">
        {{ info }}
        <i class="el-icon-edit-outline" @click="inputVisible=true"></i>
      </div>
      <div style="float: left;" v-show="inputVisible">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" style="float: left">
          <el-form-item>
            <el-input v-model="ruleForm.inf" placeholder="请添加收藏夹描述"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="success" icon="el-icon-check" circle
                   style="position: fixed; margin-left: 10px"
                   size="small"
                   @click="submitForm('ruleForm')"></el-button>
        <el-button type="danger" icon="el-icon-close" circle
                   style="position: fixed;"
                   size="small"
                   @click="inputVisible=false"></el-button>
      </div>
      <el-button type="text" @click="open" class="button_text" v-show="Delete">删除收藏夹</el-button>
    </el-header>
    <el-main>
      <el-row :gutter="20" v-show="listsShow">
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
              <span>{{lists}}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-button type="success" round v-show="!listsShow" @click="this.$router.push('/welcome')">去  添  加</el-button>
    </el-main>
  </el-container>
</template>

<script>

import axios from "axios";

export default {
  name: "CollectionShow",
  data(){
    var checkInf = (rule, value, callback) => {
      console.log('s',value)
      if (value) {
        return callback(new Error('用户名不能为空'));
      } else
        return callback()
    }
    var checkName = (rule, value, callback) => {
      console.log('s',value)
      if (value) {
        return callback(new Error('用户名不能为空'));
      } else
        return callback()
    }
    return{
      inputVisible:false,
      editVisible:false,
      reFresh:false,
      info:'',
      userid:'',
      ruleForm: {
        inf: '',
      },
      rules: {
        inf: [
          { validator: checkInf, trigger: 'blur' }
        ],
      },
      ruleForm1: {
        name: '',
      },
      rules1: {
        name: [
          { validator: checkName, trigger: 'blur' }
        ],
      }
    }
  },
  props: {
    collection_name: String,
    collection_id:'',
    collection_content:'',
    Delete:Boolean,
    lists:Array,
    listsShow:Boolean,
  },
  mounted() {
    this.showCollectionInfo()
  },
  methods:{
    showCollectionInfo(){
      console.log('t',this.collection_content)
      this.info=this.collection_content
      if(this.info===''){
        this.info="请添加收藏夹信息"
      }
      this.$nextTick(()=>{
        this.reFresh = true
      })
    },
    open() {
      this.$confirm('是否删除该收藏夹?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete(this.serverUrl + "collection/remove/collection/"+this.collection_id
        ).then(({data})=>{
          if (data) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.$router.go(0)
          }
        }).catch((err) => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.userid=sessionStorage.getItem('userId')
          console.log('submit!!');
          this.info=this.ruleForm.inf
          axios.put(this.serverUrl + "collection/renew/collection/content/"+this.userid+
              '&&'+ this.collection_id+'&&'+this.ruleForm.inf).then(({data})=>{
            if (data) {
              console.log('info',data)
              this.collection_content=data[0].content
            }
          }).catch((err) => {
            console.log(err)
          })

          //this.reFresh= false
          this.$nextTick(()=>{
            this.inputVisible=false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    submitForm1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.userid=sessionStorage.getItem('userId')
          console.log('submit!!');
          axios.put(this.serverUrl + "collection/renew/collection/name/"+this.userid+
              '&&'+ this.collection_id+'&&'+this.collection_name+'&&'+this.ruleForm1.name).then(({data})=>{
            if (data) {
              console.log('info',data)
              this.$router.go(0)
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          console.log('error submit!!');
          return false;
         }
      });
    },
  }
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 10px;
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