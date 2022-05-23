<template>
  <div>
    当前选定的结点:
    <input type="text" :value="currentNode.text" @input="updateNodeText" placeholder="当前未选定结点">
    <img :src="currentNode.data.url" class="c-my-node2"/>
    <cropper-image></cropper-image>
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
import Vue from 'vue'
import CropperImage from '@/components/cropper'

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
        backgroundImage: 'url(' + require(('../assets/mv/images_0.jpg')) + ')'
      }
    }
  },
  computed: {

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
    },
    updateNodeText (e) {
      this.currentNode.text = e.target.value
      this.currentNode.innerHTML = this.InnerHtml2String(this.currentNode.data.url, this.currentNode.text, this.currentNode.fontColor)
    },
    updateNodePic (e) {

    },
    updateNodeTextColor (e) {

    },

    //todo 设置默认显示的图片
    //将url text textColor属性转为innerHtml属性显示
    InnerHtml2String (url, text, textColor) {
      return '<img class="c-my-node2" src=' +
          url +
          '><div class="c-node-name2" style="color:' + textColor + '">' + text + '</div></img>'
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
  position: absolute;
}
</style>