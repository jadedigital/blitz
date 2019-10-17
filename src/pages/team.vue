<template>
  <q-page>
    <blitz-spinner v-if="!dataLoaded">
    </blitz-spinner>
    <div v-if="dataLoaded">
      <div class="row">
        <div class="col-6">
          <q-card-title>
            My Team
          </q-card-title>
        </div>
        <div class="col-6 action-buttons text-right" style="padding: 18px 16px 0 0;">
          <q-btn @click="weekModal = true" flat rounded :label="'Week ' + currentWeek" class="b-text text-dark bg-grey-3" />
          <q-btn @click="transactionModal = true" flat round icon="swap_horiz" class="b-icon text-dark bg-grey-3" >
            <q-chip v-if="transactionCount > 0" class="q-chip-dense" floating small square color="tertiary">{{transactionCount}}</q-chip>
          </q-btn>
          <q-btn v-if="lineupResponse.includes('Error')" @click="errorModal = true" flat round icon="error" class="b-icon text-tertiary bg-grey-3">
            <q-chip class="q-chip-dense" floating small square color="tertiary">{{lineupErrorCount}}</q-chip>
          </q-btn>
        </div>
      </div>
      <div class="contain-main">
        <div class="no-pad no-border">
          <blitz-team :thisTeam="myTeam"/>
        </div>
        <div v-if="draftPicksBool" class="draft-picks no-border no-padding">
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
        </div>
      </div>
    </div>
    <q-modal position="bottom" v-model="errorModal">
      <div style="padding:20px;" class="text-justify light-paragraph" v-html="lineupResponseFormatted"></div>
    </q-modal>
    <q-modal position="bottom" v-model="transactionModal">
      <div class="no-border no-padding">
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
      </div>
    </q-modal>
    <q-modal position="bottom" v-model="weekModal">
      <q-card class="compact-card bg-white">
        <div class="card-main bg-white">
          <q-list separator link class="no-border no-pad">
            <q-card-title>
              Select Week
            </q-card-title>
            <div v-for="week in weekOptions" :key="week.value">
              <q-item link>
                <q-item-main>
                  {{week.label}}
                </q-item-main>
                <q-item-side v-if="week.value === currentWeek" right icon="check_box" color="primary" />
              </q-item>
            </div>
          </q-list>
        </div>
      </q-card>
    </q-modal>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import blitzTeam from '../components/blitzTeam.vue'
import blitzSpinner from '../components/blitzSpinner.vue'

export default {
  name: 'team',
  components: {
    blitzTeam,
    blitzSpinner
  },
  data () {
    return {
      response: null,
      dataLoaded: false,
      newWeek: '',
      search: '',
      errorModal: false,
      weekModal: false,
      transactionModal: false
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
      leagueChange: 'main/leagueChange',
      lineupResponse: 'main/lineupResponse',
      transactionCount: 0
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
    },
    weekOptions () {
      var options = []
      var obj = {}
      var endWeek = Math.max(parseFloat(this.league.lastRegularSeasonWeek), this.currentWeek)
      for (let index = 1; index <= endWeek; index++) {
        obj = {
          label: 'Week ' + index,
          value: index
        }
        options.push(obj)
      }
      return options
    },
    lineupResponseFormatted () {
      let search = '&lt;br/&gt;'
      let replacement = '<br>'
      let response = this.lineupResponse.split(search).join(replacement)
      search = '<error>'
      replacement = '<div>'
      return response.split(search).join(replacement)
    },
    lineupErrorCount () {
      let search = '&lt;br/&gt;'
      let response = this.lineupResponse.split(search)
      let count = response.length - 1
      return count
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
.action-buttons
  padding 2px
.action-buttons .b-icon
  font-size 16px
  height 2em
  width 2em
.action-buttons .b-text
  height 32px
  font-size 12px
  text-transform none
.q-chip-dense
  min-height 1px
  max-height 16px
  padding 0 3px
  font-size 12px
  top -.8em
  right -.3em
  left initial
</style>
