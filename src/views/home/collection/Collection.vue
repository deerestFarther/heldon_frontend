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
                <i class="el-icon-folder-add"
                   style="float:left; font-size: 18px;line-height: 56px;padding: 0 8px 0 3px;"></i>
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
                  <el-button type="primary" @click=" submitForm('form')">确 定</el-button>
                </div>
              </el-dialog>
              <el-form :model="form" :rules="forms" ref="form">
                <el-form-item prop="name">
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
    <el-button type="primary" @click="innerVisible=true">确 定</el-button>
  </span>
            </el-dialog>

            <el-menu
                default-active="0"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose">
              <el-menu-item :index="i+''" v-for="(menu,i) in menu_list" @click="getCollectionName(menu)">
                <i class="el-icon-folder"></i>
                <span slot="title">{{ menu.collectionName }}</span>
              </el-menu-item>

            </el-menu>
          </el-aside>
          <el-main>
            <collection-show :collection_name="collection_name"
                             :Delete="Delete"
                             :lists="lists"
                             :listsShow="listsShow"
                             v-if="reFresh"
                             :collection_id="collection_id"
                             :collection_content="collection_content"/>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import UserPicture from '@/components/UserPicture'
import axios from 'axios'
import CollectionShow from '@/views/home/collection/CollectionShow'
import { checkSpecialKey } from '@/assets/validateMethods'

export default {
  name: 'Collection',
  components: { CollectionShow, UserPicture },
  data () {
    var validateName = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error('收藏夹名称不能为空'))
      } else if (!checkSpecialKey(value)) {
          return callback(new Error('不能含有特殊字符'))
      }
      return callback()
    }
    return {
      lists: [],
      menu_list: Array,
      dialogVisible: false,
      innerVisible: false,
      names: Array,
      collection_name: '我的喜爱',
      collection_id: '',
      collection_content: '',
      UserId: '',
      Delete: false,
      listsShow: false,
      reFresh: true,
      form: {
        name: '',
        info: '',
      },
      forms: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ],
      },
    }
  },
  created () {
    this.getUserId()
    this.collection()
    this.likeCollection()
  },
  methods: {
    getUserId () {
      this.UserId = sessionStorage.getItem('userId')
      //console.log(this.UserId)
    },
    collection () {
      axios.get('http://116.62.36.50:8080/collection/get/collections/' + this.UserId).then(({ data }) => {
        if (data) {
          this.menu_list = data
          this.collection_id = data[0].collectionId
          //console.log('id',this.collection_id)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    likeCollection () {
      axios.get('http://116.62.36.50:8080/collection/get/collection/id/' + this.UserId).then(({ data }) => {
        if (data) {
          //console.log('like',data)
          axios.get('http://116.62.36.50:8080/collectionNetwork/get/cns/' + data).then(({ data }) => {
            if (data) {
              console.log('likes', data)
              if (data.length === 0)
                this.listsShow = false
              else
                this.listsShow = true
              for(var i=0;i<data.length;i++){
                axios.get('http://116.62.36.50:8080/network/getNetworkByNetId/' + data[i].netId).then(({ data }) => {
                  if (data) {
                    // console.log('info',data);
                    this.lists.push(data)
                  }
                }).catch((err) => {
                  console.log(err)
                })
              }
            }
          }).catch((err) => {
            console.log(err)
          })
          axios.get('http://116.62.36.50:8080/collection/get/collection/' + data).then(({ data }) => {
            if (data) {
              //console.log('info',data[0].content)
              this.collection_content = data[0].content
              this.reFresh = false
              this.$nextTick(() => {
                this.reFresh = true
              })
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getCollectionName (name) {
      //console.log('collection',this.collection_id)
      this.collection_name = name.collectionName
      this.collection_id = name.collectionId
      if (this.collection_name === '我的喜爱') {
        this.Delete = false
      } else {
        this.Delete = true
        console.log(name)
      }
      axios.get('http://116.62.36.50:8080/collectionNetwork/get/cns/' + this.collection_id).then(({ data }) => {
        if (data) {
          //console.log('net',data)
          this.lists = data
          if (data.length === 0) {
            this.listsShow = false
          } else
            this.listsShow = true
          this.lists=[]
          for(var i=0;i<data.length;i++){
            axios.get('http://116.62.36.50:8080/network/getNetworkByNetId/' + data[i].netId).then(({ data }) => {
              if (data) {
                console.log('list',data);
                this.lists.push(data)
              }
            }).catch((err) => {
              console.log(err)
            })
          }
        }
      }).catch((err) => {
        console.log(err)
      })
      axios.get('http://116.62.36.50:8080/collection/get/collection/' + this.collection_id).then(({ data }) => {
        if (data) {
          //console.log('info',data)
          this.collection_content = data[0].content
          this.reFresh = false
          this.$nextTick(() => {
            this.reFresh = true
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    handleOpen (key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      //console.log(key, keyPath);
    },
    submitForm (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.innerVisible = false
          this.dialogVisible = false
          axios.post('http://116.62.36.50:8080/collection/add/collection/' + this.form.name +
              '&&' + this.UserId + '&&' + this.form.info
          ).then(({ data }) => {
            if (data) {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success'
              })
              //console.log(data)
              this.collection()
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>

<style scoped>
#content {
  background: #f8f8f8;
}

.main {
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

.el-menu .num {
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

.el-button + .el-button, .el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 50px;
}

.button_text {
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

.like_at {
  width: 15px;
  float: left;
}

.title {
  float: left;
  line-height: 15px;
  font-size: 12px;
}
</style>