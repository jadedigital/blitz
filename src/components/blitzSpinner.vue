<template>
  <div style="height: calc(100vh - 112px)">
    <q-btn
      size="lg"
      style="height: 1.8em; width: 1.8em; top:16px; left:0; right:0; margin-left: auto; margin-right: auto; box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25); z-index: 1900;"
      class="bg-white text-primary absolute b-spinner"
      round
    />
  </div>
</template>

<style lang="stylus" scoped>
@import '~variables'
.b-spinner:before
  content ''
  box-sizing border-box
  position absolute
  top 50%
  left 50%
  width 1.2em
  height 1.2em
  margin-top 6px
  margin-left 6px
  border-radius 50%
  border 2px solid #fff
  border-top-color $primary
  border-right-color $primary
  animation q-spin 1s infinite linear
</style>
