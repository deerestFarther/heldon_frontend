<template>
  <div id="app">
<!--    <nav>-->
<!--      <router-link to="/">Home</router-link>-->
<!--      |-->
<!--      <router-link to="/about">About</router-link>-->
<!--      |-->
<!--      <router-link to="/network">Network</router-link>-->
<!--    </nav>-->
<!--    <router-view/>-->
    <register-background/>
    <password-to-login/>
  </div>
</template>

<style lang="scss">
#app {

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
import RegisterBackground from "@/views/RegisterBackground";
import PasswordToLogin from "@/components/log/PasswordtoLogin";
export default {
  components: {PasswordToLogin, RegisterBackground}
}
</script>