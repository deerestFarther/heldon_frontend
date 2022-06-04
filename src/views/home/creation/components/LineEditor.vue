<template>
  <div class="line-edit-box">

    关系列表
    <div v-for="line in currentLineToList" :key="line.id">
      <div class="line-edit-dialogue-box">
        <el-button class="line-edit-btn-box" type="primary" icon="el-icon-edit" circle
                   @click="changeLine(line)"></el-button>
        <el-button type="danger" icon="el-icon-delete" circle @click="deleteLine(line.data.id)"></el-button>
        <el-dialog title="修改关系连线" :visible.sync="dialogVisible" width="30%" :close-on-click-modal=false>
          关系名
          <el-input v-model="curLine.text" maxlength="15" show-word-limit></el-input>
          字体颜色
          <el-color-picker :value="curLine.fontColor" show-alpha :predefine="predefineColors"/>
          <div>
            线条样式
            <el-select v-model="curLine.lineShape" placeholder="请选择">
              <el-option
                  v-for="item in lineShapeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
          线条颜色
          <el-color-picker v-model="curLine.color" show-alpha :predefine="predefineColors"/>
          线条粗细
          <div class="line-width-box">
            <el-slider v-model="curLine.lineWidth" :max=10 :min=1></el-slider>
          </div>
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="curLine.content"></el-input>
          <el-button type="primary" @click="confirmChangeLine(line)">提交</el-button>
          <el-button @click="cancelChangeLine">取消</el-button>
        </el-dialog>
      </div>
      <div>
        {{ line.data.from }} {{ line.data.to }}
      </div>
      <div>
        关系名：{{ line.text }}
      </div>
      <div>
        <i class="el-icon-s-flag" :style="{'color':line.fontColor}">字体颜色</i>
      </div>
      <div>
        线条样式：{{ lineShapeOptions[line.lineShape - 1].label }}
      </div>
      <div>
        <i class="el-icon-s-flag" :style="{'color':line.color}">线条颜色</i>
      </div>
      <div>
        内容：{{ line.data.content }}
      </div>
    </div>
    <el-button type="primary" @click="newLineDialogVisible=true">添加关系</el-button>
    <el-dialog title="添加关系" :visible.sync="newLineDialogVisible" width="30%" :close-on-click-modal=false>

      <el-form :model="newLineForm" :rules="rules" ref="newLineForm">
        <el-form-item prop="to">
          {{ currentNode.id }}->
          <el-select v-model="newLineForm.to" placeholder="请选择">
            <el-option v-for="item in nodeOptions" :key="item.value" :label="item.label" :value="item.value"
                       :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="text">
          <el-input v-model="newLineForm.text" placeholder="请输入关系名" maxlength="15" show-word-limit></el-input>
        </el-form-item>
        <el-color-picker :value="newLineForm.fontColor" show-alpha :predefine="predefineColors"/>
        <div>
          线条样式
          <el-select v-model="newLineForm.lineShape" placeholder="请选择">
            <el-option
                v-for="item in lineShapeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        线条颜色
        <el-color-picker v-model="newLineForm.color" show-alpha :predefine="predefineColors"/>
        ` 线条粗细
        <div class="line-width-box">
          <el-slider v-model="newLineForm.lineWidth" :max=10 :min=1></el-slider>
        </div>
        <el-form-item prop="content">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="newLineForm.content"></el-input>
        </el-form-item>
        <el-button type="primary" @click="addNewLine">提交</el-button>
        <el-button @click="newLineDialogVisible=false">取消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LineEditor',
  props: ['currentLineToList', 'currentLineFromList', 'nodeOptions', 'currentNode'],
  data () {
    return {
      dialogVisible: false,
      newLineDialogVisible: false,
      newToNodeId: '',
      newFromNodeId: '',
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
      lineShapeOptions: [
        { value: '1', label: '直线' },
        { value: '2', label: '简洁' },
        { value: '3', label: '生动' },
        { value: '4', label: '鱼尾' },
        { value: '5', label: '折线' },
      ],
      curLine: {},
      newLineForm: {
        text: '',
        fontColor: '#111111',
        lineShape: '1',
        color: '#aaaaaa',
        lineWidth: 1,
        content: '',
        to: null,
      },
      rules: {
        to: [{ required: true, message: '请选择一个结点', trigger: 'change' }],
        text: [{ required: true, message: '关系名不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
      },
    }
  },
  mounted () {
  },
  methods: {

    changeLine (line) {
      this.dialogVisible = true
      this.curLine = {
        fontColor: line.fontColor,
        lineShape: line.lineShape,
        text: line.text,
        lineWidth: line.lineWidth,
        color: line.color,
        content: line.data.content,
      }
    },
    async confirmChangeLine (line) {
      this.curLine.edgeId = line.data.id
      this.curLine.edgeName = line.text
      console.log(this.curLine)
      await axios.put('http://localhost:8080/relation/updateRelation', this.curLine)
          .then(({ data }) => {
            // console.log(data)
            //成功
          })
          .catch((err) => {
            // console.log(err)
          })
      //可以直接重新加载不过没必要
      this.dialogVisible = false
      line.fontColor = this.curLine.fontColor
      line.text = this.curLine.text
      line.lineShape = this.curLine.lineShape
      line.lineWidth = this.curLine.lineWidth
      line.color = this.curLine.color
      line.data.content = this.curLine.content
    },
    cancelChangeLine () {
      this.dialogVisible = false
    },
    deleteLine (lineId) {
      axios.delete('http://localhost:8080/relation/deleteRelationByEdgeId/' + lineId)
          .then(({ data }) => {
            console.log(data)
            if (data) {
              this.$emit('lineUpdated')
            } else {
              this.$message({
                message: '添加关系删除失败',
                type: 'error'
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })
    },
    addNewLine () {
      this.$refs.newLineForm.validate((valid) => {
        if (valid) {
          this.newLineForm.from = this.currentNode.data.id
          this.newLineForm.edgeName = this.newLineForm.text
          axios.post('http://localhost:8080/relation/insertRelation', this.newLineForm)
              .then(({ data }) => {
                if (data) {
                  this.$emit('lineUpdated')
                  this.$refs.newLineForm.resetFields()
                  this.newLineDialogVisible = false
                } else {
                  this.$message({
                    message: '添加关系失败',
                    type: 'error'
                  })
                }
              })
              .catch((err) => {
                console.log(err)
              })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.line-edit-box {
  display: flex;
  flex-flow: column wrap;
  align-items: center;

  .line-edit-btn-box {
    align-self: flex-end;
  }
}
</style>