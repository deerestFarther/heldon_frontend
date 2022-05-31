<template>
  <div class="node-edit-box">


    <div class="node-edit-btn-box">
      <el-button type="primary" icon="el-icon-edit" circle v-show="!editMode"
                 @click="editMode=!editMode;"></el-button>
      <el-button plain v-show="editMode"
                 @click="editMode=!editMode;">取消
      </el-button>
      <el-button type="primary" plain v-show="editMode"
                 @click="editMode=!editMode;">确定
      </el-button>
    </div>
    <div class="node-name-box">
      <el-input type="text" v-model:value="currentNode.text" :disabled="!editMode"
                @input="inputNodeText" placeholder="节点名称" maxlength="15" show-word-limit>
      </el-input>
    </div>
    <img class="img-box" :src="currentNode.data.url"/>

    <cropper-image @imgUploaded="updateNodePic" v-show="editMode"></cropper-image>

    <div class="node-style-box">
      背景颜色：
      <el-color-picker :disabled="!editMode" v-model="currentNode.color" show-alpha :predefine="predefineColors">
      </el-color-picker>
      边框颜色：
      <el-color-picker :disabled="!editMode" v-model="currentNode.borderColor" show-alpha :predefine="predefineColors">
      </el-color-picker>
      文字颜色：
      <el-color-picker :disabled="!editMode" v-model="currentNode.fontColor" show-alpha :predefine="predefineColors">
      </el-color-picker>
    </div>

  </div>
</template>

<script>
import CropperImage from '@/components/CropperImage'

export default {
  name: 'NodeEditor',
  components: { CropperImage },
  data () {
    return {
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
      editMode: false,
    }
  },
  methods: {
    inputNodeText () {},

    updateNodePic (data) {
      this.currentNode.data.url = data
    },
  },
  mounted () {
    console.log(this.currentNode)
  },
  props: ['currentNode']
}
</script>

<style scoped lang="scss">

.node-edit-box {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  width: 500px;

  .node-edit-btn-box {
    align-self: flex-end;
  }

  .node-name-box {

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