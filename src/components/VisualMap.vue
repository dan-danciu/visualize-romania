<template>
  <div class="app"/>
</template>

<script>

import gmapsInit from '../utils/gmaps'
import { mapState, mapGetters } from 'vuex'
import interpolate from 'color-interpolate'
import { reduce, initial, last, get, set } from 'lodash'

export default {
  name: `app`,
  data() {
    return {
      google: null,
      map: null,
      overlayProperties: {},
      style: [
        {
          "featureType": "all",
          "stylers": [
            { "color": "#ebebeb" }
          ]
        },
        {
          "featureType": 'administrative.country',
          "elementType": 'labels.text.fill',
          "stylers": [{"color": '#d59563'}]
        },
        {
          "featureType": 'water',
          "elementType": 'geometry',
          "stylers": [{"color": '#a9c4ec'}]
        },
        {
          "featureType": "landscape",
          "elementType": "labels",
          "stylers": [
            { "visibility": "off" }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState('auth', { apiKey: 'apiKey'}),
    ...mapState('mapdata', {overlayData: 'overlayData'}),
    ...mapGetters('mapdata', { metric: 'valuesOnly' }),
    niceMetric() {
      var result = reduce(this.metric, function(object, item) {
      var name = initial(item)
      var value = get(object, name, []).concat(last(item))
      return set(object, name, value[0])
    }, {})
    return result
    }
  },
  async mounted() {
    try {
      await this.$store.dispatch('auth/getApiKey')
      this.google = await gmapsInit(this.apiKey)
      const romania = {lat: 45.9432, lng: 24.9668}
      this.map = new this.google.maps.Map(this.$el, { center: romania, zoom: 7, styles: this.style })
      this.map.data.loadGeoJson('https://s3-eu-west-1.amazonaws.com/visually-ro/ro_judete_poligon.json')

      // Set the stroke width, and fill color for each polygon
      this.map.data.setStyle((feature) => {
        const featureName = feature.getProperty('name')
        let tempDict = {}
        feature.forEachProperty((value, property) => {
          tempDict[property] = value
          })
        this.overlayProperties[featureName] = { ...tempDict }
        const polygon = new this.google.maps.Polygon({paths: feature.getGeometry().getArray()[0].j})
        this.overlayProperties[featureName] = {
          ...this.overlayProperties[featureName],
          metricValue: Math.floor(Math.random() * 101),
          polygon: polygon
        }
        let colormap = interpolate(['#b7bcdb', '#ff9d00'])
        const metricValue = this.overlayProperties[featureName].metricValue / 100
        return {
          fillColor: colormap(metricValue),
          fillOpacity: .7,
          strokeWeight: 1
        }
      })
      await this.$store.commit('mapdata/setData', this.overlayProperties)
      this.map.data.addListener('click', (e) => {
        const marker_label = this.getLabel(e.latLng)
        //console.log(feature.getProperty('name'))
        new this.google.maps.Marker({
          position: e.latLng,
          map: this.map,
          label: marker_label

        })
      })


    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }

  },
  methods: {
    getLabel(position) {
      for (var feature in this.overlayData) {
        if (!this.overlayData.hasOwnProperty(feature)) continue;

        var obj = this.overlayData[feature];
        for (var prop in obj) {
            // skip loop if the property is from prototype
            if(!obj.hasOwnProperty(prop)) continue;

            if (this.google.maps.geometry.poly.containsLocation(position, obj.polygon))
            {
              return obj.name
            }
        }


      }
    },
    setStyle() {
      this.map.data.setStyle((feature) => {
        const featureName = feature.getProperty('name')
        let colormap = interpolate(['#b7bcdb', '#ff9d00'])
        let metricValue = 0
        if (this.niceMetric[featureName]) {
          metricValue = this.niceMetric[featureName] / 100
        }

        return {
          fillColor: colormap(metricValue),
          fillOpacity: .7,
          strokeWeight: 1
        }


      })

    }
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
