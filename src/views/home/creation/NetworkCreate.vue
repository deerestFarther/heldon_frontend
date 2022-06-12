<template>
  <div class="network-box">

    <div class="network-data-box">
      <node-editor :current-node="currentNode" :id-list="idList" :net-id="netId"
                   @nodeUpdated="nodeDataUpdate" @updateNodeXY="updateNodeList"></node-editor>
      <el-divider></el-divider>
      <line-editor :currentLineToList="currentLineToList" :currentLineFromList="currentLineFromList"
                   :nodeOptions="nodeOptions" :currentNode="currentNode"
                   @lineUpdated="lineDataUpdate" @lineDeleted></line-editor>
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
import NodeIdForm from '@/views/home/creation/components/NodeIdForm'
import NodeEditor from '@/views/home/creation/components/NodeEditor'
import axios from 'axios'
import LineEditor from '@/views/home/creation/components/LineEditor'

export default {
  name: 'NetworkCreate',
  components: { LineEditor, NodeEditor, RelationGraph, NodeIdForm },
  data () {
    return {
      netId: null,
      rootNodeId: '',
      graphOptions: {
        allowSwitchLineShape: false,
        allowSwitchJunctionPoint: true,
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
      lastNodeList: [],
      maxLineWidth: 10,//线条的最大宽度
      nodeImageStyle: {
        backgroundImage: 'url(' + require('../../../assets/mv/images_0.jpg') + ')'
      },
      currentLineToList: [], //from为currentNode
      currentLineFromList: [],//to为currentNode
      nodeOptions: [],
      RD: {
        changeNodeName: false,
        originalName: '',
      },
      idList: [], //存放了当前结点以外的所有结点的id
    }
  },

  mounted () {
    this.netId = this.$route.query.netId

    this.GetNetFromBackEnd(this.netId)
    // this.showRN()
  },

  methods: {

    focusNodeById (nodeId) {//根据id focus结点
      this.$refs.RN.focusNodeById(nodeId)
      this.onNodeClick(this.$refs.RN.getNodeById(nodeId))
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
      this.nodeOptions = []//新建关系时的选项
      this.idList = []
      this.$refs.RN.getNodes().forEach((node) => {
        this.nodeOptions.push({
          label: node.id,
          value: node.data.id,//int db中的id
          disabled: node.id === this.currentNode.id
        })
        if (!(node.id === this.currentNode.id))
          this.idList.push(node.id)
      })
      console.log(this.currentLineToList)
    },

    onLineClick (lineObject, $event) {
      console.log('onLineClick:', lineObject)
    },
    // inputNodeText (e) {
    //   this.currentNode.text = e.target.value
    // },
    // addNode (newNodeId) {//添加node时，其保证的不是整体id唯一，而是添加所有node的id唯一
    //   let newNode = {
    //     id: newNodeId,
    //     text: newNodeId,
    //     color: '#ffffff',
    //     borderColor: '#ffffff',
    //     fontColor: '#000000',
    //     borderWidth: 3,
    //     data: { url: '', id: '', content: '' },
    //     x: 0,
    //     y: 0,
    //   }
    //   let __graph_json_data = {
    //     nodes: [
    //       newNode
    //     ],
    //     links: []
    //   }
    //   axios.post(this.serverUrl + 'node/insertOneNode', {
    //     netId: this.netId,
    //     nodeName: newNode.id,
    //     id: newNode.id,
    //     text: newNode.text,
    //     color: newNode.color,
    //     borderColor: newNode.borderColor,
    //     fontColor: newNode.fontColor,
    //     content: newNode.data.content,
    //     x: newNode.x,
    //     y: newNode.y,
    //     url: newNode.data.url
    //   }).then((res) => {
    //     this.$refs.RN.appendJsonData(__graph_json_data, (seeksRGGraph) => {
    //       // 这些写上当图谱初始化完成后需要执行的代码
    //       this.onNodeClick(this.$refs.RN.getNodeById(newNodeId))
    //       this.focusNodeById(newNodeId)
    //       this.updateMsg4Cp()
    //     })
    //   }).catch((err) => {
    //     console.log(err)
    //   })
    // },
    // saveLastNodeList () {
    //   let currentNodeList = this.$refs.RN.getNodes()
    //   currentNodeList.forEach((node) => {
    //     this.lastNodeList.push({
    //       borderColor: node.borderColor,
    //       color: node.color,
    //       data: {
    //         url: node.data.url,
    //         content: node.data.content,
    //       },
    //       fontColor: node.fontColor,
    //       id: node.id,
    //       text: node.text,
    //       x: node.x,
    //       y: node.y,
    //     })
    //   })
    // },
    updateNodeList () {
      let list = []
      this.$refs.RN.getNodes().forEach((node) => {
        list.push({
          nodeId: node.data.id,
          x: node.x,
          y: node.y,
        })
      })
      axios.put(this.serverUrl + 'node/updateNodeList', list)
          .then((res) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            //更新成功
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: '保存失败'
            })
            console.log(err)
          })
    },
    async DeleteNode () {
      await axios.get(this.serverUrl + 'node/deleteNodeByNodeId/' + this.currentNode.data.id,
      ).then((res) => {
        this.$refs.RN.removeNodeById(this.currentNode.id)
        let id
        this.$refs.RN.getNodes().forEach((node) => {//重新选定rootNode
          if (!node.data.ableDelete) {
            id = node.id
          }
        })
        this.focusNodeById(id)
      }).catch((err) => {
        console.log(err)
      })
    },

    addLine (data) {
      let __graph_json_data = {
        nodes: [],
        links: [
          {
            from: data.fromId,
            to: data.toId,
            text: '',
          }
        ]
      }
      this.$refs.RN.appendJsonData(__graph_json_data, (seeksRGGraph) => {
        console.log(this.currentNode)
        this.onNodeClick(this.currentNode.id)
        this.focusNodeById(this.currentNode.id)
      })
    },
    //todo 设置默认显示的图片

    //通过netId获取后端的关于整个图的数据用于展示
    async GetNetFromBackEnd (netId, nodeId) {
      let __graph_json_data = {
        rootId: '',//todo 每个图需要一个root
        nodes: [],
        links: [],
      }
      await axios.get(this.serverUrl + 'network/getNetworkByNetId/' + netId)
          .then(({ data }) => {
            this.netMessages.netName = data.netName
            this.netMessages.netId = data.netId
            this.netMessages.rootNodeId = data.rootNodeId
          }).catch(function (err) {
            console.log(err)
          })
      //初始化nodes
      let mp = new Map() //nodeId 到 id 的映射
      await axios.get(this.serverUrl + 'node/getNodeListByNetId/' + netId)
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
      await axios.get(this.serverUrl + 'relation/getRelationListByNetId/' + netId)
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

    lineDataUpdate () {//在添加或删除一条关系后更新
      this.GetNetFromBackEnd(this.netId, this.currentNode.id)
    },
    nodeDataUpdate (data) {//在添加或删除结点后更新
      if (data == null)
        this.GetNetFromBackEnd(this.netId)//删除结点
      else
        this.GetNetFromBackEnd(this.netId, data)//添加结点
    }
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

.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  /* margin: 24px 0; */
}

</style>