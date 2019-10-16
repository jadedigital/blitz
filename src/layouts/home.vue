<template>
  <q-layout
    @scroll="scrollHandler"
    ref="layout"
    view="lHh Lpr lFf"
    class="no-header-shadow main-layout"
  >
    <q-layout-header :reveal="settings.toolbarHide">
      <q-toolbar class="toolbar border-bottom" color="primary">
        <q-btn
          flat
          dense
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
        <q-btn
          flat
          dense
          @click="toggleModal"
        >
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
            <span class="sub-heading">
              {{this.league.name}}
            </span>
          </div>
        </div>
      </div>
      <q-list separator>
        <q-collapsible icon="mdi-football-helmet" v-model="leagueCollapse" :label="this.teamLookup[myTeam].name" :sublabel="this.league.name">
          <div
            v-for="(team, index) in leagueData"
            :key="index"
          >
            <q-item
              v-if="index !== activeLeague"
              link
              style="padding:0"
              @click.native="changeLeague(index)"
            >
              <q-item-side icon="mdi-football-helmet"/>
              <q-item-main
                class="ellipses"
                :label="team.teamName"
                :sublabel="team.leagueName"
                :sublabel-lines="1"
                />
            </q-item>
          </div>
        </q-collapsible>
      </q-list>
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
        <q-item @click.native="goSettings">
          <q-item-side icon="settings" />
          <q-item-main label="Settings"/>
        </q-item>
        <q-item @click.native="logout">
          <q-item-side icon="undo" />
          <q-item-main label="Logout"/>
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-modal @show="$refs.search.focus()" v-model="modal" class="no-header-shadow">
      <q-modal-layout content-class="row">
        <q-toolbar slot="header" class="bg-white text-dark">
          <q-btn dense flat>
            <q-icon @click.native="toggleModal" name="arrow_back" />
          </q-btn>
          <q-toolbar-title>
            Search
          </q-toolbar-title>
        </q-toolbar>
        <div class="search-modal col">
          <q-search color="primary" v-model="playerSearch" placeholder="Search" stack-label="Search All Players" ref="search">
          </q-search>
          <div v-if="!playerSearch" class="row flex-center"><i class="info">Start typing to search</i></div>
          <div v-if="playerSearch.length < 3 && playerSearch.length > 0" class="row flex-center"><i class="info">Enter at least 3 letters to search</i></div>
          <div v-if="playerSearch.length > 2">
            <q-list class="no-border">
              <q-list-header>Players</q-list-header>
              <q-item
                link
                v-for="player in playerSearchLookup"
                :key="player.id"
                class="row flex-center"
                @click.native="goToPlayer(player.id)"
              >
                <q-item-side class="player-avatar" :avatar="player.position === 'Def' ? './statics/' + teamMap[player.team] + '.svg' : player.cbs_id ? 'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + player.cbs_id + '.jpg' : './statics/avatar.jpg'" />
                <q-item-main :label="player.name" :sublabel="player.team + ' - ' + player.position"/>
                <q-item-side right>
                  <q-item-tile icon="info" />
                </q-item-side>
              </q-item>
            </q-list>

          </div>
          <q-btn outline rounded color="primary" @click="toggleModal">Cancel</q-btn>
        </div>
      </q-modal-layout>
    </q-modal>

    <div v-touch-pan.mightPrevent="panHandler">
      <q-btn
        size="lg"
        style="height: 1.8em; width: 1.8em; top:14px; left:0; right:0; margin-left: auto; margin-right: auto; box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25); z-index: 1900;"
        class="bg-white text-primary absolute"
        :class="pullLoading ? 'b-spinner' : ''"
        :style="'transform: translate(0, '+ pullMargin + 'px) rotate(' + pullRotation + 'deg) scale(' + pullScale +');'"
        round
        :icon="!pullLoading ? 'refresh' : ''"
      />
      <q-page-container>
        <transition :name="transitionName">
          <keep-alive>
            <router-view :key="$route.name + activeLeague + keyCounter" ref="childHome" class="child-view"></router-view>
          </keep-alive>
        </transition>
      </q-page-container>
    </div>

    <q-layout-footer>
      <q-tabs inverted class="bg-white main-nav">
        <q-route-tab v-if="settings.navbar.includes('team')" to="team" exact slot="title" icon="mdi-football-helmet" label="My Team" />
        <q-route-tab v-if="settings.navbar.includes('league')" to="league" exact slot="title" icon="mdi-trophy-variant" label="League" />
        <q-route-tab v-if="settings.navbar.includes('matchup')" to="matchup" exact slot="title" icon="mdi-shield-half-full" label="Matchup"/>
        <q-route-tab v-if="settings.navbar.includes('players')" to="players" exact slot="title" icon="mdi-account-multiple" label="Players"/>
        <q-route-tab v-if="settings.navbar.includes('chat')" to="chat" exact slot="title" icon="mdi-forum" label="Chat"/>
        <q-route-tab v-if="settings.navbar.includes('draft')" to="draft" exact slot="title" icon="view_comfy" label="Draft"/>
        <q-route-tab v-if="settings.navbar.includes('polls')" to="polls" exact slot="title" icon="mdi-poll" label="Polls"/>
      </q-tabs>
    </q-layout-footer>

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
      leagueCollapse: false,
      playerSearch: '',
      keyCounter: 1,
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
      overlay: false,
      scrollSpot: 0,
      pullMargin: 0,
      pullOpacity: 1,
      pullLoading: false,
      panDelta: 0,
      pullRotation: 0,
      pullScale: 1
    }
  },
  beforeRouteUpdate (to, from, next) {
    const toRoute = this.routeOrder[to.path.split('/')[2]]
    const fromRoute = this.routeOrder[from.path.split('/')[2]]
    this.transitionName = toRoute < fromRoute ? 'slide-right' : 'slide-left'
    next()
  },
  beforeRouteLeave (to, from, next) {
    this.transitionName = ''
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
      this.scrollSpot = scroll.position
      if (scroll.position > 48) {
        this.headerShadow = true
      } else {
        this.headerShadow = false
      }
    },
    panHandler (pan) {
      if (this.scrollSpot === 0) {
        var max = 120
        var triggerDistance = 80
        var marginInitial = 0
        this.panDelta = Math.min(this.panDelta + pan.delta.y, max)
        var scrollDistance = this.panDelta
        if (scrollDistance > 0) {
          pan.evt.preventDefault()
        }
        var marginAdd = Math.min(scrollDistance, max)
        this.pullMargin = marginInitial + marginAdd
        this.pullRotation = (this.pullMargin / max) * 360
        if (pan.isFinal) {
          if (scrollDistance > triggerDistance) {
            this.pullMargin = 70
            this.pullLoading = true
            this.$refs.childHome.refresher()
              .then((response) => {
                console.log(response)
                this.pullScale = 0
                setTimeout(() => {
                  this.pullLoading = false
                  this.pullMargin = marginInitial
                  this.panDelta = 0
                  this.pullRotation = 0
                }, 600)
                setTimeout(() => {
                  this.pullScale = 1
                }, 900)
              })
              .catch((error) => {
                if (error) {
                  console.log(error)
                }
              })
          } else {
            this.pullMargin = marginInitial
            this.panDelta = 0
            this.pullRotation = 0
          }
        }
      } else {
        this.pullMargin = 0
        this.panDelta = 0
        this.pullRotation = 0
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
    goToPlayer (id) {
      this.toggleModal()
      this.$router.push('/player/' + id)
    },
    changeLeague (id) {
      var requests = [
        'rosters',
        'leagueStandings',
        'freeAgents',
        'league',
        'projectedScores',
        'liveScoring',
        'matchupLiveScoring',
        'pointsAllowed',
        'futureDraftPicks',
        'transactions',
        'messageBoard',
        'playerScores',
        'playerStatus',
        'messageBoardThread'
      ]
      this.leftDrawerOpen = false
      this.leagueCollapse = false
      this.$store.commit('main/SET_DATA', {type: 'activeLeague', data: id})
      this.$store.commit('main/SET_DATA', {type: 'chat', data: ''})
      this.$store.commit('main/CLEAR_TIMESTAMPS', {types: requests})
      this.keyCounter += 1
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
    },
    goSettings () {
      this.leftDrawerOpen = false
      setTimeout(() => {
        this.$router.push('/settings')
      }, 150)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~variables'
.team-heading .sub-heading
  display block
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
.search-modal .info
  font-size 120%
  font-weight 300
  margin 20px
.search-modal .q-btn
  margin 20px
  width 90%
.search-modal .q-if
  margin 16px 0
.search-modal .q-if
  margin 16px 10px
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
