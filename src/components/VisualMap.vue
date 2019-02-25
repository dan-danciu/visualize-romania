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
          const polygon = new google.maps.Polygon({paths: feature.getGeometry().getArray()[0].j})


          this.judete[SD_NAME] = {value: Math.floor(Math.random() * 101), polygon: polygon}

        const opacity = this.judete[SD_NAME].value / 100
        return {
          fillColor: color,
          fillOpacity: opacity,
          strokeWeight: 1
        }
      })
      map.data.addListener('click', (e) => {
        const judet_label = this.getLabel(google, e.latLng)
          //console.log(feature.getProperty('name'))
        new google.maps.Marker({
          position: e.latLng,
          map: map,
          label: judet_label

      })
    })


    })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }

  },
  methods: {
    getLabel(google, position) {
      for (var judet in this.judete) {
        if (google.maps.geometry.poly.containsLocation(position, this.judete[judet].polygon))
        {
          return judet
        }

      }
    },
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
