<template>
  <q-layout
    @scroll="scrollHandler"
    ref="childLayout"
    view="hHh lpr fff"
    :class="[headerShadow ? 'header-shadow' : 'no-header-shadow', 'team-layout']"
  >
    <q-layout-header>
      <q-toolbar :style="'background: rgba(61, 90, 254,' + opacity + ')'">
        <q-btn dense flat>
          <q-icon @click.native="goBack" name="arrow_back" />
        </q-btn>

        <q-toolbar-title
          :style="'color: rgba(255, 255, 255,' + opacity + ')'"
        >
          {{thisTeam ? teamLookup[thisTeam].name : ''}}
          <span slot="subtitle">
            {{league.name}}
          </span>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <div ref="teamHeader">
      <q-card class="compact-card bg-primary team-header">
        <div class="card-main bg-primary">
          <div class="row">
            <div class="col-6">
              <div class="row justify-center" :style="{'opacity': 1 - opacity}">
                <img v-if="teamLookup[thisTeam].icon" class="team-img" :src="teamLookup[thisTeam].icon" alt="">
                <q-btn v-else round style="font-size: 28px; font-weight:500; height: 80px; width: 80px;" class="q-btn-outline bg-primary text-white q-item-avatar q-item-section">{{ teamLookup[thisTeam].owner_name ? teamLookup[thisTeam].owner_name[0] : teamLookup[thisTeam].name[0] }}</q-btn>
              </div>
            </div>
            <div class="col-6"></div>
          </div>
          <q-item v-if="thisTeam">
            <div class="q-toolbar-title text-white">{{teamLookup[thisTeam].name}}
              <div class="q-toolbar-subtitle">{{teamLookup[thisTeam].owner_name}}</div>
            </div>
          </q-item>
        </div>
      </q-card>
    </div>
    <q-pull-to-refresh :handler="refresher">
      <div class="contain-main">
        <div style="height: calc(100vh - 50px); background-color: #fff;">
          <blitz-team v-if="dataLoaded && thisTeam" :thisTeam="thisTeam"/>
          <q-spinner
            v-if="!dataLoaded"
            color="secondary"
            size="40px"
            class="absolute-center"
            style="margin-left: -20px;"
          />
        </div>
      </div>
    </q-pull-to-refresh>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import blitzTeam from '../components/blitzTeam.vue'

export default {
  name: 'teams',
  components: {
    blitzTeam
  },
  data () {
    return {
      dataLoaded: false,
      thisTeam: '',
      lastTeam: '',
      opacity: 0,
      headerShadow: false
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'main/activeLeague',
      leagueData: 'main/leagueData',
      rosters: 'main/rosters',
      players: 'main/players',
      league: 'main/league'
    }),
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    goPlayer (id) {
      this.$router.push('/player/' + id)
    },
    scrollHandler (scroll) {
      var height = this.$refs.teamHeader.clientHeight

      if (scroll.position === 0) {
        this.opacity = 0
      } else if (scroll.position > (height - 50)) {
        this.opacity = 1
      } else {
        this.opacity = scroll.position / (height - 50)
      }

      if (scroll.position > height - 2) {
        this.headerShadow = true
      } else {
        this.headerShadow = false
      }
    },
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    setTeam () {
      this.dataLoaded = true
    },
    refresher (done) {
      var requests = [
        'rosters'
      ]

      this.$store.dispatch('main/API_REQUEST', { types: requests })
        .then((response) => {
          done()
        })
        .catch(() => {
          console.log('error')
          done()
        })
    }
  },
  activated () {
    this.opacity = 0
    this.dataLoaded = false
    this.headerShadow = false
    this.thisTeam = this.$route.params.id
    if (this.thisTeam !== this.lastTeam) {
      setTimeout(this.setTeam, 700)
    } else {
      this.setTeam()
    }
    this.lastTeam = this.$route.params.id
  },
  deactivated () {
  }
}
</script>

<style lang="stylus" scoped>
.team-layout .layout-page-container
  padding-top 0!important
.team-layout .team-header
  padding-top 50px
  z-index 1900
  position relative
.team-layout .team-header .q-item-label
  font-size 26px
.team-layout .injury
  display inline
.team-layout .team-player-name
  display inline
  overflow hidden
  -webkit-box-orient vertical
.team-layout .team-header .team-img
  height 80px
  width 80px
  border-radius 50%
  border 2px solid #fff
.team-header .q-toolbar-title
  font-size 24px
  font-weight 700
.team-header .q-toolbar-subtitle
  font-size 18px
  font-weight 500
.no-header-shadow .q-layout-header
  box-shadow none
.header-shadow .layout-header
  box-shadow 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12)
</style>
