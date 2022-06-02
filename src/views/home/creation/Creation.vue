<template>
  <div id="content">
    <el-container>
      <el-aside width="20%" style="margin:5% 0 0 6%">
        <user-picture/>
      </el-aside>
      <el-main class="main">创作+单张查看（吴恒）</el-main>
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