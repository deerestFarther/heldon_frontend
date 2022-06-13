<template>
  <div class="node-edit-box">

    <div style="font-size: 24px;font-weight: 900;margin-bottom: 20px">结点编辑</div>
    <div>
      <img class="img-box" :src="currentNode.data.url"/>
      <div style="float: left;margin-left: 20px;width: 63%;">
        <el-descriptions :column="1">
          <el-descriptions-item label="结点名称">{{ currentNode.id }}</el-descriptions-item>
          <el-descriptions-item label="结点信息">{{ currentNode.data.content }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <div>
      <div class="node-edit-color">
        字体颜色 <i class="el-icon-s-flag" :style="{'color':currentNode.fontColor}"/>
      </div>
      <div class="node-edit-color">
        边框颜色 <i class="el-icon-s-flag" :style="{'color':currentNode.borderColor}"/>
      </div>
      <div class="node-edit-color">
        背景颜色 <i class="el-icon-s-flag" :style="{'color':currentNode.color}"/>
      </div>
    </div>
    <el-row>
      <el-tooltip class="item" effect="dark" content="删除结点" placement="bottom" v-if="currentNode.data.ableDelete">
        <el-button type="danger" icon="el-icon-delete" circle
                   @click="deleteNode(currentNode)"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="编辑结点" placement="bottom">
        <el-button type="primary" icon="el-icon-edit" circle @click="changeNode(currentNode)"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="添加结点" placement="bottom">
        <el-button type="warning" icon="el-icon-plus" circle @click="newNodeDialogVisible=true"></el-button>
      </el-tooltip>

    </el-row>

    <el-dialog title="修改结点信息" :visible.sync="dialogVisible" width="30%" :close-on-click-modal=false>
      <el-form :model="curNode" :rules="rulesForUpdate" :ref="curNode">
        <cropper-image @imgUploaded="updateNodePic($event, curNode)" :img-url="curNode.url"
                       style="margin-bottom: 10px;" v-if="dialogVisible"></cropper-image>
        <div style="height: 80px">
          <div class="node-edit-color" style="margin: 22px;">
            字体颜色
            <el-color-picker v-model="curNode.fontColor" show-alpha :predefine="predefineColors"/>
          </div>
          <div class="node-edit-color" style="margin: 22px;">
            背景颜色
            <el-color-picker v-model="curNode.color" show-alpha :predefine="predefineColors"/>
          </div>
          <div class="node-edit-color" style="margin: 22px;">
            边框颜色
            <el-color-picker v-model="curNode.borderColor" show-alpha :predefine="predefineColors"/>
          </div>
        </div>
        <el-form-item prop="id">
          <el-input v-model="curNode.id" :maxlength=15 show-word-limit placeholder="请输入结点名称"></el-input>
        </el-form-item>
        <el-form-item prop="content">
          <el-input type="textarea" :rows="2" placeholder="请输入结点信息" v-model="curNode.content"></el-input>
        </el-form-item>
        <el-button type="primary" @click="confirmChangeNode(currentNode)">提交</el-button>
        <el-button @click="cancelChangeNode">取消</el-button>
      </el-form>
    </el-dialog>

    <el-dialog title="添加新结点" :visible.sync="newNodeDialogVisible" width="30%" :close-on-click-modal=false>
      <el-form :model="newNodeForm" :rules="rulesForAdd" ref="newNodeForm">
        <!-- 这个bug我不能接受！！！！！！！-->
        <cropper-image @imgUploaded="updateNodePic($event,newNodeForm)" :img-url="newNodeForm.url"
                       style="margin-bottom: 10px;" v-if="newNodeDialogVisible"></cropper-image>
        <el-row>
          <el-col>
            字体颜色
            <el-color-picker v-model="newNodeForm.fontColor" show-alpha :predefine="predefineColors"/>
          </el-col>
          <el-col>
            背景颜色
            <el-color-picker v-model="newNodeForm.color" show-alpha :predefine="predefineColors"/>
          </el-col>
          <el-col>
            边框颜色
            <el-color-picker v-model="newNodeForm.borderColor" show-alpha :predefine="predefineColors"/>
          </el-col>
        </el-row>
        <el-form-item prop="id">
          <el-input v-model="newNodeForm.id" :maxlength=15 show-word-limit placeholder="请输入结点名称"></el-input>
        </el-form-item>
        <el-form-item prop="content">
          <el-input type="textarea" :rows="2" placeholder="请输入结点信息" v-model="newNodeForm.content"></el-input>
        </el-form-item>
        <el-button type="primary" @click="addNewNode">提交</el-button>
        <el-button @click="newNodeDialogVisible=false">取消</el-button>
      </el-form>
    </el-dialog>
    <!--    <div class="node-style-box">-->
    <!--      背景颜色：-->
    <!--      <el-color-picker :disabled="!editMode" v-model="currentNode.color" show-alpha :predefine="predefineColors">-->
    <!--      </el-color-picker>-->
    <!--      边框颜色：-->
    <!--      <el-color-picker :disabled="!editMode" v-model="currentNode.borderColor" show-alpha :predefine="predefineColors">-->
    <!--      </el-color-picker>-->
    <!--      文字颜色：-->
    <!--      <el-color-picker :disabled="!editMode" v-model="currentNode.fontColor" show-alpha :predefine="predefineColors">-->
    <!--      </el-color-picker>-->
    <!--    </div>-->
    <!--    <div class="node-delete-box">-->
    <!--      <el-button type="danger" icon="el-icon-delete" circle @click="deleteNode"-->
    <!--                 v-show="editMode&&this.currentNode.data.ableDelete"></el-button>-->
    <!--    </div>-->
  </div>
</template>

<script>
import CropperImage from '@/views/home/creation/components/CropperImage'
import axios from 'axios'

export default {
  name: 'NodeEditor',
  components: { CropperImage },
  data () {
    let checkNodeIdForUpdate = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('节点名称不能为空'))
      } else {
        this.idList.forEach((id) => {
          if (id === value)
            return callback(new Error(value + '已存在'))
        })
        return callback()
      }
    }
    let checkNodeIdForAdd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('节点名称不能为空'))
      } else {
        this.idList.forEach((id) => {
          if (id === value)
            return callback(new Error(value + '已存在'))
        })
        if (value === this.currentNode.id)
          return callback(new Error(value + '已存在'))
        return callback()
      }
    }
    return {
      curNode: {},//表单内的值
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
      rulesForUpdate: {
        id: [{ validator: checkNodeIdForUpdate, trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
      },
      rulesForAdd: {
        id: [{ validator: checkNodeIdForAdd, trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
      },
      dialogVisible: false,
      newNodeDialogVisible: false,
      msgFormSon: true,
      newNodeForm: {
        id: '',//上传的时候把text加上
        url: 'https://relation-network.oss-cn-chengdu.aliyuncs.com/pictures/default.jpg',
        fontColor: '#111111',
        color: '#aaaaaa',
        borderColor: '#7f7f7f',
        content: ''
      }
    }
  },
  props: ['currentNode', 'idList', 'netId'],
  methods: {

    updateNodePic (event, data) {
      data.url = event
    },
    changeNode (node) {
      this.dialogVisible = true
      this.curNode = {
        nodeId: node.data.id,
        id: node.id,
        text: node.text,
        color: node.color,
        borderColor: node.borderColor,
        fontColor: node.fontColor,
        content: node.data.content,
        url: node.data.url,
      }
    },
    cancelChangeNode () {
      this.dialogVisible = false
    },
    async confirmChangeNode (node) {
      this.curNode.nodeName = this.curNode.id
      this.curNode.text = this.curNode.id
      await axios.put('http://116.62.36.50:8080/node/updateNode', this.curNode)
          .then((data) => {
            if (data) {
              this.$message({
                type: 'success',
                message: '结点修改成功!'
              })
              this.dialogVisible = false
              node.id = this.curNode.id
              node.text = this.curNode.id //id===text
              node.color = this.curNode.color
              node.borderColor = this.curNode.borderColor
              node.fontColor = this.curNode.fontColor
              node.data.content = this.curNode.content
              node.data.url = this.curNode.url
            } else {
              this.$message({
                type: 'error',
                message: '结点修改失败!'
              })
            }
          })
          .catch((err) => {
            console.log(err)
            this.$message({
              type: 'error',
              message: '结点修改失败!'
            })
          })
    },
    deleteNode (node) {
      this.$confirm('此操作将永久删除该结点和与之相关的关系，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
            axios.delete('http://116.62.36.50:8080/node/deleteNodeByNodeId/' + node.data.id)
                .then(({ data }) => {
                  if (data) {
                    this.$emit('nodeUpdated')
                    this.$message({
                      type: 'success',
                      message: '结点删除成功!'
                    })
                  } else {
                    this.$message({
                      type: 'error',
                      message: '结点删除失败!'
                    })
                  }
                })
                .catch((err) => {
                  console.log(err)
                  this.$message({
                    message: '结点删除失败',
                    type: 'error'
                  })
                })
          }
      ).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })

    },
    addNewNode () {
      this.$refs.newNodeForm.validate((valid) => {
        if (valid) {
          this.newNodeForm.text = this.newNodeForm.id
          this.newNodeForm.nodeName = this.newNodeForm.id
          this.newNodeForm.netId = this.netId
          axios.post('http://116.62.36.50:8080/node/insertOneNode', this.newNodeForm)
              .then(({ data }) => {
                if (data) {
                  this.$emit('nodeUpdated', this.newNodeForm.id)
                  this.$refs.newNodeForm.resetFields()
                  this.newNodeDialogVisible = false
                  this.$message({
                    message: '结点添加成功',
                    type: 'success'
                  })
                } else {
                  this.$message({
                    message: '结点添加失败',
                    type: 'error'
                  })
                }
              })
              .catch((err) => {
                this.$message({
                  message: '结点添加失败',
                  type: 'error'
                })
              })
        }
      })
    },

  },
  mounted () {
    console.log(this.currentNode)
  },
}
</script>

<style scoped lang="scss">

.node-edit-box {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  margin: 15px;

  .node-edit-btn-box {
    align-self: flex-end;
  }

  .node-name-box {
  }

  .node-style-box {
    display: flex;
    flex-flow: row wrap;
  }

  .img-box {
    border: none;
    background-position: center center;
    background-size: 100%;
    height: 100px;
    width: 100px;
    border-radius: 50px;
    float: left;
  }
}

.node-edit-color {
  float: left;
  margin: 12px;
  display: flex;
  align-items: center;
}
</style>