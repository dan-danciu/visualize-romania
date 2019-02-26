<template>
  <div id="app">
    <ul :style="ulStyle">
      <li class="card" v-for="item in overlayData" :key="item.name">
        <OverlayFeature>
          <span slot="feature">{{ item.name }}</span>
          <input
            type="number"
            class="nrinput"
            slot="metricValue"
            v-model="item.metricValue"
            min="0" max="100"
          >

        </OverlayFeature>
      </li>
    </ul>

    <VisualMap/>
  </div>

</template>

<script>

import { size } from 'lodash'
import { mapState } from 'vuex'

export default {
  name: `app`,
  components: {
    VisualMap: () => import("./components/VisualMap.vue"),
    OverlayFeature: () => import ("./components/OverlayFeature.vue")
  },
  computed: {
    ...mapState('mapdata', { overlayData: 'overlayData'}),
    numberOfColumns() {
      return Math.floor(size(this.overlayData)/10)+1
    },
    ulStyle() {
      return {
        columns: 5,
        listStyleType: 'none'
      }
    }
  },
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
.nrinput {
  text-align: center;
  max-width: 100px;
}
</style>
