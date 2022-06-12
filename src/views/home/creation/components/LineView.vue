<template>
  <div class="line-edit-box">

    <div style="font-size: 24px;font-weight: 900;margin-bottom: 20px">关系列表</div>

    <div v-for="line in currentLineToList" :key="line.id">
      <div style="margin: 6px 0px 6px 0px; font-family: 楷体">
        {{ line.data.from }}
        <i class="el-icon-right" style="color:goldenrod"></i>
        {{ line.data.to }}
      </div>
      <el-descriptions :column="1">
        <el-descriptions-item label="关系名称">{{ line.text }}</el-descriptions-item>
        <el-descriptions-item label="关系信息">{{ line.data.content }}</el-descriptions-item>
      </el-descriptions>
    </div>

  </div>

</template>

<script>
export default {
  name: 'LineEditor',
  props: ['currentLineToList', 'currentLineFromList'],
  data () {
    let t = true
    return {
      relationTreeProps: {
        label: 'text',
        children: 'lines',
      },
      editMode: false,
      newToNodeId: '',
      newFromNodeId: '',
    }
  },
  methods: {
    addLine (fromId, toId) {
      this.$emit('addLine', { fromId, toId })
    }
  }
}
</script>

<style scoped lang="scss">
.line-edit-box {
  display: flex;
  flex-flow: column;
  margin: 15px;

  .line-edit-btn-box {
    align-self: flex-end;
  }
}
</style>