<template lang="html">
  <div class="grid">
    <div class="feature">
      <slot name="feature">
        default
      </slot>
    </div>
    <div class="metricValue">
      <slot name="metricValue">
        default
      </slot>
    </div>
    <div class="popup">
      <slot name="popup">
        default
      </slot>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
.popup {
  display: none;
  position: absolute;
}
.judet:hover .popup {
  display: block;
}

.feature {
  display: inline-block;
}

.metricValue {
  display: inline-block;
}

</style>
