<template>
  <q-pull-to-refresh :handler="refresher" class="matchup">
    <div v-if="!dataLoaded" style="height: calc(100vh - 112px)">
      <q-spinner color="secondary" size="40px" class="absolute-center" style="margin-left: -20px;"/>
    </div>
    <q-tabs v-if="dataLoaded" inverted class="secondary-tabs">
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" name="tab-1" label="My Matchup" />
      <q-tab slot="title" name="tab-2" label="All Matchups"/>
      <!-- Targets -->
      <div class="contain-main">
        <div
          class="q-if row no-wrap items-center relative-position q-input q-search q-if-has-label text-primary"
          @click="showModal"
        >
          <div class="q-if-inner col row no-wrap items-center relative-position week-select-wrap">
            <span class="text-primary text-weight-regular week-select q-if-label ellipsis full-width absolute self-start">Week {{weekSelect}}<q-btn dense flat icon="mdi-menu-down" /></span>
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
  </q-pull-to-refresh>
</template>

<script>
import { mapGetters } from 'vuex'
import blitzMatchup from '../components/blitzMatchup.vue'

export default {
  name: 'matchup',
  components: {
    blitzMatchup
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
      weekModal: false
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
      var endWeek = this.currentWeek
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
    modalLogic (name, index) {
      var players = []

      this.positions[index].forEach((pos) => {
        this.startersSorted.forEach((el) => {
          if (pos === this.playerLookup[el.id].position && name !== this.playerLookup[el.id].name) {
            players.push(el)
          }
        })
      })
      this.swapPlayer = name.split(', ').reverse().join(' ')
      this.modalPlayers = players
      this.swapModal = true
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
        'leagueStandings'
      ]

      this.$store.dispatch('main/API_REQUEST', { types: requests })
        .then((response) => {
          this.setTeams()
        })
    },
    refresher (done) {
      var requests = [
        'rosters',
        'liveScoring',
        'matchupLiveScoring',
        'leagueStandings'
      ]
      this.$store.commit('main/CLEAR_TIMESTAMPS', {types: requests})
      this.$store.dispatch('main/API_REQUEST', { types: requests })
        .then((response) => {
          done()
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
</style>
