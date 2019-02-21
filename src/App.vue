<template>
  <div id="app">

    <VisualMap/>
  </div>

</template>

<script>

export default {
  name: `app`,
  components: {
    VisualMap: () => import("./components/VisualMap.vue"),
  }
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
.app {
  width: 100vw;
  height: 100vh;
}
</style>
