<template>
  <div id="content">
    <el-container>
      <el-aside width="20%" style="margin:5% 0 0 6%;height: 615px;">
        <user-picture/>
      </el-aside>
      <el-main class="main"></el-main>
    </el-container>
  </div>
</template>

<script>
import UserPicture from "@/components/UserPicture";
export default {
  name: "Creation",
  components: {UserPicture}
}
</script>

<style scoped>
#content{
  background: #f8f8f8;
}
.main{
  padding: 0;
  margin: 5% 10% 2% 3%;
  background: white;
}
</style>