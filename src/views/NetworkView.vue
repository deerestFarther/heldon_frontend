<template>
  <div>
    <input type="text" ref="nodeTextInput" @change="updateNodeText">
    <cropper-image></cropper-image>
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
import Vue from 'vue'
import CropperImage from '@/components/cropper'

let currentNode = null
let test_text
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
      this.$refs.nodeTextInput.value = nodeObject.text
      currentNode = nodeObject
      this.sliceUrlFromInnerHtml(currentNode.innerHTML)
    },
    onLineClick (lineObject, $event) {
      console.log('onLineClick:', lineObject)
    },
    updateNodeText (e) {
      currentNode.text = e.target.value
      currentNode.innerHTML = this.InnerHtml2String(currentNode.data.url, currentNode.text, currentNode.fontColor)
    },
    updateNodePic (e) {

    },
    updateNodeTextColor (e) {

    },

    //todo 设置默认显示的图片
    //将url text textColor属性转为innerHtml属性显示
    InnerHtml2String (url, text, textColor) {
      return '<div class="c-my-node2" style="background-image: url(' +
          url +
          ');"><div class="c-node-name2" style="color:' + textColor + '">' + text + '</div></div>'
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