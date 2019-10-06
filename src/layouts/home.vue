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

    <q-modal class="search-modal" @show="$refs.search.focus()" v-model="modal">
      <q-search color="primary" v-model="playerSearch" placeholder="Search" stack-label="Search All Players" ref="search">
      </q-search>
      <div v-if="!playerSearch" class="row flex-center"><i class="info">Start typing to search</i></div>
      <div v-if="playerSearch" v-for="player in playerSearchLookup" :key="player.id" class="row flex-center">{{player.name}} ({{player.team}}) - {{player.sportsdata_id}}</div>
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
