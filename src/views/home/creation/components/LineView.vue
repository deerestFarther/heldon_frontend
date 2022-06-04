<template>
  <div class="line-edit-box">

    关系列表
    <div v-for="line in currentLineToList" :key="line.id">
      <div>
        {{ line.data.from }} {{ line.data.to }}

      </div>
      <div>
        {{ line.data.content }}
      </div>
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

  .line-edit-btn-box {
    align-self: flex-end;
  }
}
</style>