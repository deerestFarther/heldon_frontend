<template>
  <div class="network-box">

    <div class="network-data-box">
      <NodeIdForm :name-list="nodeIdList" @confirmNodeId="addNode"></NodeIdForm>
      <el-divider></el-divider>

      <node-editor :current-node="currentNode"></node-editor>

      <el-divider></el-divider>
      <line-editor  :currentLineToList="currentLineToList" :currentLineFromList="currentLineFromList" ></line-editor>

    </div>

    <div class="network-graph">
      <RelationGraph
          ref="RN"
          :options="graphOptions"
          :on-node-click="onNodeClick"
          :on-line-click="onLineClick"
      >
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
import NodeIdForm from '@/components/NodeIdForm'
import NodeEditor from '@/components/NodeEditor'
import axios from 'axios'
import LineEditor from '@/components/LineEditor'

export default {
  name: 'NetworkView',
  components: { LineEditor, NodeEditor, RelationGraph, NodeIdForm },
  data () {

    return {
      netId: 1,
      graphOptions: {
        allowSwitchLineShape: true,
        allowSwitchJunctionPoint: true,
        defaultJunctionPoint: 'border',
        backgrounImageNoRepeat: true,
        backgrounImage: require('../assets/top-bg.png'),
        moveToCenterWhenResize: false,
        // 这里可以参考"Graph 图谱"中的参数进行设置
      },
      url: [
        require('../assets/mv/images_0.jpg'),
        require('../assets/mv/images_1.jpeg'),
      ],
      currentNode: {
        data: {
          url: ''
        }
      },
      maxLineWidth: 10,//线条的最大宽度
      nodeImageStyle: {
        backgroundImage: 'url(' + require('../assets/mv/images_0.jpg') + ')'
      },
      currentLineToList: [], //from为currentNode
      currentLineFromList: [],//to为currentNode
      newToNodeId: '',
      newFromNodeId: '',

      nodeOptions: [],
      RD: {
        changeNodeName: false,
        originalName: '',
      },
      nodeIdList: [],
    }
  },

  mounted () {
    // this.GetNetFromBackEnd(1)
    this.showRN()
  },

  methods: {
    showRN (query) {
      let __graph_json_data = {
        rootId: '复仇者联盟',
        nodes: [
          {
            id: '复仇者联盟',
            text: '复仇者联盟',//text==id 用id来作唯一标识，不能为空，不能重名，方便连线
            color: '#cccccc',
            borderColor: '#111111',
            fontColor: '#121212',
            borderWidth: 3,
            data: { url: this.url[0], id: 1 }//自定义属性放data里面，防止丢失 url 图片的地址， id 数据库里面的id
          },
          {
            id: '蚁人',
            text: '蚁人',
            color: '#ec6941',
            borderColor: '#ff875e',
            fontColor: '#121212',
            borderWidth: 3,
            data: { url: this.url[1], id: 2 }
          },
        ],
        links: [
          {
            from: '复仇者联盟',
            to: '蚁人',
            text: '成员',
            color: '#b2b2b2',
            lineWidth: 2,
            fontColor: '#111111',
          }
        ]
      }
      this.$refs.RN.setJsonData(__graph_json_data, (RN) => {
            //called when the relation-graph is completed
            this.onNodeClick(RN.getNodeById(__graph_json_data.rootId))
            this.updateMsg4Cp()
          }
      )
    },

    onNodeClick (nodeObject, $event) {
      console.log(nodeObject)
      this.currentNode = nodeObject                  //当前选定的结点
      this.currentLineToList = []
      this.currentLineFromList = []
      this.$refs.RN.getLines().forEach((line) => {//获得与当前结点有关的关系
        if (line.fromNode.id === nodeObject.id) {//id是string
          this.currentLineToList.push({
            text: line.toNode.id,
            lines: line.relations,
          })
        }
        if (line.toNode.id === nodeObject.id) {
          this.currentLineFromList.push({
            text: line.toNode.id,
            lines: line.relations,
          })
        }
      })
      this.nodeOptions = []
      this.$refs.RN.getNodes().forEach((node) => {
        this.nodeOptions.push({
          value: node.id,
          label: node.id,
          disabled: node.id === nodeObject.id
        })
      })
    },

    onLineClick (lineObject, $event) {
      console.log('onLineClick:', lineObject)
    },
    //必须自己写node的update
    inputNodeText (e) {
      this.currentNode.text = e.target.value
    },

    updateNodeTextColor () {

    },

    addNode (newNodeId) {//添加node时，其保证的不是整体id唯一，而是添加所有node的id唯一
      let __graph_json_data = {
        nodes: [
          {
            id: newNodeId,//最好改成先输入结点名再添加结点
            text: newNodeId,
            color: '#000000',
            borderColor: '#ffffff',
            fontColor: '#000000',
            borderWidth: 3,
            data: { url: this.url[0], id: '1' }
          }
        ],
        links: []
      }
      this.$refs.RN.appendJsonData(__graph_json_data, (seeksRGGraph) => {
        // 这些写上当图谱初始化完成后需要执行的代码
        this.onNodeClick(this.$refs.RN.getNodeById(newNodeId))
        this.focusNodeById(newNodeId)
        this.updateMsg4Cp()
      })
    },

    addLine (fromId, toId) {
      let __graph_json_data = {
        nodes: [],
        links: [
          {
            from: fromId,
            to: toId,
            text: '',
          }
        ]
      }
      this.$refs.RN.appendJsonData(__graph_json_data, (seeksRGGraph) => {
        this.onNodeClick(this.currentNode.id)
        this.focusNodeById(this.currentNode.id)
      })
    },
    //todo 设置默认显示的图片

    //通过netId获取后端的关于整个图的数据用于展示
    GetNetFromBackEnd (netId) {
      let __graph_json_data = {
        rootId: '11',//todo 每个图需要一个root
        nodes: [],
        links: [],
      }
      let _this = this
      //初始化nodes
      axios.get('http://127.0.0.1:8080/node/selectNodeByNetId/' + netId)
          .then(function ({ data }) {
            for (let i = 0; i < data.length; i++) {
              __graph_json_data.nodes.push({//todo 数据库里面 每个node 的属性还要再加
                id: data[i].nodeId.toString(),
                text: data[i].nodeName,
                color: '#cccccc',
                borderColor: '#111111',
                fontColor: '#121212',
                borderWidth: 3,
                data: {
                  url: data[i].picUrl //todo 耗时很长，需要另外处理
                },
                x: data[i].x,
                y: data[i].y,
              })
            }

          }).catch(function (err) {
        console.log(err)
      })
      axios.get('http://127.0.0.1:8080/relation/selectRelationByNetId/' + netId)
          .then(function ({ data }) {
            for (let i = 0; i < data.length; i++) {
              __graph_json_data.links.push({//todo 数据库里面 每个link 的属性还要再加
                from: data[i].nodeIdFrom.toString(),
                to: data[i].nodeIdTo.toString(),
                text: data[i].edgeName,
                content: data[i].content,
                lineShape: 2,
                lineWidth: 2,
                fontColor: '#111111',
              })
            }
            __graph_json_data.nodes.forEach((value) => {//加载完所有node后，设置innnerHtml 实现最终的展示效果
              //todo 不知道为什么获取不到 value.data.url = require(value.data.url)
              value.innerHTML = _this.InnerHtml2String(value.data.url, value.text, value.fontColor)
            })
            _this.$refs.RN.setJsonData(//加载完所有link后就载入数据
                __graph_json_data,
                (RN) => {
                  //called when the relation-graph is completed
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

    updateMsg4Cp () {
      this.nodeIdList = []
      this.$refs.RN.getNodes().forEach(node => {
        this.nodeIdList.push(node.id)
      })
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
}


.network-data-line {
  display: flex;
  flex-flow: column wrap;
}

.network-graph {
  overflow: hidden;
  height: calc(100vh - 60px);
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