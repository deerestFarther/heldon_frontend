<template>
  <div class="line-edit-box">
    <div style="font-size: 24px;font-weight: 900;margin-bottom: 20px">关系编辑</div>
    <div v-for="line in currentLineToList" :key="line.id">
      <div class="line-edit-dialogue-box">
        <el-dialog title="修改关系连线" :visible.sync="dialogVisible" width="30%" :close-on-click-modal=false>
          <div>
            关系对象:
            <div style="font-size: 24px;font-weight: 900;margin-bottom: 22px;display: inline-block">
              {{ line.data.to }}
            </div>
          </div>
          <div style="overflow: hidden">
            <div class="line-edit-color" style="margin: 22px 50px;">
              字体颜色
              <el-color-picker v-model="curLine.fontColor" show-alpha :predefine="predefineColors"/>
            </div>
            <div class="line-edit-color" style="margin: 22px 50px;">
              线条颜色
              <el-color-picker v-model="curLine.color" show-alpha :predefine="predefineColors"/>
            </div>
          </div>
          <div>
            线条样式
            <el-select v-model="curLine.lineShape" placeholder="请选择">
              <el-option
                  v-for="item in lineShapeOptions" :key="item.value" :label="item.label" v-model="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="line-width-box" style="margin-bottom: 22px">
            线条粗细
            <el-slider v-model="curLine.lineWidth" :max=10 :min=1></el-slider>
          </div>
          <el-input style="margin-bottom: 22px" v-model="curLine.text" maxlength="15" show-word-limit></el-input>
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="curLine.content"
                    style="margin-bottom: 22px"></el-input>
          <el-button type="primary" @click="confirmChangeLine(line)">提交</el-button>
          <el-button @click="cancelChangeLine">取消</el-button>
        </el-dialog>
      </div>
      <div>
        <div style="margin: 6px 0px 6px 0px; font-family: 楷体">
          {{ line.data.from }}
          <i class="el-icon-right" style="color:goldenrod"></i>
          {{ line.data.to }}
        </div>
        <el-descriptions :column="1">
          <el-descriptions-item label="关系名称">{{ line.text }}</el-descriptions-item>
          <el-descriptions-item label="关系信息">{{ line.data.content }}</el-descriptions-item>
          <el-descriptions-item label="线条样式">{{ lineShapeOptions[line.lineShape - 1].label }}</el-descriptions-item>
        </el-descriptions>
        <div>
          <div class="line-edit-color">
            字体颜色 <i class="el-icon-s-flag" :style="{'color':line.fontColor}"/>
          </div>
          <div class="line-edit-color">
            线条颜色 <i class="el-icon-s-flag" :style="{'color':line.color}"/>
          </div>
        </div>
        <el-row>
          <el-col :span="12">
            <el-tooltip class="item" effect="dark" content="删除关系" placement="bottom">
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteLine(line.data.id)"></el-button>
            </el-tooltip>
          </el-col>
          <el-col :span="12">
            <el-tooltip class="item" effect="dark" content="编辑关系" placement="bottom">
              <el-button type="primary" icon="el-icon-edit" circle @click="changeLine(line)"></el-button>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-button type="primary" @click="newLineDialogVisible=true" style="margin-top: 20px">添加关系</el-button>
    <el-dialog title="添加关系" :visible.sync="newLineDialogVisible" width="30%" :close-on-click-modal=false>
      <el-form :model="newLineForm" :rules="rules" ref="newLineForm">
        <div>
          <el-form-item prop="to">
            关系对象 :
            <el-select v-model="newLineForm.to" placeholder="请选择">
              <el-option v-for="item in nodeOptions" :key="item.value" :label="item.label" v-model="item.value"
                         :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="overflow: hidden">
          <div class="line-edit-color" style="margin: 22px 50px;">
            字体颜色
            <el-color-picker v-model="newLineForm.fontColor" show-alpha :predefine="predefineColors"/>
          </div>
          <div class="line-edit-color" style="margin: 22px 50px;">
            线条颜色
            <el-color-picker v-model="newLineForm.color" show-alpha :predefine="predefineColors"/>
          </div>
        </div>
        <div>
          线条样式
          <el-select v-model="newLineForm.lineShape" placeholder="请选择">
            <el-option
                v-for="item in lineShapeOptions" :key="item.value" :label="item.label" v-model="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="margin-top: 10px">
          线条粗细
          <el-slider v-model="newLineForm.lineWidth" :max=10 :min=1></el-slider>
        </div>
        <el-form-item prop="text">
          <el-input v-model="newLineForm.text" placeholder="请输入关系名" maxlength="15" show-word-limit></el-input>
        </el-form-item>
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
        { value: 1, label: '直线' },
        { value: 2, label: '简洁' },
        { value: 3, label: '生动' },
        { value: 4, label: '折线' },
        { value: 5, label: '鱼尾' },
      ],
      curLine: {},
      newLineForm: {
        text: '',
        fontColor: '#111111',
        lineShape: 1,
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
      await axios.put('http://www.pandub.cn:8080/relation/updateRelation', this.curLine)
          .then(({ data }) => {
            if (data) {
              this.$message({
                type: 'success',
                message: '修改关系成功!'
              })
              //可以直接重新加载不过没必要
              this.dialogVisible = false
              line.fontColor = this.curLine.fontColor
              line.text = this.curLine.text
              line.lineShape = this.curLine.lineShape
              line.lineWidth = this.curLine.lineWidth
              line.color = this.curLine.color
              line.data.content = this.curLine.content
            } else {
              this.$message({
                type: 'error',
                message: '修改关系失败!'
              })
            }
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: '修改关系失败!'
            })
          })
    },
    cancelChangeLine () {
      this.dialogVisible = false
    },
    deleteLine (lineId) {
      this.$confirm('此操作将永久删除该关系，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
            axios.delete('http://www.pandub.cn:8080/relation/deleteRelationByEdgeId/' + lineId)
                .then(({ data }) => {
                  if (data) {
                    this.$emit('lineUpdated')
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    })
                  } else {
                    this.$message({
                      message: '删除关系失败',
                      type: 'error'
                    })
                  }
                })
                .catch((err) => {
                  this.$message({
                    message: '删除关系失败',
                    type: 'error'
                  })
                  console.log(err)
                })
          }
      ).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addNewLine () {
      this.$refs.newLineForm.validate((valid) => {
        if (valid) {
          this.newLineForm.from = this.currentNode.data.id
          this.newLineForm.edgeName = this.newLineForm.text
          axios.post('http://www.pandub.cn:8080/relation/insertRelation', this.newLineForm)
              .then(({ data }) => {
                if (data) {
                  this.$emit('lineUpdated')
                  this.$refs.newLineForm.resetFields()
                  this.newLineDialogVisible = false
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })
                } else {
                  this.$message({
                    message: '添加关系失败',
                    type: 'error'
                  })
                }
              })
              .catch((err) => {
                this.$message({
                  message: '添加关系失败',
                  type: 'error'
                })
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
  margin: 15px;


  .line-edit-btn-box {
    align-self: flex-end;
  }
}

.line-edit-color {
  float: left;
  margin: 10px 40px;
  display: flex;
  align-items: center;
}
</style>