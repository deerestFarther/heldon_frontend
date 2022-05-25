<template>
  <div>

    <div v-for="line in currentLineList">
      text:<input type="text" v-model:value="line.text"></input>
      fontcolor:<input type="text" v-model:value="line.fontColor"></input>
      from: <input type="text" v-model:value="line.form"></input>
      to: <input type="text" v-model:value="line.to"></input>
      lineWidth:<input type="text" v-model:value="line.lineWidth"></input>
      lineColor:<input type="text" v-model:value="line.color"></input>
      lineShape:<input type="text" v-model:value="line.lineShape"></input>
    </div>

    <input type="text" :value="currentNode.text" @input="updateNodeText" placeholder="当前未选定结点">
    <img :src="currentNode.data.url" class="c-my-node2"/>
    <button @click="addNode">addNode</button>
    <cropper-image :img-url="currentNode.data.url" @updateNodePic="updateNodePic"></cropper-image>
    <div style="height: calc(60vh - 50px)">
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
import CropperImage from '@/components/CropperImage'
import axios from 'axios'

let innerHtmlProps = {
  imageStyle: '',
  imageUrl: '',
  textStyle: '',
  text: ''
}
export default {
  name: 'NetworkView',
  components: { CropperImage, RelationGraph },
  data () {
    return {
      netId: 1,
      graphOptions: {
        allowSwitchLineShape: true,
        allowSwitchJunctionPoint: true,
        defaultJunctionPoint: 'border',
        backgrounImageNoRepeat: true,
        backgrounImage: require('../assets/top-bg.png'),
        // 这里可以参考"Graph 图谱"中的参数进行设置
      },
      url: [
        require('../assets/mv/images_0.jpg'),
        require('../assets/mv/images_1.jpeg'),
      ],
      currentNode: {
        text: '',
        fontColor: '#000000',
        data: {
          url: require('../assets/top-bg.png')
        }
      },
      nodeImageStyle: {
        backgroundImage: 'url(' + require('../assets/mv/images_0.jpg') + ')'
      },
      currentLineList: [],
    }
  },
  computed: {},

  mounted () {
    // this.GetNetFromBackEnd(1)
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
            color: '#cccccc',
            borderColor: '#111111',
            fontColor: '#121212',
            borderWidth: 3,
            data: { url: this.url[0] }//自定义属性放data里面，防止丢失
          },
          {
            id: '1',
            text: '蚁人',
            color: '#ec6941',
            borderColor: '#ff875e',
            fontColor: '#121212',
            borderWidth: 3,
            data: { url: this.url[1] }
          },
        ],
        links: [       //连线上的文字样式没法改
          {
            from: '1',
            to: '0',
            text: '成员',
            color: '#b2b2b2',
            lineShape: 2,
            lineWidth: 2,
            fontColor: '#111111',
          }
        ]
      }
      __graph_json_data.nodes.forEach((value) => {
        value.innerHTML = this.InnerHtml2String(value.data.url, value.text, value.fontColor)
      })
      this.$refs.RN.setJsonData(
          __graph_json_data,
          (RN) => {
            //called when the relation-graph is completed
          }
      )
    },

    onNodeClick (nodeObject, $event) {
      console.log('onNodeClick:', nodeObject)
      this.currentNode = nodeObject                  //当前选定的结点
    },
    onLineClick (lineObject, $event) {
      console.log('onLineClick:', lineObject)
      this.currentLineList = lineObject.relations
    },
    //必须自己写node的update
    updateNodeText (e) {
      this.currentNode.text = e.target.value
      this.currentNode.innerHTML = this.InnerHtml2String(this.currentNode.data.url, this.currentNode.text, this.currentNode.fontColor)
    },
    updateNodePic (data) {
      this.currentNode.data.url = data
    },
    updateNodeTextColor () {

    },

    addNode () {
      let __graph_json_data = {
        nodes: [
          {
            id: '3',
            text: '未命名',
            color: '#000000',
            borderColor: '#ffffff',
            fontColor: '#000000',
            borderWidth: 3,
            data: { url: this.url[0] }
          }
        ],
        links: []
      }
      __graph_json_data.nodes.forEach((value) => {
        value.innerHTML = this.InnerHtml2String(value.data.url, value.text, value.fontColor)
      })
      this.$refs.RN.appendJsonData(__graph_json_data, (seeksRGGraph) => {
        // 这些写上当图谱初始化完成后需要执行的代码
      })
    },

    //todo 设置默认显示的图片
    //将url text textColor属性转为innerHtml属性显示
    InnerHtml2String (url, text, textColor) {
      return '<img class="c-my-node2" src=' +
          url +
          '><div class="c-node-name2" style="color:' + textColor + '">' + text + '</div></img>'
    },

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

    }

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
  position: absolute;
}

</style>