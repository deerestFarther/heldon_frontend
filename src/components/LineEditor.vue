<template>
  <div class="line-edit-box">

    <div class="line-edit-btn-box">
      <el-button type="primary" icon="el-icon-edit" circle v-show="!editMode"
                 @click="editMode=!editMode;"></el-button>
      <el-button plain v-show="editMode"
                 @click="editMode=!editMode;">取消
      </el-button>
      <el-button type="primary" plain v-show="editMode"
                 @click="editMode=!editMode;">确定
      </el-button>
    </div>

    以当前结点作为起点的关系
    <el-tree :data="currentLineToList" :props="relationTreeProps">
      <div slot-scope="{ node, data }">
        {{ node.label }}
      </div>
    </el-tree>

    <div class="network-data-line-box">
      以当前结点作为终点的关系
      <el-tree :data="currentLineFromList" :props="relationTreeProps">
        <div slot-scope="{ node, data }">
          {{ node.label }}
        </div>
      </el-tree>
    </div>
    <div>
      to:
      <el-select v-model="newToNodeId" placeholder="请选择">
        <el-option
            v-for="item in nodeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
        </el-option>
      </el-select>
      <el-button @click="addLine(currentNode.id,newToNodeId)"></el-button>

    </div>
    <div>
      from:
      <el-select v-model="newFromNodeId" placeholder="请选择">
        <el-option
            v-for="item in nodeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
        </el-option>
      </el-select>
      <el-button @click="addLine(newFromNodeId, currentNode.id)"></el-button>
    </div>
  </div>

</template>

<script>
export default {
  name: 'LineEditor',
  props: ['currentLineToList', 'currentLineFromList', 'nodeOptions'],
  data () {
    return {
      relationTreeProps: {
        label: 'text',
        children: 'lines',
        editMode: false,
      },
      newToNodeId: '',
      newFromNodeId: '',
    }
  }

}
</script>


<style scoped>

</style>