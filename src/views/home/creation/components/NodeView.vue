<template>
  <div class="node-box">
    <div style="font-size: 24px;font-weight: 900;margin-bottom: 20px">结点信息</div>
    <div>
      <img class="img-box" :src="currentNode.data.url"/>
      <div style="float: left;margin-left: 20px;width: 63%;">
        <el-descriptions :column="1">
          <el-descriptions-item label="结点名称">{{ currentNode.id }}</el-descriptions-item>
          <el-descriptions-item label="结点信息">{{ currentNode.data.content }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'NodeView',
  components: {},
  data () {
    return {}
  },
  methods: {},
  mounted () {

  },
  props: ['currentNode']

}
</script>

<style scoped lang="scss">

.node-box {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  margin: 15px;

  .node-name-box {
  }

  .node-content-box {
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
</style>