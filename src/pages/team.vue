<template>
  <q-page>
    <div v-if="!dataLoaded" style="height: calc(100vh - 112px)">
      <q-btn loading size="lg" style="height: 1.8em; width: 1.8em; margin-left: -20px; box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25); z-index: 1900;" class="animate-spin bg-white text-primary absolute-center" round icon="refresh" />
    </div>
    <q-tabs v-if="dataLoaded && !leagueChange" inverted class="secondary-tabs">
      <q-tab default slot="title" name="tab-1" label="Roster" />
      <q-tab v-if="draftPicksBool" slot="title" name="tab-2" label="Draft Picks" />
      <q-tab slot="title" name="tab-3" label="Pending Moves"/>
      <div class="contain-main">
        <q-tab-pane keep-alive class="no-pad no-border" name="tab-1">
          <blitz-team :thisTeam="myTeam"/>
        </q-tab-pane>
        <q-tab-pane v-if="draftPicksBool" keep-alive name="tab-2" class="draft-picks no-border no-padding">
          <q-card class="compact-card bg-white">
            <div class="card-main bg-white">
              <q-list
                v-for="(year, key) in pickYears"
                :key="key"
                highlight
                class="no-border"
              >
                <q-card-title>
                  {{year}}
                </q-card-title>
                <q-item
                  v-for="(pick, key) in myPicksPerYear[year]"
                  :key="key"
                  class="border-bottom"
                >
                  <q-item-main
                    :label="'Round ' + pick.round"
                    class="text-primary"
                  >
                    <q-item-tile class="owner text-dark">
                      Original owner: <span>{{teamLookup[pick.originalPickFor].name}}</span>
                    </q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>
            </div>
          </q-card>
        </q-tab-pane>
        <q-tab-pane keep-alive class="no-border no-padding" name="tab-3">
          <q-card class="compact-card bg-white">
            <div class="card-main bg-white">
              <q-list class="no-border no-padding no-margin">
                <q-card-title>
                  Pending Waivers
                </q-card-title>
                <div class="no-pending light-paragraph text-center">No pending waiver requests </div>
                <q-card-title>
                  Pending Trades
                </q-card-title>
                <div class="no-pending light-paragraph text-center">No pending trades </div>
              </q-list>
            </div>
          </q-card>
        </q-tab-pane>
      </div>
    </q-tabs>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import blitzTeam from '../components/blitzTeam.vue'

export default {
  name: 'team',
  components: {
    blitzTeam
  },
  data () {
    return {
      response: null,
      dataLoaded: false,
      newWeek: '',
      search: ''
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'main/activeLeague',
      leagueData: 'main/leagueData',
      league: 'main/league',
      rosters: 'main/rosters',
      players: 'main/players',
      currentWeek: 'main/currentWeek',
      futureDraftPicks: 'main/futureDraftPicks',
      api: 'main/api',
      leagueChange: 'main/leagueChange'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    draftPicksBool () {
      var pObj = this.futureDraftPicks
      if (Object.keys(pObj).length === 0 && pObj.constructor === Object) {
        return false
      } else {
        return true
      }
    },
    playerLookup () {
      var array = this.players.player
      return this.lookup(array, 'id')
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    },
    draftPicksLookup () {
      var pObj = this.futureDraftPicks
      if (Object.keys(pObj).length === 0 && pObj.constructor === Object) {
        return ''
      } else {
        var array = this.futureDraftPicks.franchise
        return this.lookup(array, 'id')
      }
    },
    myPicks () {
      var pObj = this.futureDraftPicks
      if (Object.keys(pObj).length === 0 && pObj.constructor === Object) {
        return ''
      } else {
        var myPicks = this.draftPicksLookup[this.myTeam]
        var arr = []
        var obj = {}
        myPicks.futureDraftPick.forEach(el => {
          obj = {
            round: el.round,
            year: el.year,
            originalPickFor: el.originalPickFor
          }
          arr.push(obj)
        })
        arr = this.order(arr, 'year')
        return arr
      }
    },
    pickYears () {
      var pObj = this.futureDraftPicks
      if (Object.keys(pObj).length === 0 && pObj.constructor === Object) {
        return ''
      } else {
        var year = ''
        var arr = []
        this.myPicks.forEach(el => {
          if (year !== el.year) {
            arr.push(el.year)
          }
          year = el.year
        })
        return arr
      }
    },
    myPicksPerYear () {
      var pObj = this.futureDraftPicks
      if (Object.keys(pObj).length === 0 && pObj.constructor === Object) {
        return ''
      } else {
        var mainObj = {}
        var obj = {}
        var arr = []
        this.pickYears.forEach(el => {
          this.myPicks.forEach(el2 => {
            if (el2.year === el) {
              obj = {
                round: el2.round,
                originalPickFor: el2.originalPickFor
              }
              arr.push(obj)
              mainObj[el] = arr
            }
          })
          mainObj[el] = this.order(mainObj[el], 'round')
          arr = []
        })
        return mainObj
      }
    }
  },
  methods: {
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    order (list, key) {
      return list.sort((a, b) => {
        var x = parseInt(a[key]); var y = parseInt(b[key])
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })
    },
    refresher (done) {
      return new Promise((resolve, reject) => {
        var requests = [
          'league',
          'rosters',
          'futureDraftPicks',
          'liveScoring',
          'projectedScores',
          'fullNflSchedule',
          'pointsAllowed',
          'injuries'
        ]
        this.$store.commit('main/CLEAR_TIMESTAMPS', {types: requests})
        this.$store.dispatch('main/API_REQUEST', { types: requests })
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            if (error) {
              reject(error)
            }
          })
      })
    },
    fetchData () {
      var requests = [
        'league',
        'rosters',
        'futureDraftPicks',
        'liveScoring',
        'projectedScores',
        'fullNflSchedule',
        'pointsAllowed',
        'injuries'
      ]

      this.$store.dispatch('main/API_REQUEST', { types: requests })
        .then((response) => {
          this.dataLoaded = true
        })
    }
  },
  watch: {
    activeLeague () {
      console.log('destroy cache here?')
      this.$destroy()
    }
  },
  created () {
    setTimeout(this.fetchData, 500)
  },
  activated () {
    setTimeout(this.fetchData, 500)
  }
}
</script>

<style lang="stylus" scoped>
@import '~variables'
.team .draft-picks .q-item
  font-size 14px
  background-color #fff
.team .draft-picks .q-item-label
  color $primary
.team .draft-picks .owner span
  font-weight 500
.team .draft-picks .q-list
  margin 0
  padding 0
.team .injury
  display inline
.team .team-player-name
  display inline
  overflow hidden
  -webkit-box-orient vertical
.team .no-pending
  padding 24px 0
</style>
