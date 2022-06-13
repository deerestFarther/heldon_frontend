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
          <div class="s_name" v-show="!editorVisible">{{ userName }}</div>
          <i class="el-icon-edit-outline" style="margin-left: 10px" @click="editorVisible=true"
             v-show="!editorVisible"></i>
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" v-show="editorVisible" class="s_name"
                   style=";margin-top: -10px;">
            <el-form-item prop="account" style="float: left;margin-bottom: 0;">
              <el-input v-model="ruleForm.account" :placeholder="userName"></el-input>
            </el-form-item>
            <el-button type="success" icon="el-icon-check" circle
                       style="position: fixed; margin-left: 10px"
                       @click="submitForm('ruleForm')"></el-button>
            <el-button type="danger" icon="el-icon-close" circle
                       style="position: fixed;"
                       @click="editorVisible=false"></el-button>
          </el-form>
        </div>
        <div class="row">
          <div class="name">注册时间</div>
          <div class="s_name">{{ creatTime }}</div>
        </div>
        <div class="row">
          <div class="name">上次登陆时间</div>
          <div class="s_name">{{ lastTime }}</div>
        </div>
        <div class="row">
          <div class="name">个人简介</div>
          <div class="s_name" v-show="!inputVisible">{{ userInfo }}</div>
          <i class="el-icon-edit-outline" style="margin-left: 10px" @click="inputVisible=true"
             v-show="!inputVisible"></i>
          <el-form :model="ruleForm1" status-icon ref="ruleForm1" v-show="inputVisible" class="s_name"
                   style="width: 70%;margin-top: -10px;">
            <el-form-item prop="info" style="margin-bottom: 0;">
              <el-input v-model="ruleForm1.info" placeholder="请添加收藏夹描述"
                        type="textarea"
                        maxlength="30"
                        show-word-limit></el-input>
            </el-form-item>
            <el-button type="success" icon="el-icon-check" circle
                       style="position: fixed; margin: -48px 0 0 280px;"
                       @click="submitForm1('ruleForm1')"></el-button>
            <el-button type="danger" icon="el-icon-close" circle
                       style="position: fixed;  margin: -48px 0 0 330px;"
                       @click="inputVisible=false"></el-button>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import UserPicture from '@/components/UserPicture'
import axios from 'axios'

export default {
  name: 'My',
  components: { UserPicture },
  data () {
    var checkAccount = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error('用户名不能为空'))
      } else if (value.length < 2 || value.length > 6) {
        return callback(new Error('用户名长度为2~6位'))
      } else if (!this.checkSpecialKey(value)) {
        callback(new Error('不能含有特殊字符'))
      } else {
        axios.get('http://116.62.36.50:8080/authorization/exists/authorization/' + this.ruleForm.account).then(({ data }) => {
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
    }
    return {
      inputVisible: false,
      editorVisible: false,
      input: '',
      userId: '',
      userName: '',
      userInfo: '',
      creatTime: '',
      lastTime: '',
      ruleForm: {
        account: ''
      },
      ruleForm1: {
        info: ''
      },
      rules: {
        account: [
          { validator: checkAccount, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUser()
  },
  methods: {
    checkSpecialKey (str) {
      let specialKey =
          '[`~!#$^&*()=|{}\':;\'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“\'。，、？]‘\''
      for (let i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) !== -1) {
          return false
        }
      }
      return true
    },
    stringToDate (strDate) {
      var tempStrs = strDate.substr(0, 19)
      var temp = tempStrs.replace('-', '年')
          .replace('-', '月')
          .replace('T', '日  ')
          .replace(':', '时')
          .replace(':', '分') + '秒'
      return temp
    },
    utc2beijing (utc_datetime) {
      // 转为正常的时间格式 年-月-日 时:分:秒
      var T_pos = utc_datetime.indexOf('T')
      var Z_pos = utc_datetime.indexOf('+')
      var year_month_day = utc_datetime.substr(0, T_pos)
      var hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1)
      var new_datetime = year_month_day + ' ' + hour_minute_second // 2017-03-31 08:02:06

      // 处理成为时间戳
      timestamp = new Date(Date.parse(new_datetime))
      timestamp = timestamp.getTime()
      timestamp = timestamp / 1000

      // 增加8个小时，北京时间比utc时间多八个时区
      var timestamp = timestamp + 8 * 60 * 60

      // 时间戳转为时间
      var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, '-').replace(/日/g, ' ')
      return beijing_datetime // 2017-03-31 16:02:06
    },
    getUser () {
      this.userId = sessionStorage.getItem('userId')
      axios.get('http://116.62.36.50:8080/authorization/get/authorizations/' + this.userId).then(({ data }) => {
        if (data) {
          console.log('users', data)
          this.lastTime = this.utc2beijing(data[0].lastloginTime)
          this.creatTime = this.utc2beijing(data[0].createTime)
        }
      }).catch((err) => {
        console.log(err)
      })
      axios.get('http://116.62.36.50:8080/user/getInfoByUserId/' + this.userId).then(({ data }) => {
        if (data) {
          this.userName = data.nickname
          console.log('user', data)
          this.userInfo = data.ext3
        }
      }).catch((err) => {
        console.log(err)
      })
    }
    ,
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let list = { nickname: this.ruleForm.account, userId: this.userId, avatar: null, ext3: null }
          console.log(list)
          axios.post('http://116.62.36.50:8080/user/edit', list).then(({ data }) => {
            console.log(data)
            if (data) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success'
              })
              this.$router.go(0)
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          this.$notify.error({
            title: '错误',
            message: '修改失败'
          })
          return false
        }
      })
    }
    ,
    submitForm1 (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let list1 = { nickname: null, userId: this.userId, avatar: null, ext3: this.ruleForm1.info }
          console.log(list1)
          axios.post('http://116.62.36.50:8080/user/edit', list1).then(({ data }) => {
            console.log(data)
            if (data) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success'
              })
              this.$router.go(0)
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          this.$notify.error({
            title: '错误',
            message: '修改失败'
          })
          return false
        }
      })
    }
    ,
  }
}
</script>

<style scoped>
#content {
  background: #f8f8f8;
}

.main {
  margin: 5% 10% 2% 3%;
  background: white;
}

.row {
  margin: 70px;
  font-size: 18px;
  line-height: 20px;
  display: flex;
}

.name {
  float: left;
}

.s_name {
  margin-left: 20px;
  float: left;
}

.el-button + .el-button, .el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 60px;
}
</style>