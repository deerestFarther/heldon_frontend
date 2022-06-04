<template>
  <div class="cropper-content">
    <label class="el-icon-edit" for="uploads" v-show="!RD.changeMode" @click="sendMsg">修改图片</label>
    <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);"
           accept="image/png, image/jpeg, image/gif, image/jpg" @change="selectImg($event)">

    <div class="cropper-box" v-if="RD.changeMode">
      <div class="cropper">
        <vue-cropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :info="option.info"
            :canScale="option.canScale"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :full="option.full"
            :fixedBox="option.fixedBox"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :centerBox="option.centerBox"
            :height="option.height"
            :infoTrue="option.infoTrue"
            :maxImgSize="option.maxImgSize"
            :enlarge="option.enlarge"
            :mode="option.mode"
            @realTime="realTime"
            @imgLoad="imgLoad">
        </vue-cropper>
      </div>

      <!--预览效果图-->
      <div class="show-preview">
        <div :style="previews.div" class="preview">
          <img :src="previews.url" :style="previews.img">
        </div>
        <!--底部操作工具按钮-->
        <div class="footer-btn" v-show="RD.changeMode">
          <div class="scope-btn">
            <el-button size="mini" type="danger" plain icon="el-icon-zoom-in" @click="changeScale(1)"></el-button>
            <el-button size="mini" type="danger" plain icon="el-icon-zoom-out" @click="changeScale(-1)"></el-button>
            <el-button size="mini" type="danger" plain @click="rotateLeft">↺</el-button>
            <el-button size="mini" type="danger" plain @click="rotateRight">↻</el-button>
            <el-button size="mini" type="warning" plain @click="back">取消</el-button>
            <el-button size="mini" type="success" @click="yes">确定</el-button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import axios from 'axios'
import OSS from 'ali-oss'

//todo 图片加载有问题
export default {
  name: 'CropperImage',
  components: {
    VueCropper,
  },
  props: ['Name', 'imgUrl'],
  data () {
    return {
      name: this.Name,
      previews: {},
      option: {
        img: this.imgUrl,             //裁剪图片的地址
        outputSize: 1,       //裁剪生成图片的质量(可选0.1 - 1)
        outputType: 'png',  //裁剪生成图片的格式（jpeg || png || webp）
        info: true,          //图片大小信息
        canScale: true,      //图片是否允许滚轮缩放
        autoCrop: true,      //是否默认生成截图框
        autoCropWidth: 80,  //默认生成截图框宽度
        autoCropHeight: 80, //默认生成截图框高度
        fixed: true,         //是否开启截图框宽高固定比例
        fixedNumber: [1, 1], //截图框的宽高比例
        full: false,         //false按原比例裁切图片，不失真
        fixedBox: true,      //固定截图框大小，不允许改变
        canMove: true,      //上传图片是否可以移动
        canMoveBox: true,    //截图框能否拖动
        original: false,     //上传图片按照原始比例渲染
        centerBox: false,    //截图框是否被限制在图片里面
        height: true,        //是否按照设备的dpr 输出等比例图片
        infoTrue: false,     //true为展示真实输出图片宽高，false展示看到的截图框宽高
        maxImgSize: 3000,    //限制图片最大宽度和高度
        enlarge: 1,          //图片根据截图框输出比例倍数
        mode: '230px 150px'  //图片默认渲染方式
      },
      RD: {
        changeMode: false,

      }
    }
  },

  methods: {
    //初始化函数
    imgLoad (msg) {
      console.log('工具初始化函数=====' + msg)
    },
    //图片缩放
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    //向左旋转
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },
    //向右旋转
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    //实时预览函数
    realTime (data) {
      this.previews = data
    },
    //选择图片
    async selectImg (e) {
      let file = e.target.files[0]
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        this.$message({
          message: '图片类型要求：jpeg、jpg、png',
          type: 'error'
        })
        return false
      }
      //转化为blob
      let reader = new FileReader()
      reader.onload = (e) => {
        console.log(e)
        let data
        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.option.img = data
      }
      reader.onerror = (e) => {
        console.log(e)
      }
      //转化为base64
      reader.readAsDataURL(file)
      this.RD.changeMode = true
    },

    uploadImg (item) {
      this.$refs.cropper.getCropBlob(async (data) => {
            const client = new OSS({
              region: 'oss-cn-chengdu',
              accessKeyId: 'LTAI5t8QKarUs4Bccjwgb1FM', // OSS帐号
              accessKeySecret: 'e6Rf4MyrrTOZ2pZ68fkC3q4U1Vv0Fe', // OSS 密码
              bucket: 'relation-network' // 阿里云上存储的 Bucket
            })
            let getFileNameUUID = () => {
              function rx () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
              }

              return `${+new Date()}_${rx()}${rx()}`
            }
            let fileName = getFileNameUUID() + '.png'
            try {
              let result = await client.put(fileName, data)
              this.$emit('imgUploaded', result.url)
            } catch (e) {
              this.$message({
                message: '图片服务器异常,请联系管理员',
                type: 'error'
              })
              return
            }
            this.RD.changeMode = false
          }
      )
    },
    sendMsg(){
      //func: 是父组件指定的传数据绑定的函数，this.msg:子组件给父组件传递的数据
      this.$emit('func',this.RD.changeMode)
    },
    back(){
      this.RD.changeMode=!this.RD.changeMode;
      this.$emit('func',!this.RD.changeMode)
    },
    yes(){
      this.RD.changeMode=!this.uploadImg('blob')
      console.log('djk',this.RD.changeMode)
      this.$emit('func',this.RD.changeMode)
    }
  },
}
</script>

<style scoped lang="scss">
.cropper-content {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-start;
  flex-direction: column;

  .cropper-box {
    flex: 1;
    display: flex;
    width: 100%;

    .cropper {
      width: 150px;
      height: 150px;
    }

    .show-preview {
      flex: 1;
      -webkit-flex: 1;
      justify-content: center;

      .preview {
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid #67c23a;
        background: #cccccc;
        display: inline-block;
        margin-top: 10px;
      }
    }
  }


}

.footer-btn {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  margin-top: 20px;

  .scope-btn {
    display: flex;
    display: -webkit-flex;
    flex-flow: row wrap;
    justify-content: space-between;
    padding-right: 10px;
  }

  .upload-btn {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
  }

  .btn {
    outline: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 8px 15px;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
    margin-right: 10px;
  }
}

.el-button+.el-button, .el-checkbox.is-bordered+.el-checkbox.is-bordered {
  margin-left: 5px;
}
 .el-button--mini, .el-button--mini.is-round {
   padding: 7px 10px;
 }

</style>

