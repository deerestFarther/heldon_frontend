<template>

  <div class="node-edit-box">
    <el-button type="primary" @click="updateNodeXY">保存布局</el-button>
    <el-button class="node-edit-btn" type="primary" icon="el-icon-edit" circle
               @click="changeNode(currentNode)"></el-button>
    <el-button type="danger" icon="el-icon-delete" circle @click="deleteNode(currentNode)"
               v-if="currentNode.data.ableDelete"></el-button>
    <img class="img-box" :src="currentNode.data.url"/>
    <div class="node-name-box">
      {{ currentNode.id }}
    </div>
    <div class="node-content-box">
      {{ currentNode.data.content }}
    </div>
    <div>
      字体颜色 <i class="el-icon-s-flag" :style="{'color':currentNode.fontColor}"/>
    </div>
    <div>
      边框颜色 <i class="el-icon-s-flag" :style="{'color':currentNode.borderColor}"/>
    </div>
    <div>
      背景颜色 <i class="el-icon-s-flag" :style="{'color':currentNode.color}"/>
    </div>
    <el-dialog title="修改结点信息" :visible.sync="dialogVisible" width="30%" :close-on-click-modal=false>
      <el-form :model="curNode" :rules="rules" :ref="curNode">
        <img class="img-box" :src="curNode.url"/>
        <cropper-image @imgUploaded="updateNodePic($event, curNode)"></cropper-image>
        <el-form-item prop="id">
          <el-input v-model="curNode.id" :maxlength=15 show-word-limit></el-input>
        </el-form-item>
        字体颜色
        <el-color-picker v-model="curNode.fontColor" show-alpha :predefine="predefineColors"/>
        背景颜色
        <el-color-picker v-model="curNode.color" show-alpha :predefine="predefineColors"/>
        边框颜色
        <el-color-picker v-model="curNode.borderColor" show-alpha :predefine="predefineColors"/>
        <el-form-item prop="content">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="curNode.content"></el-input>
        </el-form-item>
        <el-button type="primary" @click="confirmChangeNode(currentNode)">提交</el-button>
        <el-button @click="cancelChangeNode">取消</el-button>
      </el-form>
    </el-dialog>
    <el-button type="primary" @click="newNodeDialogVisible=true">添加结点</el-button>

    <el-dialog title="添加新结点" :visible.sync="newNodeDialogVisible" width="30%" :close-on-click-modal=false>
      <el-form :model="newNodeForm" :rules="rules" ref="newNodeForm">
        <img class="img-box" :src="newNodeForm.url"/>
        <cropper-image @imgUploaded="updateNodePic($event,newNodeForm)"></cropper-image>

        <el-form-item prop="id">
          <el-input v-model="newNodeForm.id" :maxlength=15 show-word-limit></el-input>
        </el-form-item>
        字体颜色
        <el-color-picker v-model="newNodeForm.fontColor" show-alpha :predefine="predefineColors"/>
        背景颜色
        <el-color-picker v-model="newNodeForm.color" show-alpha :predefine="predefineColors"/>
        边框颜色
        <el-color-picker v-model="newNodeForm.borderColor" show-alpha :predefine="predefineColors"/>
        <el-form-item prop="content">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="newNodeForm.content"></el-input>
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
    let checkNodeId = (rule, value, callback) => {
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
      rules: {
        id: [{ validator: checkNodeId, trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
      },
      dialogVisible: false,
      newNodeDialogVisible: false,
      newNodeForm: {
        id: '',//上传的时候把text加上
        url: '',
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
      await axios.put('http://localhost:8080/node/updateNode', this.curNode)
          .then((data) => {
            console.log(data)
          })
          .catch((err) => {
            console.log(err)
          })
      node.id = this.curNode.id
      node.text = this.curNode.id //id===text
      node.color = this.curNode.color
      node.borderColor = this.curNode.borderColor
      node.fontColor = this.curNode.fontColor
      node.data.content = this.curNode.content
      node.data.url = this.curNode.url
      this.dialogVisible = false
    },
    deleteNode (node) {
      axios.delete('http://localhost:8080/node/deleteNodeByNodeId/' + node.data.id)
          .then(({ data }) => {
            console.log(data)
            this.$emit('nodeUpdated')
          })
          .catch((err) => {
            console.log(err)
          })
    },
    addNewNode () {
      this.$refs.newNodeForm.validate((valid) => {
        if (valid) {
          this.newNodeForm.text = this.newNodeForm.id
          this.newNodeForm.nodeName = this.newNodeForm.id
          this.newNodeForm.netId = this.netId
          axios.post('http://localhost:8080/node/insertOneNode', this.newNodeForm)
              .then(({ data }) => {
                if (data) {
                  this.$emit('nodeUpdated', this.newNodeForm.id)
                  this.$refs.newNodeForm.resetFields()
                  this.newNodeDialogVisible = false
                } else {
                  this.$message({
                    message: '添加结点失败',
                    type: 'error'
                  })
                }
              })
              .catch((err) => {
                console.log(err)
              })
        }
      })
    },
    updateNodeXY(){
      this.$emit('updateNodeXY');
    }
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
    height: 80px;
    width: 80px;
    border-radius: 50px;
  }
}
</style>