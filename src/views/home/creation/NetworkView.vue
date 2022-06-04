<template>
  <div class="network-box">

    <div class="network-data-box">
      <node-view :current-node="currentNode"></node-view>
      <line-view :current-line-from-list="currentLineFromList"
                 :current-line-to-list="currentLineToList"
      ></line-view>
    </div>
    <div class="network-graph">
      <RelationGraph
          ref="RN"
          :options="graphOptions"
          :on-node-click="onNodeClick"
          :on-line-click="onLineClick">
        <div slot-scope="{node}" slot="node">
          <img :src="node.data.url" class="c-my-node2">
          <div class="c-node-name2">{{ node.text }}</div>
        </div>
      </RelationGraph>
    </div>
  </div>
</template>

<script>
import RelationGraph from 'relation-graph'
import NodeView from '@/views/home/creation/components/NodeView'
import LineView from '@/views/home/creation/components/LineView'
import axios from 'axios'

export default {
  name: 'NetworkView',
  components: { NodeView, LineView, RelationGraph },
  data () {
    return {
      netId: null,
      graphOptions: {
        // allowSwitchLineShape: true,
        // allowSwitchJunctionPoint: true,
        defaultJunctionPoint: 'border',
        backgrounImageNoRepeat: true,
        backgrounImage: require('../../../assets/top-bg.png'),
        moveToCenterWhenResize: false,
        // 这里可以参考"Graph 图谱"中的参数进行设置
      },
      currentNode: {
        data: {
          url: ''
        }
      },
      currentLineToList: [], //from为currentNode
      currentLineFromList: [],//to为currentNode
    }
  },
  mounted () {
    this.netId = this.$route.query.netId
    console.log(this.GetNetFromBackEnd(this.netId))
    // this.showRN()
  },

  methods: {
    onLineClick (lineObject, $event) {
      console.log(lineObject)
    },
    onNodeClick (nodeObject, $event) {
      this.currentNode = nodeObject                  //当前选定的结点
      this.currentLineToList = []
      this.currentLineFromList = []
      this.$refs.RN.getLines().forEach((line) => {//获得与当前结点有关的关系
        if (line.fromNode.id === nodeObject.id) {//id是string
          this.currentLineToList.push.apply(this.currentLineToList, line.relations)
        }
        if (line.toNode.id === nodeObject.id) {
          this.currentLineFromList.push.apply(this.currentLineFromList, line.relations)
        }
      })
      console.log(this.currentLineToList)
    },
    //通过netId获取后端的关于整个图的数据用于展示
    async GetNetFromBackEnd (netId) {
      let __graph_json_data = {
        rootId: '',//todo 每个图需要一个root
        nodes: [],
        links: [],
      }
      await axios.get('http://localhost:8080/network/getRootIdNameByNetId/' + netId)
          .then(({ data }) => {
            __graph_json_data.rootId = data
          }).catch(function (err) {
            console.log(err)
          })
      //初始化nodes
      let mp = new Map() //nodeId 到 id 的映射
      await axios.get('http://localhost:8080/node/getNodeListByNetId/' + netId)
          .then(({ data }) => {
            for (let i = 0; i < data.length; i++) {
              mp.set(data[i].nodeId, data[i].id)
              __graph_json_data.nodes.push({
                id: data[i].id,
                text: data[i].text,
                color: data[i].color,
                borderColor: data[i].borderColor,
                fontColor: data[i].fontColor,
                borderWidth: data[i].borderWidth,
                data: {
                  url: data[i].url,
                  id: data[i].nodeId,//真正的id
                  content: data[i].content,
                  ableDelete: !(__graph_json_data.rootId === data[i].id)
                },
                x: data[i].x,
                y: data[i].y,
                fixed: true,
              })
            }
          }).catch(function (err) {
            console.log(err)
          })
      await axios.get('http://localhost:8080/relation/getRelationListByNetId/' + netId)
          .then(({ data }) => {
            for (let i = 0; i < data.length; i++) {
              __graph_json_data.links.push({
                from: mp.get(data[i].nodeIdFrom),
                to: mp.get(data[i].nodeIdTo),
                fontColor: data[i].fontColor,
                lineShape: data[i].lineShape,
                text: data[i].text,
                lineWidth: data[i].lineWidth,
                color: data[i].color,
                data: {
                  content: data[i].content,
                  from: mp.get(data[i].nodeIdFrom), to: mp.get(data[i].nodeIdTo)
                }
              })
            }
            this.$refs.RN.setJsonData(//加载完所有link后就载入数据
                __graph_json_data,
                (RN) => {
                  //called when the relation-graph is completed
                  this.onNodeClick(RN.getNodeById(__graph_json_data.rootId))
                }
            )
          }).catch(function (err) {
            console.log(err)
          })
    },

    focusNodeById (nodeId) {//根据id focus结点
      this.$refs.RN.focusNodeById(nodeId)
      this.currentNode = this.$refs.RN.getNodeById(nodeId)
    },

  }
}
</script>

<style scoped lang="scss">
.network-box {
  display: flex;
  flex-flow: row nowrap;
  justify-content: stretch;
  align-items: flex-start;
  overflow: hidden;
}

.network-data-box {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  overflow-y: scroll;
  width: 500px;
}

.network-graph {
  overflow: hidden;
  height: calc(100vh - 110px);
  width: calc(100vw);
}

.c-my-node2 {
  border: none;
  background-position: center center;
  background-size: 100%;
  height: 80px;
  width: 80px;
  border-radius: 50px;
}

.c-node-name2 {
  width: 160px;
  margin-left: -40px;
  text-align: center;
  position: absolute;
}

</style>