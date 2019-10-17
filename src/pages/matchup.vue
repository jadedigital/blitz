<template>
  <div class="matchup">
    <blitz-spinner v-if="!dataLoaded">
    </blitz-spinner>
    <q-tabs v-model="selectedTab" v-if="dataLoaded" inverted class="no-border">
      <!-- Tabs - notice slot="title" -->
      <div class="tabs-hide">
        <q-tab default slot="title" name="tab-1" label="My Matchup" />
        <q-tab slot="title" name="tab-2" label="All Matchups"/>
      </div>
      <!-- Targets -->
      <div class="contain-main">
        <div class="row action-row">
          <div class="col-4">
            <q-card-title>
              Matchup
            </q-card-title>
          </div>
          <div class="action-buttons justify-end col-8 q-option cursor-pointer no-outline row inline no-wrap q-toggle q-focusable q-touch">
            <div @click="togglePane" :class="toggle ? 'shifted' : ''" class="q-option-inner relative-position text-primary active b-toggle">
              <input type="checkbox">
              <div class="q-focus-helper">
              </div>
              <div class="q-toggle-base b-base bg-grey-3">
                <div class="text-inner-left absolute text-dark">My</div>
                <div class="text-inner-right absolute text-dark">All</div>
              </div>
              <div class="q-toggle-handle row flex-center b-handle">
                <div class="q-radial-ripple"></div>
                <div class="text-inner text-white">{{toggle ? 'All Matchups' : 'My Matchup'}}</div>
              </div>
            </div>
            <q-btn @click="weekModal = true" flat rounded :label="'Week ' + currentWeek" class="b-text text-dark bg-grey-3" />
          </div>
        </div>
        <q-tab-pane keep-alive class="no-pad no-border" name="tab-1">
          <div v-if="byeWeek" style="height: calc(100vh - 112px)">
            <div class="absolute-center text-center light-paragraph">
              No matchup this week
            </div>
          </div>
          <blitz-matchup v-if="!byeWeek" :teamA="teamA" :teamB="teamB"/>
        </q-tab-pane>
        <q-tab-pane keep-alive class="no-pad no-border all-matchups" name="tab-2">
          <div>
            <div v-if="displayScoring.matchup">
              <q-list
                v-for="(match, key) in displayScoring.matchup"
                :key="key"
                @click.native="goToMatchup(match.franchise)"
              >
                <div>
                  <q-item
                    v-for="(team, key2) in match.franchise"
                    :key="key2"
                  >
                    <q-item-side v-if="teamLookup[team.id].icon" :avatar="teamLookup[team.id].icon"/>
                    <q-btn v-else round small style="font-size: 14px; font-weight:400; height: 38px; width: 38px;" class="q-btn-outline bg-white text-primary q-item-avatar q-item-section">{{ teamLookup[team.id].owner_name ? teamLookup[team.id].owner_name[0] : teamLookup[team.id].name[0] }}</q-btn>
                    <q-item-main
                      v-ripple
                      :label="teamLookup[team.id].name"
                      :sublabel="standingsLookup[team.id].h2hw + '-' + standingsLookup[team.id].h2hl + '-' + standingsLookup[team.id].h2ht"
                    />
                    <q-item-side right>
                      <q-item-tile :class="winners[team.id] === true ? 'strong text-dark' : 'text-dark'">
                        {{team.score}}
                      </q-item-tile>
                    </q-item-side>
                  </q-item>
                </div>
              </q-list>
            </div>
            <div v-if="displayScoring.franchise" class="separator-title text-center border-bottom uppercase">Bye Week</div>
            <div v-if="displayScoring.franchise">
              <q-list class="bye">
                <q-item
                  link
                  v-for="(match, key) in displayScoring.franchise"
                  :key="key"
                  class="border-bottom"
                  @click.native="goToTeam(match.id)"
                >
                  <q-item-side v-if="teamLookup[match.id].icon" :avatar="teamLookup[match.id].icon"/>
                  <q-btn v-else round small style="font-size: 14px; font-weight:400; height: 38px; width: 38px;" class="q-btn-outline bg-white text-primary q-item-avatar q-item-section">{{ teamLookup[match.id].owner_name ? teamLookup[match.id].owner_name[0] : teamLookup[match.id].name[0] }}</q-btn>
                  <q-item-main :label="teamLookup[match.id].name" />
                  <q-item-side right>
                    <q-item-tile class="text-dark">
                      {{match.score}}
                    </q-item-tile>
                  </q-item-side>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-tab-pane>
      </div>
    </q-tabs>
    <q-modal position="bottom" v-model="weekModal">
      <q-card class="compact-card bg-white">
        <div class="card-main bg-white">
          <q-list separator link class="no-border no-pad">
            <q-card-title>
              Select Week
            </q-card-title>
            <div v-for="week in weekOptions" :key="week.value">
              <q-item @click.native="changeWeek(week.value)" link>
                <q-item-main>
                  {{week.label}}
                </q-item-main>
                <q-item-side v-if="week.value === weekSelect" right icon="check_box" color="primary" />
              </q-item>
            </div>
          </q-list>
        </div>
      </q-card>
    </q-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import blitzMatchup from '../components/blitzMatchup.vue'
