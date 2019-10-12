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

<style lang="stylus">
@import '~variables'
.child-slide
  width 100%
  min-height 100%
  position absolute
  transition all 0.4s
.overlap-left-enter-active
  z-index -1
  position fixed
.overlap-left-leave-active
  opacity 0
  transform translate(300px, 0)
.overlap-right-leave-active
  z-index -1
  position fixed
.overlap-right-enter
  opacity 0
  transform translate(300px, 0)
.no-pad
  padding 0
.no-border
  border none
.border-bottom
  border-bottom solid 1px rgba(0,0,0,0.1)
.panel-bg
  height 180px
.panel-bg .bg-gradient-opacity
  height 100%
  background linear-gradient(0deg, rgba(61, 90, 254, 0.9) 20%, rgba(61, 90, 254, 0.1) 100%);
  z-index 2
.panel-bg .team-heading
  color #ffffff
  padding-top 130px
  padding-left 10px
.panel-bg .team-heading span
  display inline-block
  color #cccccc
.panel-bg .my-team-img
  border-radius 50%
  border 2px solid
  background #fff
  height 60px
  width 60px
  margin-top 120px
  margin-left 10px
.card-main
  overflow auto
.logo-container
  width 255px
  height 242px
  perspective 800px
  position absolute
  top 50%
  left 50%
  transform translateX(-50%) translateY(-50%)
.logo
  position absolute
  transform-style preserve-3d
.contain-main
  height 100%
  padding-bottom 62px
.q-item-side-right .q-item-label
  color #0c0c0c
  font-weight 500
.q-card.compact-card
  box-shadow none
  margin 0
.q-tab
  font-size 10px
  padding 0
  min-height 62px
.q-tab.icon-and-label:not(.hide-icon):not(.hide-label)
  padding 0
  min-height 62px
.q-tabs-inverted .q-tabs-scroller
  color #555
.q-tab.active
  color #3d5afe
.bg-gradient
  background $gradient
.bg-gradient-opacity
  background linear-gradient(141deg, rgba(61, 90, 254, 1.0) 15%, rgba(61, 90, 254, 0.8) 100%);
  z-index 2
.player-bg-pic
  background-size: cover;
  overflow: hidden;
.main-avatar .q-item-avatar
  height 46px
  width 46px
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
.layout-aside-right
  width 100%
.standings .team-name-main
  border-bottom none!important
  padding-bottom 0!important
.team-players
  font-weight 500
.team-players small
  color #555
  font-size 13px
  font-weight 300
.team-players .q-item-sublabel
  color #555
  font-size 13px
  font-weight 300
.secondary-tabs .q-tabs-head
  box-shadow 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12)
.secondary-tabs .q-tabs-scroller
  width 100%
.secondary-tabs .q-tab
  min-height 50px
  font-size 12px
.q-item.q-item-separator
  border-color #eaeaea
.league .secondary-tabs .q-tab
  width 33%
.team .secondary-tabs .q-tab
  width 33%
.no-header-shadow .q-layout-header
  box-shadow none
.header-shadow .layout-header
  box-shadow 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12)
.q-layout-footer
  box-shadow 0 -1px 5px rgba(0,0,0,.2), 0 -2px 2px rgba(0,0,0,.14), 0 -3px 1px -2px rgba(0,0,0,.12)
.league .msg-board
  height calc(100vh - 162px)
.matchup .all-matchups .q-list
  border 0
  border-bottom solid 1px rgba(0,0,0,0.1)
  margin 0
.matchup .all-matchups .q-item
  padding 4px 16px
.settings-popover .q-item
  padding-right 80px
.main-layout .q-toolbar
  padding-right 6px
</style>
