<template>
  <div>
    <div style="height: calc(100vh - 50px)">
      <RelationGraph
          ref="RN"
          :options="graphOptions"
          :on-node-click="onNodeClick"
          :on-line-click="onLineClick"
      />
    </div>
  </div>
</template>

<script>
import RelationGraph from 'relation-graph'

export default {
  name: 'NetworkView',
  components: { RelationGraph },
  data () {
    return {
      graphOptions: {
        allowSwitchLineShape: true,
        allowSwitchJunctionPoint: true,
        defaultJunctionPoint: 'border',
        // 这里可以参考"Graph 图谱"中的参数进行设置
      },
      url: [
        require('../assets/mv/images_0.jpg'),
        require('../assets/mv/images_1.jpeg'),
      ],
    }
  },

  mounted () {
    this.showRN()
  },
  methods: {
    showRN (query) {
      let __graph_json_data = {
        rootId: '0',
        nodes: [
          {
            id: '0',
            text: '复仇者联盟',
            color: '#ec6941',
            borderColor: '#ff875e',
            borderWidth: 3,
            innerHTML:
                '<div class="c-my-node2" style="background-image: url(' +
                this.url[0] +
                ');"><div class="c-node-name2" style="color:#ff875e">复仇者联盟</div></div>',
          },
          {
            id: '1',
            text: '蚁人',
            color: '#ec6941',
            borderColor: '#ff875e',
            borderWidth: 3,
            innerHTML:
                '<div class="c-my-node2" style="background-image: url(' +
                this.url[1] +
                ');"><div class="c-node-name2" style="color:#ff875e">蚁人</div></div>',
          },
        ],
        links: [
          {
            from: '1',
            to: '0',
            text: '成员',
            color: '#d2c0a5',
            fontColor: '#d2c0a5',
          }
        ]
      }
      this.$refs.RN.setJsonData(
          __graph_json_data,
          (RN) => {
            //called when the relation-graph is completed
          }
      )
    },
    onNodeClick (nodeObject, $event) {
      console.log('onNodeClick:', nodeObject)
    },
    onLineClick (lineObject, $event) {
      console.log('onLineClick:', lineObject)
    },
  }
}
</script>

<style>
.c-my-node2 {
  border: none;
  background-position: center center;
  background-size: 100%;
  height: 80px;
  width: 80px;
  border-radius: 40px;
}

.c-node-name2 {
  width: 160px;
  margin-left: -40px;
  text-align: center;
  margin-top: 85px;
  position: absolute;
}
</style>