import blitzSpinner from '../components/blitzSpinner.vue'

export default {
  name: 'matchup',
  components: {
    blitzMatchup,
    blitzSpinner
  },
  data () {
    return {
      response: null,
      dataLoaded: false,
      newWeek: '',
      modalPlayer: '',
      search: '',
      weekSelect: '',
      byeWeek: false,
      teamA: '',
      teamB: '',
      weekModal: false,
      toggle: false,
      selectedTab: 'tab-1'
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'main/activeLeague',
      leagueData: 'main/leagueData',
      league: 'main/league',
      liveScoring: 'main/liveScoring',
      matchupLiveScoring: 'main/matchupLiveScoring',
      currentWeek: 'main/currentWeek',
      leagueStandings: 'main/leagueStandings'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    },
    standingsLookup () {
      var array = this.leagueStandings.franchise
      return this.lookup(array, 'id')
    },
    displayScoring () {
      if (this.matchupLiveScoring) {
        return this.matchupLiveScoring
      } else {
        return this.liveScoring
      }
    },
    winners () {
      var obj = {}
      if (this.displayScoring.matchup) {
        this.displayScoring.matchup.forEach(el => {
          parseFloat(el.franchise[0].score) > parseFloat(el.franchise[1].score) ? obj[el.franchise[0].id] = true : obj[el.franchise[0].id] = false
          parseFloat(el.franchise[0].score) < parseFloat(el.franchise[1].score) ? obj[el.franchise[1].id] = true : obj[el.franchise[1].id] = false
        })
      }
      return obj
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
    }
  },
  methods: {
    togglePane () {
      this.toggle = !this.toggle
      if (this.selectedTab === 'tab-1') {
        this.selectedTab = 'tab-2'
      } else {
        this.selectedTab = 'tab-1'
      }
    },
    setTeams () {
      var myTeam = this.leagueData[this.activeLeague].teamId
      var array = []
      var opponent = ''
      if (this.displayScoring.matchup) {
        this.displayScoring.matchup.forEach((el) => {
          el.franchise.forEach((el2) => {
            if (el2.id === myTeam) {
              array.push(el)
            }
          })
        })
        array.forEach(el => {
          el.franchise.forEach((el2) => {
            if (el2.id !== myTeam) {
              opponent = el2.id
            }
          })
        })
      }
      this.teamA = myTeam
      this.teamB = opponent
      if (!opponent) {
        this.byeWeek = true
      } else {
        this.byeWeek = false
      }
      this.dataLoaded = true
    },
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    weekDialog () {
      this.$q.dialog({
        title: 'Select Week',
        options: {
          type: 'radio',
          model: this.weekSelect,
          items: this.weekOptions
        },
        cancel: true
      }).then(data => {
        this.changeWeek(data)
      }).catch(() => {
        console.log('canceled...')
      })
    },
    showModal () {
      this.weekModal = true
    },
    changeWeek (week) {
      this.weekModal = false
      this.weekSelect = week
      this.dataLoaded = false
      console.log(week)

      var requests = [
        'matchupLiveScoring'
      ]

      this.$store.dispatch('main/API_REQUEST', { types: requests, week: week })
        .then((response) => {
          this.setTeams()
        })
    },
    goToTeam (team) {
      this.$router.push('/team/' + team)
    },
    goToMatchup (match) {
      this.$router.push('/matchup/' + match[0].id + '/' + match[1].id)
    },
    fetchdata () {
      var requests = [
        'rosters',
        'liveScoring',
        'matchupLiveScoring',
        'leagueStandings',
        'fullNflSchedule'
      ]
      this.$store.dispatch('main/API_REQUEST', { types: requests })
        .then((response) => {
          this.setTeams()
        })
    },
    refresher (done) {
      return new Promise((resolve, reject) => {
        var requests = [
          'rosters',
          'liveScoring',
          'matchupLiveScoring',
          'leagueStandings',
          'fullNflSchedule'
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
    }
  },
  watch: {
    activeLeague () {
      console.log('destroy cache here?')
      this.$destroy()
    }
  },
  created () {
    this.weekSelect = parseInt(this.displayScoring.week)
    setTimeout(this.fetchdata, 500)
  },
  activated () {
    setTimeout(this.setTeams, 500)
  }
}
</script>

<style lang="stylus" scoped>
@import '~variables'
.matchup-header
  height 100px
.matchup-header .team-name
  font-size 11px
  font-weight 700
  padding-bottom 4px
.matchup-header .q-item-avatar
  margin-left 10px
  margin-right 10px
.matchup-header .total-score
  font-weight 400
  font-size 24px
.matchup-header .total-score.strong
  font-weight 700
.matchup-header .total-projection
  font-size 12px
.separator-title
  padding 4px 0
  font-size 12px
  font-weight 300
.matchup-list
  font-size 12px
.matchup-list .list-item
  height 48px
  padding 6px 4px
.matchup-list .team-name
  font-size 14px
  font-weight 500
  padding-bottom 2px
.team-name-container
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
.matchup-list .team
  display inline
  font-weight 300
  font-size 12px
.matchup-list .team-score
  font-size 14px
  font-weight 500
  padding-bottom 2px
.matchup-list .team-projection
  font-size 12px
  font-weight 300
.matchup-list .team-matchup
  font-size 12px
  font-weight 300
  white-space nowrap
.matchup-list .team-matchup span
  font-weight 500
.position-list .positions
  height 48px
  text-align center
  font-size 9px
  font-weight 500
.matchup .col-5
  max-width 45%
  flex 0 0 45%
.matchup .col-2
  max-width 10%
  flex 0 0 10%
.matchup .q-tabs-panes
  background #fff
.matchup .q-select
  font-size 14px
  font-weight 500
  text-transform uppercase
  margin-bottom 0
.matchup .q-select .q-input-target
  padding-left 24px
.matchup .all-matchups .q-list
  padding 0
.matchup .all-matchups .q-list
  padding 0
.matchup .week-select
  text-align center
.week-select-wrap
  margin-bottom 10px
.q-toggle-base.b-base
  height 32px
  width 130px
  opacity 1
.q-toggle-handle.b-handle
  font-size 12px
  height 32px
  width 96px
  border-radius 30px
  box-shadow none
  font-weight 500
.b-toggle
  padding 0 0 0 0
  width 130px
.text-inner-left
  font-size 12px
  left 12px
  top 16px
  font-weight 500
.text-inner-right
  font-size 12px
  right 12px
  top 16px
  font-weight 500
.active .q-toggle-handle.b-handle
  left 0
.shifted .q-toggle-handle.b-handle
  left 34px
.action-buttons
  padding 18px 16px 0 0
.action-buttons .b-text
  font-size 12px
.action-buttons .q-btn
  margin-left 4px
  height 32px
  text-transform none
.tabs-hide
  display none
.action-row
  margin-bottom 12px
</style>
