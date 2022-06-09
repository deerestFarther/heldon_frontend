<template>
  <div id="content">
    <div id="headline">亿网达尽</div>
    <div id="log">
      <div class="left">
        <div style="color: #006e55">注册</div>
        <div class="verification">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item prop="account">
              <el-input v-model="ruleForm.account" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="pass">
              <el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
              <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" placeholder="请确认密码"></el-input>
            </el-form-item>
            <div class="submit">
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <el-divider direction="vertical"></el-divider>
      <div class="right">
        <div style="color: #9c9c9c;margin-top: 20%">已有账号</div>
        <el-button type="text" @click="$router.push('/')">直接登录</el-button>
        <i class="el-icon-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Register",
  data() {
    var checkAccount = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error('用户名不能为空'));
      }else if(value.length < 2 || value.length > 6)
      {
        return callback(new Error('用户名长度为2~6位'))
      } else {
        axios.get("http://www.pandub.cn:8080/authorization/exists/authorization/"+this.ruleForm.account).then(({data})=>{
          console.log(data)
          if (!data) {
            return callback()
          } else {
            return callback(new Error('该用户名已存在'))
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'));
      } else {
        if(value.length<4||value.length>12){
          callback(new Error('密码长度为4~12位'));
        }else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      save: 'false',
      ruleForm: {
        pass: '',
        checkPass: '',
        account: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        account: [
          { validator: checkAccount, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post("http://www.pandub.cn:8080/authorization/add/authorization/new/"+"0"+"&&"+this.ruleForm.account
          +"&&"+this.ruleForm.pass).then(({data})=> {
            console.log(data)
            if(data){
              this.$notify({
                title: '成功',
                message: '注册成功',
                type: 'success'
              });
              this.$router.push('/login')
            }else {
              this.$notify.error({
                title: '错误',
                message: '注册失败'
              });
              return false;
            }
          }).catch((err)=>{
            console.log(err)
          })
        } else {
          console.log('error submit!!');
          this.$notify.error({
            title: '错误',
            message: '登录失败'
          });
          return false;
        }
      });
    },
  },
}

</script>

<style scoped>
#content {
  height: 100%;
  background-image: url("../../assets/picture/background.png");
  background-repeat: no-repeat;
  position: relative;
}

#headline{
  font-size: 50px;
  font-weight: 900;
  margin-top: 7%;
  color: #006e55;
}

#log {
  z-index: 1;
  position: absolute;
  background-color: white;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 35%;
  height: 35%;
  padding: 3% 3%;
}

.el-form {
  margin-top: 5%
}

.left {
  float: left;
  width: 60%;
  margin-right: 3%;
}

.left /deep/ .el-form-item__content {
  margin-left: 0 !important;
}

.left /deep/ .el-input__inner {
  border-radius: 0;
  border-bottom: 1px solid #DCDFE6;
  border-top: 0;
  border-left: 0;
  border-right: 0;
}

.submit /deep/ .el-button {
  width: 100%;
}

.submit /deep/ .el-button--primary {
  color: #FFF;
  background-color: #006e55;
  border-color: #006e55;
}

.submit /deep/ .el-button--primary:focus, .el-button--primary:hover {
  background: #009c75;
  border-color: #009c75;
  color: #FFF;
}

.el-button--text {
  border-color: transparent;
  color: #006e55;
  background: 0 0;
  padding-left: 0;
  padding-right: 0;
}

.but /deep/ .el-button--text:focus, .el-button--text:hover {
  color: #009c75;
  border-color: transparent;
  background-color: transparent;
}

.el-divider--vertical {
  float: left;
  height: 100%
}

.el-icon-right {
  color: #009c75;
}

</style>