<template>
  <div class="app"/>
</template>

<script>

import gmapsInit from '../utils/gmaps'

export default {
  name: `app`,
  data() {
    return {
      judete: {}
    }
  },
  async mounted() {
    try {
      const google = await gmapsInit()
      const geocoder = new google.maps.Geocoder()
      const map = new google.maps.Map(this.$el)
      geocoder.geocode({ address: `Romania` }, (results, status) => {
        if (status !== `OK` || !results[0]) {
          throw new Error(status);
        }
        map.setCenter(results[0].geometry.location)
        map.fitBounds(results[0].geometry.viewport)
        map.data.loadGeoJson(
            'https://s3-eu-west-1.amazonaws.com/visually-ro/ro_judete_poligon.json')

        // Set the stroke width, and fill color for each polygon
        map.data.setStyle((feature) => {
          var SD_NAME = feature.getProperty('name')
          var color = "orange"
          if (SD_NAME === "Cluj") {
            color = "green"
          }
          this.judete[feature.getProperty('name')] = Math.floor(Math.random() * 101)
          const opacity = this.judete[SD_NAME] / 100
          return {
            fillColor: color,
            fillOpacity: opacity,
            strokeWeight: 1
          }
        });
      });

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  },
};
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
