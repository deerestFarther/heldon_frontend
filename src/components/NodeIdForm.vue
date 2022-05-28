<template>
  <div>
    <el-button type="text" @click="dialogVisible = true;">增加结点</el-button>
    <el-dialog title="节点名称" :visible.sync="dialogVisible" width="30%">
      <div slot="footer" class="dialog-footer">
        <el-form :model="nodeIdForm" status-icon :rules="rules" ref="nodeIdForm" label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="节点名称" prop="nodeId">
            <el-input v-model="nodeIdForm.nodeId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="confirmNodeId">提交</el-button>
            <el-button @click="dialogVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'NodeIdForm',
  data () {
    let checkNodeId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('节点名称不能为空'))
      } else {
        this.nameList.forEach((name) => {
          if (name === value)
            return callback(new Error(value + '已存在'))
        })
        return callback()
      }
    }
    return {
      nodeIdForm: {
        nodeId: ''
      },
      rules: {
        nodeId: [{
          validator: checkNodeId, trigger: 'blur'
        }]
      },
      dialogVisible: false,
    }
  },
  props: {
    nameList: {},
  },

  watch: {
    'nameList': function (val) {//props未更新
      this.nameList = val
    },
  },
  methods: {

    confirmNodeId () {
      this.$refs.nodeIdForm.validate((val, obj) => {
        if (val) {
          this.dialogVisible = false
          this.$emit('confirmNodeId', this.nodeIdForm.nodeId)
        }
      })
    },
  }

}


</script>

<style scoped>

</style>