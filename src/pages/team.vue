<template>
  <q-page>
    <q-pull-to-refresh :handler="refresher" class="team">
      <div v-if="!dataLoaded || leagueChange" style="height: calc(100vh - 112px)">
        <q-spinner color="secondary" size="40px" class="absolute-center" style="margin-left: -20px;"/>
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
            <q-list
              v-for="(year, key) in pickYears"
              :key="key"
              highlight
              class="no-border"
            >
              <q-list-header class="text-center bg-grey-2 border-bottom">{{year}}</q-list-header>
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
          </q-tab-pane>
          <q-tab-pane keep-alive class="no-border no-padding" name="tab-3">
            <q-list class="no-border no-padding no-margin">
              <q-list-header class="text-center bg-grey-2 border-bottom">
                Pending Waivers
              </q-list-header>
              <div class="no-pending light-paragraph text-italic text-center">No pending waiver requests </div>
              <q-list-header class="text-center bg-grey-2 border-bottom">
                Pending Trades
              </q-list-header>
              <div class="no-pending light-paragraph text-italic text-center">No pending trades </div>
            </q-list>
          </q-tab-pane>
        </div>
      </q-tabs>
    </q-pull-to-refresh>
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
          done()
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
    },
    reload () {
      this.$store.commit('main/SET_DATA', {type: 'leagueChange', data: false})
      setTimeout(this.fetchData, 500)
    }
  },
  watch: {
    leagueChange (val) {
      if (val === true) {
        this.dataLoaded = false
        this.reload()
      }
    }
  },
  created () {
    this.$store.commit('main/SET_DATA', {type: 'leagueChange', data: false})
    setTimeout(this.fetchData, 500)
  },
  activated () {
    if (this.leagueChange === true) {
      this.dataLoaded = false
      this.$store.commit('main/SET_DATA', {type: 'leagueChange', data: false})
      setTimeout(this.fetchData, 500)
    }
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
.team .q-list-header
  font-size 14px
  font-weight 300
  padding 0
  line-height 2rem
  color #0c0c0c
.team .injury
  display inline
.team .team-player-name
  display inline
  overflow hidden
  -webkit-box-orient vertical
.team .no-pending
  padding 24px 0
</style>
