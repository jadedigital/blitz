<template>
  <div>
    <div class="row items-center border-bottom matchup-header">
      <div
        class="col-5 team"
        @click="goToTeam(teamA)"
        :class="{'bg-grey-4': selectedTeam === teamA}"
      >
        <div class="row items-center">
          <div class="col-12">
            <div class="team-name float-right">
              {{teamLookup[teamA].name}}
            </div>
          </div>
        </div>
        <div class="row items-center">
          <div class="col-6">
            <img :src="teamLookup[teamA].icon ? teamLookup[teamA].icon : './statics/avatar.jpg'" class="q-item-avatar"/>
          </div>
          <div class="col-6">
            <div class="row">
              <div :class="[parseFloat(allScoring[teamA].score) > parseFloat(allScoring[teamB].score)? 'strong' : '', 'text-right total-score col-12']">{{allScoring[teamA].score}}</div>
              <div class="total-projection text-right col-12">{{totalProjected[teamA]}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-2 matchup">
      </div>
      <div
        class="col-5 team"
        @click="goToTeam(teamB)"
        :class="{'bg-grey-4': selectedTeam === teamB}"
      >
        <div class="row items-center">
          <div class="col-12">
            <div class="team-name">
              {{teamLookup[teamB].name}}
            </div>
          </div>
        </div>
        <div class="row items-center">
          <div class="col-6">
            <div class="row">
              <div :class="[parseFloat(allScoring[teamA].score) < parseFloat(allScoring[teamB].score)? 'strong' : '', 'total-score text-left col-12']">{{allScoring[teamB].score}}</div>
              <div class="total-projection text-left col-12">{{totalProjected[teamB]}}</div>
            </div>
          </div>
          <div class="col-6">
            <img :src="teamLookup[teamB].icon ? teamLookup[teamB].icon : './statics/avatar.jpg'" class="q-item-avatar float-right"/>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <q-card-title>
          Starters
        </q-card-title>
      </div>
    </div>
    <div v-for="(player, index) in combinedStarters" :key="index">
      <div class="row">
        <div
          class="col-5 matchup"
          @click="goToPlayer(player.id)"
          :class="{'bg-grey-4': selectedPlayer === player.id}"
        >
          <div class="matchup-list">
            <div class="list-item border-bottom" :class="player.id ? scoringLookupTeamA[player.id].gameSecondsRemaining < 3600 && scoringLookupTeamA[player.id].gameSecondsRemaining > 0 ? 'bg-cyan-1' : '' : ''">
              <div class="row">
                <div class="col-9 team-name-container">
                  <div class="row">
                    <div class="team-name text-left col-12" >{{player.id ? playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0) + '. ' + playerLookup[player.id].name.split(', ').slice(0, -1).join(' ') : 'Empty'}} <div class="team">{{player.id ? playerLookup[player.id].team : ''}}</div></div>
                    <blitz-versus v-if="player.id" class="team-matchup text-left col-12" :player="player.id"></blitz-versus>
                  </div>
                </div>
                <div v-if="player.id" class="col-3">
                  <div v-if="matchupLookup[playerLookup[player.id].team]" class="row">
                    <div class="team-score text-right col-12" >{{scoringLookupTeamA[player.id].gameSecondsRemaining === '3600' ? '-' : scoringLookupTeamA[player.id].score}}</div>
                    <div :class="updatedProjection[player.id].projection > updatedProjection[player.id].original ? 'text-green-14' : updatedProjection[player.id].projection < updatedProjection[player.id].original ? 'text-red-13' : ''" class="team-projection text-right col-12">{{ updatedProjection[player.id].projection }}</div>
                  </div>
                  <div v-if="!matchupLookup[playerLookup[player.id].team]" class="row">
                    <div class="team-score text-right col-12" >-</div>
                    <div class="team-projection text-right col-12">-</div>
                  </div>
                </div>
                <div v-else class="col-3">
                  <div class="row">
                    <div class="team-score text-right col-12" ></div>
                    <div class="team-projection text-right col-12"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-2 matchup">
          <div class="position-list bg-grey-2 text-grey-8">
            <div class="row items-center positions border-bottom">
              <div class="col-12 text-primary">
                {{player.position}}
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-5 matchup"
          @click="goToPlayer(player.opp)"
          :class="{'bg-grey-4': selectedPlayer === player.opp}"
        >
          <div class="matchup-list">
            <div class="list-item border-bottom" :class="player.opp ? scoringLookupTeamB[player.opp].gameSecondsRemaining < 3600 && scoringLookupTeamA[player.id].gameSecondsRemaining > 0 ? 'bg-cyan-1' : '' : ''">
              <div class="row">
                <div v-if="player.opp" class="col-3">
                  <div v-if="matchupLookup[playerLookup[player.opp].team]" class="row">
                    <div class="team-score text-left col-12" >{{scoringLookupTeamB[player.opp].gameSecondsRemaining === '3600' ? '-' : scoringLookupTeamB[player.opp].score}}</div>
                    <div :class="updatedProjection[player.opp].projection > updatedProjection[player.opp].original ? 'text-green-14' : updatedProjection[player.opp].projection < updatedProjection[player.opp].original ? 'text-red-13' : ''" class="team-projection text-left col-12" >{{ updatedProjection[player.opp].projection }}</div>
                  </div>
                  <div v-if="!matchupLookup[playerLookup[player.opp].team]" class="row">
                    <div class="team-score text-left col-12" >-</div>
                    <div class="team-projection text-left col-12" >-</div>
                  </div>
                </div>
                <div v-else class="col-3">
                  <div class="row">
                    <div class="team-score text-left col-12" ></div>
                    <div class="team-projection text-left col-12" ></div>
                  </div>
                </div>
                <div class="col-9 team-name-container">
                  <div class="row">
                    <div class="team-name text-right col-12" >{{player.opp ? playerLookup[player.opp].name.split(', ').slice(1).join(' ').charAt(0) + '. ' + playerLookup[player.opp].name.split(', ').slice(0, -1).join(' ') : 'Empty'}}<div class="team"> {{player.opp ? playerLookup[player.opp].team : ''}}</div></div>
                    <blitz-versus v-if="player.opp" class="team-matchup text-right col-12" :player="player.opp"></blitz-versus>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <q-card-title>
          Bench
        </q-card-title>
      </div>
    </div>
    <div v-for="player in combinedBench" :key="player.id">
      <div class="row">
        <div v-if="player.id" class="col-5 matchup" @click="goToPlayer(player.id)">
          <div class="matchup-list">
            <div class="list-item border-bottom" :class="scoringLookupTeamA[player.id].gameSecondsRemaining < 3600 && scoringLookupTeamA[player.id].gameSecondsRemaining > 0 ? 'bg-cyan-1' : ''">
              <div class="row">
                <div class="col-9 team-name-container">
                  <div class="row">
                    <div class="team-name text-left col-12" >{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}}. {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <div class="team">{{playerLookup[player.id].team}}</div></div>
                    <blitz-versus class="team-matchup text-left col-12" :player="player.id"></blitz-versus>
                  </div>
                </div>
                <div class="col-3">
                  <div v-if="matchupLookup[playerLookup[player.id].team]" class="row">
                    <div class="team-score text-right col-12" >{{scoringLookupTeamA[player.id].gameSecondsRemaining === '3600' ? '-' : scoringLookupTeamA[player.id].score}}</div>
                    <div :class="updatedProjection[player.id].projection > updatedProjection[player.id].original ? 'text-green-14' : updatedProjection[player.id].projection < updatedProjection[player.id].original ? 'text-red-13' : ''" class="team-projection text-right col-12">{{ updatedProjection[player.id].projection }}</div>
                  </div>
                  <div v-if="!matchupLookup[playerLookup[player.id].team]" class="row">
                    <div class="team-score text-right col-12" >-</div>
                    <div class="team-projection text-right col-12">-</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!player.id" class="col-5 matchup">
          <div class="matchup-list">
            <div class="list-item border-bottom">
              <div class="row">
                <div class="col-12 team-name-container">
                  <div class="row">
                    <div class="team-name text-left col-12">Empty</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-2 matchup">
          <div class="position-list bg-grey-2 text-grey-8">
            <div class="row items-center positions border-bottom">
              <div class="col-12 text-primary">
                {{player.position}}
              </div>
            </div>
          </div>
        </div>
        <div v-if="player.opp" class="col-5 matchup" @click="goToPlayer(player.opp)">
          <div class="matchup-list">
            <div class="list-item border-bottom" :class="scoringLookupTeamB[player.opp].gameSecondsRemaining < 3600 && scoringLookupTeamB[player.opp].gameSecondsRemaining > 0 ? 'bg-cyan-1' : ''">
              <div class="row">
                <div class="col-3">
                  <div v-if="matchupLookup[playerLookup[player.opp].team]" class="row">
                    <div class="team-score text-left col-12" >{{scoringLookupTeamB[player.opp].gameSecondsRemaining === '3600' ? '-' : scoringLookupTeamB[player.opp].score}}</div>
                    <div :class="updatedProjection[player.opp].projection > updatedProjection[player.opp].original ? 'text-green-14' : updatedProjection[player.opp].projection < updatedProjection[player.opp].original ? 'text-red-13' : ''" class="team-projection text-left col-12" >{{ updatedProjection[player.opp].projection }}</div>
                  </div>
                  <div v-if="!matchupLookup[playerLookup[player.opp].team]" class="row">
                    <div class="team-score text-left col-12" >-</div>
                    <div class="team-projection text-left col-12" >-</div>
                  </div>
                </div>
                <div class="col-9 team-name-container">
                  <div class="row">
                    <div class="team-name text-right col-12" >{{playerLookup[player.opp].name.split(', ').slice(1).join(' ').charAt(0)}}. {{playerLookup[player.opp].name.split(', ').slice(0, -1).join(' ')}}<div class="team"> {{playerLookup[player.opp].team}}</div></div>
                    <blitz-versus class="team-matchup text-right col-12" :player="player.opp"></blitz-versus>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!player.opp" class="col-5 matchup">
          <div class="matchup-list">
            <div class="list-item border-bottom">
              <div class="row">
                <div class="col-12 team-name-container">
                  <div class="row">
                    <div class="team-name text-right col-12">Empty</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import blitzVersus from './blitzVersus.vue'

export default {
  name: 'matchup',
  data () {
    return {
      dataLoaded: true,
      selectedTeam: '',
      selectedPlayer: ''
    }
  },
  components: {
    blitzVersus
  },
  props: {
    teamA: String,
    teamB: String
  },
  computed: {
    ...mapGetters({
      activeLeague: 'main/activeLeague',
      leagueData: 'main/leagueData',
      rosters: 'main/rosters',
      players: 'main/players',
      league: 'main/league',
      liveScoring: 'main/liveScoring',
      matchupLiveScoring: 'main/matchupLiveScoring',
      projectedScores: 'main/projectedScores',
      currentWeek: 'main/currentWeek',
      fullNflSchedule: 'main/fullNflSchedule'
    }),
    playerLookup () {
      var array = this.players.player
      return this.lookup(array, 'id')
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    },
    projectedLookup () {
      var array = this.projectedScores.playerScore
      return this.lookup(array, 'id')
    },
    displayScoring () {
      if (this.matchupLiveScoring) {
        return this.matchupLiveScoring
      } else {
        return this.liveScoring
      }
    },
    allScoring () {
      var array = []
      this.displayScoring.matchup.forEach((el) => {
        el.franchise.forEach((el2) => {
          array.push(el2)
        })
      })
      return this.lookup(array, 'id')
    },
    scoringLookupTeamA () {
      var array = this.allScoring[this.teamA].players.player
      return this.lookup(array, 'id')
    },
    scoringLookupTeamB () {
      var array = this.allScoring[this.teamB].players.player
      return this.lookup(array, 'id')
    },
    totalProjected () {
      var obj = {}
      var team1 = 0
      var team2 = 0
      this.startersTeamA.forEach(el => {
        team1 += parseFloat(this.updatedProjection[el.id] ? this.updatedProjection[el.id].projection : 0)
      })
      this.startersTeamB.forEach(el => {
        team2 += parseFloat(this.updatedProjection[el.id] ? this.updatedProjection[el.id].projection : 0)
      })
      obj[this.teamA] = parseFloat(Math.round(team1 * 100) / 100).toFixed(2)
      obj[this.teamB] = parseFloat(Math.round(team2 * 100) / 100).toFixed(2)
      return obj
    },
    updatedProjection () {
      var obj = {}
      this.allScoring[this.teamA].players.player.forEach(el => {
        var score = parseFloat(this.scoringLookupTeamA[el.id].score)
        var projection = this.projectedLookup[el.id] ? parseFloat(this.projectedLookup[el.id].score) : 0
        var newProjection = ''
        var timeRemaining = parseFloat(this.scoringLookupTeamA[el.id].gameSecondsRemaining)
        if (!score) {
          score = 0
        }
        if (!projection) {
          projection = 0
        }
        var rate = projection / 3600
        newProjection = timeRemaining === 0 ? projection : ((timeRemaining * rate) + score).toFixed(2)
        obj[el.id] = {
          projection: newProjection,
          original: projection
        }
      })
      this.allScoring[this.teamB].players.player.forEach(el => {
        var score = parseFloat(this.scoringLookupTeamB[el.id].score)
        var projection = this.projectedLookup[el.id] ? parseFloat(this.projectedLookup[el.id].score) : 0
        var newProjection = ''
        var timeRemaining = parseFloat(this.scoringLookupTeamB[el.id].gameSecondsRemaining)
        if (!score) {
          score = 0
        }
        if (!projection) {
          projection = 0
        }
        var rate = projection / 3600
        newProjection = timeRemaining === 0 ? projection : ((timeRemaining * rate) + score).toFixed(2)
        obj[el.id] = {
          projection: newProjection,
          original: projection
        }
      })
      return obj
    },
    startingPosObject () {
      var starters = []
      var positions = this.positions
      positions.forEach((elarray) => {
        var obj = {}
        elarray.forEach((elPos) => {
          var position = elarray.length > 1 ? elarray.map((pos) => pos[0]).join('/') : elPos
          obj = {
            position: position
          }
        })
        starters.push(obj)
      })
      return starters
    },
    startersTeamA () {
      var players = []
      var starters = JSON.parse(JSON.stringify(this.startingPosObject))
      this.allScoring[this.teamA].players.player.forEach(el => {
        if (el.status === 'starter') {
          players.push(el.id)
        }
      })
      var n = 0
      let playerLook = this.playerLookup

      this.positions.forEach((elarray) => {
        elarray.forEach((elPos) => {
          players.some((elId) => {
            if (playerLook[elId].position === elPos) {
              var index = players.indexOf(elId)
              players.splice(index, 1)
              starters[n]['id'] = playerLook[elId].id
            }
            return playerLook[elId].position === elPos
          })
        })
        n++
      })
      return starters
    },
    startersTeamANew () {
      var players = []
      var positions = JSON.parse(JSON.stringify(this.startingPosObject))
      let playerObj = this.playerLookup
      this.allScoring[this.teamA].players.player.forEach(el => {
        if (el.status === 'starter') {
          players.push(el.id)
        }
      })

      positions.forEach((elarray) => {
        players.some((elId) => {
          if (playerObj[elId].position === elarray.position) {
            var index = players.indexOf(elId)
            players.splice(index, 1)
            elarray['id'] = playerObj[elId].id
          }
          return playerObj[elId].position === elarray.position
        })
      })
      return positions
    },
    startersTeamB () {
      var players = []
      var starters = JSON.parse(JSON.stringify(this.startingPosObject))
      this.allScoring[this.teamB].players.player.forEach(el => {
        if (el.status === 'starter') {
          players.push(el.id)
        }
      })
      var n = 0
      let playerLook = this.playerLookup
      this.positions.forEach((elarray) => {
        elarray.forEach((elPos) => {
          players.some((elId) => {
            if (playerLook[elId].position === elPos) {
              var index = players.indexOf(elId)
              players.splice(index, 1)
              starters[n]['id'] = playerLook[elId].id
            }
            return playerLook[elId].position === elPos
          })
        })
        n++
      })
      return starters
    },
    startersTeamBNew () {
      var players = []
      var positions = JSON.parse(JSON.stringify(this.startingPosObject))
      let playerObj = this.playerLookup
      this.allScoring[this.teamB].players.player.forEach(el => {
        if (el.status === 'starter') {
          players.push(el.id)
        }
      })

      positions.forEach((elarray) => {
        players.some((elId) => {
          if (playerObj[elId].position === elarray.position) {
            var index = players.indexOf(elId)
            players.splice(index, 1)
            elarray['id'] = playerObj[elId].id
          }
          return playerObj[elId].position === elarray.position
        })
      })
      return positions
    },
    combinedStarters () {
      var teamA = JSON.parse(JSON.stringify(this.startersTeamA))
      var teamB = JSON.parse(JSON.stringify(this.startersTeamB))
      var combined = []
      var n = 0
      teamA.forEach(el => {
        if (teamB[n].id) {
          el['opp'] = teamB[n].id
        }
        combined.push(el)
        n++
      })
      return combined
    },
    benchTeamA () {
      var bench = []
      this.allScoring[this.teamA].players.player.forEach(el => {
        if (el.status === 'nonstarter') {
          var obj = {
            id: el.id
          }
          bench.push(obj)
        }
      })
      return bench
    },
    benchTeamB () {
      var bench = []
      this.allScoring[this.teamB].players.player.forEach(el => {
        if (el.status === 'nonstarter') {
          var obj = {
            id: el.id
          }
          bench.push(obj)
        }
      })
      return bench
    },
    combinedBench () {
      var benchTeamA = JSON.parse(JSON.stringify(this.benchTeamA))
      var benchTeamB = JSON.parse(JSON.stringify(this.benchTeamB))
      var combined = []
      var n = 0
      var i = 0
      var arrayLong = benchTeamA.length > benchTeamB.length ? benchTeamA : benchTeamB
      arrayLong.forEach(el => {
        combined.push({})
      })
      benchTeamA.forEach(el => {
        combined[n]['id'] = el.id
        combined[n]['position'] = 'BN'
        n++
      })
      benchTeamB.forEach(el => {
        combined[i]['opp'] = el.id
        combined[i]['position'] = 'BN'
        i++
      })
      return combined
    },
    matchupLookup () {
      var obj = {}
      var weekNumb = this.currentWeek - 1
      this.fullNflSchedule.nflSchedule[weekNumb].matchup.forEach((el, i) => {
        obj[el.team[0].id] = {
          vs: el.team[1].id
        }
        obj[el.team[1].id] = {
          vs: el.team[0].id
        }
      })
      return obj
    },
    positions () {
      var pos = []
      var flex = []
      var kick = []
      var def = []
      var n = 0
      var m = 0
      this.league.starters.position.forEach((el) => {
        var min = 0
        var max = 0
        if (el.limit === '1' && el.name === 'Def') {
          def[0] = new Array(0)
          def[0].push(el.name)
        } else if (el.limit === '1' && el.name === 'K') {
          kick[0] = new Array(0)
          kick[0].push(el.name)
        } else if (el.limit.indexOf('-')) {
          min = el.limit.split('-')[0]
          max = el.limit.split('-')[1]
        } else {
          min = el.limit
          max = el.limit
        }
        for (var i = 0, len = min; i < len; i++) {
          pos[n] = new Array(0)
          pos[n].push(el.name)
          n++
        }
        for (var j = 0, len2 = (max - min); j < len2; j++) {
          if (!flex[m]) {
            flex[m] = new Array(0)
          }
          flex[m].push(el.name)
          m++
        }
        m = 0
      })
      var positions = pos.concat(flex, kick, def)
      return positions
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
    goToTeam (id) {
      this.selectedTeam = id
      this.$router.push('/team/' + id)
    },
    goToPlayer (id) {
      if (id) {
        this.selectedPlayer = id
        this.$router.push('/player/' + id)
      }
    }
  },
  activated () {
    this.selectedTeam = ''
    this.selectedPlayer = ''
  }
}
</script>

<style lang="stylus" scoped>
@import '~variables'
.matchup-header .team
  height 100%
  padding 20px 0
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
  color $grey-14
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
  color $grey-14
  font-size 12px
.matchup-list .team-score
  font-size 14px
  font-weight 500
  padding-bottom 2px
.matchup-list .team-projection
  font-size 12px
  color $grey-8
.matchup-list .team-matchup
  font-size 12px
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
</style>
