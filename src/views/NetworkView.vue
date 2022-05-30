<template>
  <div class="network-box">

    <div class="network-data-box">
      <NodeIdForm :name-list="nodeIdList" @confirmNodeId="addNode"></NodeIdForm>

      <div class="node-name-box">
        <el-input type="text" v-model:value="currentNode.text" :disabled="!RD.changeNodeName"
                  @input="inputNodeText" placeholder="节点名称" maxlength="15" show-word-limit>
        </el-input>
        <el-button type="primary" icon="el-icon-edit" circle v-show="!RD.changeNodeName"
                   @click="RD.changeNodeName=!RD.changeNodeName;RD.originalName=currentNode.text"></el-button>
        <el-button plain v-show="RD.changeNodeName"
                   @click="RD.changeNodeName=!RD.changeNodeName;currentNode.text=RD.originalName">取消
        </el-button>
        <el-button type="primary" plain v-show="RD.changeNodeName">确定</el-button>

      </div>

      <img class="img-box" :src="currentNode.data.url"/>

      <cropper-image @imgUploaded="updateNodePic"></cropper-image>

      <div class="node-style-box">
        背景颜色：
        <el-color-picker
            v-model="currentNode.color" show-alpha :predefine="predefineColors">
        </el-color-picker>
        边框颜色：
        <el-color-picker
            v-model="currentNode.borderColor" show-alpha :predefine="predefineColors">
        </el-color-picker>
        文字颜色：
        <el-color-picker
            v-model="currentNode.fontColor" show-alpha :predefine="predefineColors">
        </el-color-picker>
      </div>
      <el-divider></el-divider>
      <div class="network-data-line-box">
        以当前结点作为起点的关系
        <el-tree :data="currentLineToList" :props="relationTreeProps">
          <div slot-scope="{ node, data }">
            {{ node.label }}
          </div>
        </el-tree>
      </div>

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
import CropperImage from '@/components/CropperImage'
import NodeIdForm from '@/components/NodeIdForm'
import axios from 'axios'

export default {
  name: 'NetworkView',
  components: { CropperImage, RelationGraph, NodeIdForm },
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
        id: '',
        text: '',
        fontColor: '#000000',
        data: {
          url: require('../assets/top-bg.png')
        }
      },
      maxLineWidth: 10,//线条的最大宽度
      nodeImageStyle: {
        backgroundImage: 'url(' + require('../assets/mv/images_0.jpg') + ')'
      },
      currentLineToList: [], //from为currentNode
      currentLineFromList: [],//to为currentNode
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
      newToNodeId: '',
      newFromNodeId: '',
      relationTreeProps: {
        label: 'text',
        children: 'lines',
      },
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
    console.log(this.$refs.RN.getGraphJsonData())
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
        links: [       //连线上的文字样式没法改
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
      this.currentNode = nodeObject                  //当前选定的结点
      this.currentLineToList = []
      this.currentLineFromList = []
      console.log(this.$refs.RN.getLines())
      this.$refs.RN.getLines().forEach((line) => {//获得与当前结点有关的关系
        if (line.fromNode.id === nodeObject.id) {//id是string
          this.currentLineToList.push({
            target: line.toNode.id,
            lines: line.relations,
          })
        }
        if (line.toNode.id === nodeObject.id) {
          this.currentLineFromList.push({
            target: line.toNode.id,
            lines: line.relations,
          })
        }
      })
      console.log(this.currentLineToList)
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

    updateNodePic (data) {
      this.currentNode.data.url = data
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
        this.updateMsg4Cp()
        this.focusNodeById(newNodeId)
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

.network-data-box {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  width: 500px;

  .node-name-box {
    display: flex;
    flex-flow: row nowrap;
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

.network-data-line {
  display: flex;
  flex-flow: column wrap;
}

.network-graph {
  overflow: hidden;
  height: calc(100vh - 50px);
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