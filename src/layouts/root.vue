<template>
  <div>
    <transition :name="transitionName">
      <keep-alive>
        <router-view class="child-slide"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      transitionName: '',
      routeMap: {
        user: 1,
        login: 2,
        matchup: 3,
        team: 4,
        player: 5,
        thread: 6,
        message: 7,
        newmessage: 8,
        settings: 10
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    var fromRoute = ''
    var toRoute = ''
    if (from.path.split('/')[1] === 'settings' && to.path.split('/')[1] === 'settings') {
      fromRoute = from.path.split('/').length
      toRoute = to.path.split('/').length
      this.transitionName = toRoute < fromRoute ? 'overlap-left' : 'overlap-right'
    } else {
      fromRoute = from.path.split('/')[1]
      toRoute = to.path.split('/')[1]
      this.transitionName = this.routeMap[toRoute] < this.routeMap[fromRoute] ? 'overlap-left' : 'overlap-right'
    }
    next()
  }
}
</script>

<style lang="stylus" scoped>
.child-slide
  width 100%
  min-height 100%
  position absolute
  transition all 1.4s
.overlap-left-enter-active
  z-index -1
  position fixed
.overlap-left-enter
  transform translate(-20%, 0)
  position fixed
.overlap-left-leave-active
  transform translate(100%, 0)
.overlap-right-leave-active
  z-index -1
  transform translate(-20%, 0)
  position fixed
.overlap-right-enter
  transform translate(100%, 0)
.overlay
  z-index 4500
  position fixed
  top 0
  left 0
  width 100%
  height 100%
</style>
