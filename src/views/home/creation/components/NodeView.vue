<template>
  <div class="node-box">
    <img class="img-box" :src="currentNode.data.url"/>
    <div class="node-name-box">
      {{ currentNode.id }}
    </div>
    <div class="node-content-box">
      {{ currentNode.data.content }}
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
    height: 80px;
    width: 80px;
    border-radius: 50px;
  }
}
</style>