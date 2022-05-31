<template>
  <div id="app">
    <nav>
      <router-link to="/"></router-link>
      <router-link to="/about"></router-link>
      <router-link to="/network"></router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding:0;
  margin:0;
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  border:hidden;
}
nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script>

</script>