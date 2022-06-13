<template>
  <div class="network-box">

    <div class="network-data-box">
      <div>
        <h1>
          {{ netMessages.netName }}
          <collection-button :net-id="netId" ref="collectionButton"></collection-button>
        </h1>
      </div>
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
import collectionButton from '@/views/home/creation/components/collectionButton'
import CollectionButton from '@/views/home/creation/components/collectionButton'

export default {
  name: 'NetworkView',
  components: { CollectionButton, NodeView, LineView, RelationGraph },
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
      netMessages: {},
      currentNode: {
        data: {
          url: ''
        }
      },
      currentLineToList: [], //from为currentNode
      currentLineFromList: [],//to为currentNode
      ifCollected: false,
    }
  },
  mounted () {
    this.netId = this.$route.query.netId
    this.GetNetFromBackEnd(this.netId)
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
        line.relations.forEach((relation) => {
          if (relation.data.from === nodeObject.id) {//id是string
            this.currentLineToList.push(relation)
          }
          if (relation.data.to === nodeObject.id) {
            this.currentLineFromList.push(relation)
          }
        })
      })
    },
    //通过netId获取后端的关于整个图的数据用于展示
    async GetNetFromBackEnd (netId, nodeId) {
      let __graph_json_data = {
        rootId: '',//todo 每个图需要一个root
        nodes: [],
        links: [],
      }
      await axios.get('http://116.62.36.50:8080/network/getNetworkByNetId/' + netId)
          .then(({ data }) => {
            this.netMessages.netName = data.netName
            this.netMessages.netId = data.netId
            this.netMessages.rootNodeId = data.rootNodeId
          }).catch(function (err) {
            console.log(err)
          })
      //初始化nodes
      let mp = new Map() //nodeId 到 id 的映射
      await axios.get('http://116.62.36.50:8080/node/getNodeListByNetId/' + netId)
          .then(({ data }) => {
            for (let i = 0; i < data.length; i++) {
              mp.set(data[i].nodeId, data[i].id)
              if (data[i].nodeId === this.netMessages.rootNodeId) {
                __graph_json_data.rootId = data[i].id
                this.rootNodeId = data[i].id
              }
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
      await axios.get('http://116.62.36.50:8080/relation/getRelationListByNetId/' + netId)
          .then(({ data }) => {
            for (let i = 0; i < data.length; i++) {
              __graph_json_data.links.push({
                from: mp.get(data[i].nodeIdFrom),
                to: mp.get(data[i].nodeIdTo),
                fontColor: data[i].fontColor,
                lineShape: parseInt(data[i].lineShape),
                text: data[i].text,
                lineWidth: data[i].lineWidth,
                color: data[i].color,
                data: {
                  content: data[i].content,
                  from: mp.get(data[i].nodeIdFrom), to: mp.get(data[i].nodeIdTo),
                  id: data[i].edgeId,
                }
              })
            }
            this.$refs.RN.setJsonData(//加载完所有link后就载入数据
                __graph_json_data,
                (RN) => {
                  //called when the relation-graph is completed
                  if (nodeId == null)
                    this.focusNodeById(this.rootNodeId)
                  else
                    this.focusNodeById(nodeId)
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
  height: calc(100vh);
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