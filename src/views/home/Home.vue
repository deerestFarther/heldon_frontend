<template>
  <div id="content">
    <navigation/>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation";
export default {
  name: "Home",
  components: {Navigation}
}
</script>

<style scoped>
#content{
  background: #f8f8f8;
}
</style>