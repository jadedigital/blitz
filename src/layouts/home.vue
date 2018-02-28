<template>
  <q-layout
    @scroll="scrollHandler"
    ref="layout"
    view="lHh Lpr lFf"
    :class="[(headerShadow || $route.name === 'chat' || $route.name === 'players') ? 'header-shadow' : 'no-header-shadow', 'main-layout']"
  >
    <q-layout-header :reveal="settings.toolbarHide">
      <q-toolbar class="toolbar border-bottom" color="primary">
        <q-btn
          flat
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          {{this.teamLookup[myTeam].name}}
          <span slot="subtitle">
            {{this.league.name}}
          </span>
        </q-toolbar-title>
        <q-btn flat @click="toggleModal">
          <q-icon name="search" />
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
    >
      <div class="panel-bg" :style="logoUrl">
        <div class="bg-gradient-opacity">
          <div class="team-heading">
            {{this.teamLookup[myTeam].name}}
            <span>
              {{this.league.name}}
            </span>
          </div>
        </div>
      </div>
      <q-list no-border link>
        <q-item to="/user/team">
          <q-item-side icon="mdi-football-helmet" />
          <q-item-main label="My Team" />
        </q-item>
        <q-item to="/user/league">
          <q-item-side icon="mdi-trophy-variant" />
          <q-item-main label="League" />
        </q-item>
        <q-item to="/user/matchup">
          <q-item-side icon="mdi-shield-half-full" />
          <q-item-main label="Matchup" />
        </q-item>
        <q-item to="/user/players">
          <q-item-side icon="mdi-account-multiple" />
          <q-item-main label="Players" />
        </q-item>
        <q-item to="/user/chat">
          <q-item-side icon="mdi-forum" />
          <q-item-main label="Chat" />
        </q-item>
        <q-item to="/user/draft">
          <q-item-side icon="view_comfy" />
          <q-item-main label="Draft" />
        </q-item>
        <q-item to="/user/polls">
          <q-item-side icon="mdi-poll" />
          <q-item-main label="Polls" />
        </q-item>
        <q-item-separator/>
        <q-item to="/settings">
          <q-item-side icon="settings" />
          <q-item-main label="Settings"/>
        </q-item>
        <div @click="logout">
          <q-item>
            <q-item-side icon="undo" />
            <q-item-main label="Logout"/>
          </q-item>
        </div>
      </q-list>
    </q-layout-drawer>

    <q-modal class="search-modal" @open="$refs.search.focus()" v-model="modal">
      <q-search color="primary" v-model="playerSearch" placeholder="Search" stack-label="Search All Players" ref="search">
      </q-search>
      <div v-if="!playerSearch" class="row flex-center"><i class="info">Start typing to search</i></div>
      <div v-if="playerSearch" v-for="player in playerSearchLookup" :key="player.id" class="row flex-center">{{player.name}} ({{player.team}}) - {{player.id}}</div>
      <q-btn outline color="primary" @click="toggleModal">Cancel</q-btn>
    </q-modal>

    <q-page-container>
      <transition :name="transitionName">
        <keep-alive>
          <router-view class="child-view"></router-view>
        </keep-alive>
      </transition>
    </q-page-container>

    <q-layout-footer>
      <q-tabs inverted class="bg-white main-nav desktop-hide">
        <q-route-tab v-if="settings.navbar.includes('team')" to="team" exact slot="title" icon="mdi-football-helmet" label="My Team" />
        <q-route-tab v-if="settings.navbar.includes('league')" to="league" exact slot="title" icon="mdi-trophy-variant" label="League" />
        <q-route-tab v-if="settings.navbar.includes('matchup')" to="matchup" exact slot="title" icon="mdi-shield-half-full" label="Matchup"/>
        <q-route-tab v-if="settings.navbar.includes('players')" to="players" exact slot="title" icon="mdi-account-multiple" label="Players"/>
        <q-route-tab v-if="settings.navbar.includes('chat')" to="chat" exact slot="title" icon="mdi-forum" label="Chat"/>
        <q-route-tab v-if="settings.navbar.includes('draft')" to="draft" exact slot="title" icon="view_comfy" label="Draft"/>
        <q-route-tab v-if="settings.navbar.includes('polls')" to="polls" exact slot="title" icon="mdi-poll" label="Polls"/>
      </q-tabs>
    </q-layout-footer>

    <q-page-sticky v-if="leagueTab === 'messages' && $route.name === 'league'" position="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        icon="edit"
        class="bg-tertiary shadow-5 text-white"
        @click="$router.push('/newmessage')"
      />
    </q-page-sticky>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'user',
  data () {
    return {
      leftDrawerOpen: false,
      modal: false,
      playerSearch: '',
      routeOrder: {
        team: 1,
        league: 2,
        draft: 3,
        matchup: 3,
        players: 4,
        chat: 5
      },
      transitionName: '',
      headerShadow: false,
      overlay: false
    }
  },
  beforeRouteUpdate (to, from, next) {
    const toRoute = this.routeOrder[to.path.split('/')[2]]
    const fromRoute = this.routeOrder[from.path.split('/')[2]]
    this.transitionName = toRoute < fromRoute ? 'slide-right' : 'slide-left'
    next()
  },
  computed: {
    ...mapGetters({
      activeLeague: 'main/activeLeague',
      leagueData: 'main/leagueData',
      league: 'main/league',
      players: 'main/players',
      leagueTab: 'main/leagueTab',
      settings: 'main/settings'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    },
    playerLookup () {
      var array = this.players.player
      return this.lookup(array, 'id')
    },
    playerSearchLookup () {
      var list = this.players.player
      var positions = []
      this.league.starters.position.slice(0).forEach(el => {
        positions.push(el.name)
      })
      list = this.positionFilter(list, positions)
      if (this.playerSearch) {
        list = this.findBy(list, this.playerSearch, 'name')
      }
      list = list.slice(0, 10)
      return list
    },
    logoUrl () {
      var style = {
        background: 'url(' + this.league.leagueLogo + ') center no-repeat',
        backgroundSize: 'cover'
      }
      return style
    }
  },
  methods: {
    toggleModal () {
      this.$refs.search.clear()
      this.modal = !this.modal
    },
    scrollHandler (scroll) {
      if (scroll.position > 48) {
        this.headerShadow = true
      } else {
        this.headerShadow = false
      }
    },
    lookup (array, id) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][id]] = array[i]
      }
      return lookup
    },
    findBy (list, value, key) {
      return list.filter(function (el) {
        return value.toLowerCase().split(' ').every(x => String(el[key]).toLowerCase().includes(x))
      })
    },
    positionFilter (list, positions) {
      return list.filter(function (el) {
        return positions.some(x => el['position'] === x)
      })
    },
    logout () {
      this.$q.dialog({
        title: 'Logout',
        message: 'Are you sure?',
        ok: 'Logout',
        cancel: 'Cancel'
      })
        .then(() => {
          this.$q.localStorage.clear()
          this.$store.commit('main/LOGOUT')
          this.$router.push('/login')
        })
        .catch(() => {
          console.log('canceled...')
        })
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'
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
.compact-card .q-card-title
  text-align center
  font-size 14px
  font-weight 300
.compact-card .q-card-primary
  padding 0
  background-color #f7f7f7
.q-card.compact-card
  box-shadow none
  margin 0
.q-tab
  font-size 10px
  padding 0
  min-height 62px
.q-tab.icon-and-label
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
.search-modal .info
  font-size 120%
  font-weight 300
  margin 20px
.search-modal .q-btn
  margin 20px
  width 90%
.search-modal.fullscreen
  top 50px
.main-avatar .q-item-avatar
  height 46px
  width 46px
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
.child-view {
  width: 100%;
  position: absolute;
  transition: all .3s;
}
.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  transform: translate(200px, 0);
}
.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  transform: translate(-200px, 0);
}
.layout-aside-right
  width 100%
.player-header .layout-header
  box-shadow none
.player-info-list
  list-style none
  padding-left 0
  font-weight 500
.player-info-list span
  font-weight 300
.player-info .player-img
  border-radius 50%
  border 2px solid
  background #fff
.player-actions
  margin-top -28px
  margin-right 50px
  position fixed
  right 0
.player-name-main
  padding 12px
  font-size 24px
  font-weight 700
.player-name-main .q-toolbar-subtitle
  font-size 18px
  font-weight 500
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
.secondary-tabs .q-chip
  min-height 16px
  font-size 10px
  padding-left 8px
  padding-right 8px
  background #ff1744
.league .secondary-tabs .q-tab
  width 33%
.team .secondary-tabs .q-tab
  width 33%
.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .2s ease;
}
.slide-fade-enter, .slide-fade-leave-to
{
  transform: translateX(100%);
}
.no-header-shadow .layout-header
  box-shadow none
.header-shadow .layout-header
  box-shadow 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12)
.layout-footer
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
