<template>
  <div id="app">
    <TextboxList />
  </div>
</template>

<script>
import TextboxList from './components/TextboxList.vue'

export default {
  name: 'App',
  components: {
    TextboxList
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
