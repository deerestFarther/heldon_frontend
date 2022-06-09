<template>
  <div id="content">
    <div id="headline">亿网达尽</div>
    <div id="log">
      <div class="left">
        <div class="password">
          <div style="color: #006e55">登录</div>
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                   class="demo-ruleForm">
            <el-form-item prop="account">
              <el-input v-model.number="ruleForm.account" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item prop="pass">
              <el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="请输入密码"></el-input>
            </el-form-item>
            <div class="but">
              <el-radio v-model="save" @click="handleSave">自动登录</el-radio>
              <el-button type="text" @click="$router.push('/register')">忘记密码</el-button>
            </div>
            <div class="submit">
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <el-divider direction="vertical"></el-divider>
      <div class="right">
        <div style="color: #9c9c9c;margin-top: 20%">还没有账号</div>
        <el-button type="text" @click="$router.push('/register')">立即注册</el-button>
        <i class="el-icon-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data () {
    var checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号不能为空'))
      } else
        return callback()
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入密码'))
      } else {
        return callback()
      }
    }
    return {
      save: false,
      ruleForm: {
        pass: '',
        account: '',
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        account: [
          { validator: checkAccount, trigger: 'blur' }
        ],
      },
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
          this.$notify({
            title: '成功',
            message: '登录',
            type: 'success'
          })
          axios.post('http://www.pandub.cn:8080/authorization/validate/authorization/' + this.ruleForm.account +
              '&&' + this.ruleForm.pass
          ).then(({ data }) => {
            if (data) {
              sessionStorage.setItem('userId', data)
              console.log(data)
              this.$router.push('/home')
            } else {
              this.$notify.error({
                title: '错误',
                message: '登录失败'
              })
              console.log('error submit!!')
              return false
            }
          }).catch((err) => {
            console.log(err)
          })
          // window.sessionStorage.setItem("token",token值)
        } else {
          this.$notify.error({
            title: '错误',
            message: '登录失败'
          })
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSave: function () {
      this.save = true
      localStorage.setItem('save', this.save)
      console.log(localStorage.save)
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

#headline {
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

.el-form-item {
  margin-bottom: 30px;
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

.el-radio {
  left: 0;
  display: flex;
  float: left;
  margin-right: 58%;
}

.left /deep/ .el-radio__inner {
  border-radius: 0;
}

.left /deep/ .el-radio__input.is-checked .el-radio__inner {
  border-color: #006e55;
  background: #006e55;
}

.left /deep/ .el-radio__input.is-checked + .el-radio__label {
  color: #006e55;
}

.but {
  width: 100%;
  display: flex
}

.but .el-button {
  float: left;
  padding: 0;
}

.submit /deep/ .el-button {
  width: 100%;
  margin-top: 20px;
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