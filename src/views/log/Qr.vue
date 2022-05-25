<template>
  <div id="content">
    <div id="log">
      <div class="left">
        <button class="Qr">
          <img src="../../assets/picture/login.png" style="width: 100%" @click="$router.push('/')">
        </button>
        <div style="margin-bottom: 20px">扫码登录</div>
        <img src="../../assets/picture/Qr_code.png">
        <div style="margin-top: 20px;font-size: 12px">打开 微信APP 进行扫码登录</div>
      </div>
      <el-divider direction="vertical"></el-divider>
      <div class="right">
        <div style="color: #9c9c9c;margin-top: 15%">还没有账号</div>
        <el-button type="text" @click="$router.push('/register')">立即注册</el-button>
        <i class="el-icon-right"></i>
        <div style="color: #9c9c9c ;font-size: 12px;margin-top: 5%">使用以下账号直接登录</div>
        <button class="chose">
          <img src="../../assets/picture/wechat.png" style="width: 100%">
        </button>
        <button class="chose">
          <img src="../../assets/picture/qq.png" style="width: 100%">
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Qr",
    data() {
      var checkAccount = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('账号不能为空'));
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      return {
        radio: '1',
        activeIndex: '1',
        activeIndex2: '1',
        ruleForm: {
          pass: '',
          checkPass: '',
          age: ''
        },
        rules: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          account: [
            {validator: checkAccount, trigger: 'blur'}
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
            alert('submit!');
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
#content {
  height: 100%;
  background-image: url("../../assets/picture/background.png");
  background-repeat: no-repeat;
  position: relative;
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
  width: 40%;
  height: 40%;
  padding: 4% 3%;
}

.el-menu-item {
  padding-left: 30px;
  padding-right: 30px;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 2px solid #006e55;
  color: #006e55;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  outline: 0;
  color: #006e55;
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

.el-radio {
  left: 0;
  display: flex;
  float: left;
  margin-right: 62%;
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

.Qr{
  width: 10%;
  position: absolute;
  left: 5px;
  top: 5px;
  padding: 0;
  border: 0;
  background: white;
}

.chose{
  margin: 5px 20px;
  width: 20px;
  background: white;
  border: 0;
  padding: 0;
}

</style>