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
  transition all 0.4s cubic-bezier(.55,0,.1,1)
.overlap-left-enter, .overlap-right-leave-active
  z-index -1
  position fixed
  opacity 0
  -webkit-transform translate(-30px, 0)
  transform translate(-30px, 0)
.overlap-left-leave-active, .overlap-right-enter
  opacity 0
  -webkit-transform translate(60px, 0)
  transform translate(60px, 0)
</style>
