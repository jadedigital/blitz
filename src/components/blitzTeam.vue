<template>
  <div>
    <div v-if="rosterCheck" class="team-child">
      <q-list link class="no-border no-pad bg-grey-1">
        <q-card class="compact-card bg-white">
          <div class="row">
            <div class="col-6">
              <q-card-title>
                Starters
              </q-card-title>
            </div>
            <div v-if="lineupResponse.includes('Error')" class="col-6 error-button text-right">
              <q-btn @click="errorModal = true" flat size="lg" round color="tertiary" icon="error" />
            </div>
          </div>
          <div class="card-main bg-white">
            <div v-for="(player, index) in startersRendered" :key="index">
              <div v-if="player.id">
                <q-item link separator @click.native="goToPlayer(player.id)">
                  <q-btn @click.stop="modalLogic(player.id, index)" round small style="font-size: 12px; font-weight:400" :class="[ parseFloat(scoringLookup[player.id].gameSecondsRemaining) < 3600 ? 'q-btn-flat text-primary' : 'q-btn-outline bg-white text-primary', 'q-item-avatar']">{{ player.position }}</q-btn>
                  <q-item-side class="player-avatar" :avatar="playerLookup[player.id].position === 'Def' ? './statics/' + teamMap[playerLookup[player.id].team] + '.svg' : playerLookup[player.id].cbs_id ? 'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[player.id].cbs_id + '.jpg' : './statics/avatar.jpg'" />
                  <div class="q-item-main q-item-section team-players">
                    <div class="q-item-label team-player-name">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}}. {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <blitz-injury class="injury" :player="player.id"></blitz-injury><small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
                    <blitz-versus class="q-item-sublabel" rank :player="player.id"></blitz-versus>
                  </div>
                  <div class="q-item-side q-item-side-right q-item-section">
                    <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{scoringLookup[player.id].score}}</div>
                    <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;"><small>{{ updatedProjection[player.id].projection }}</small></div>
                  </div>
                </q-item>
              </div>
              <div v-if="!player.id">
                <q-item link separator>
                  <q-btn @click.stop="modalLogic('', index)" round small style="font-size: 12px; font-weight:400" class="q-btn-outline bg-white text-primary q-item-avatar">{{ player.position }}</q-btn>
                  <q-item-side class="player-avatar" :avatar="'./statics/avatar.jpg'" />
                  <div class="q-item-main q-item-section team-players">
                    <div class="q-item-label team-player-name">Empty</div>
                  </div>
                </q-item>
              </div>
            </div>
          </div>
        </q-card>
        <q-card class="compact-card bg-white">
          <q-card-title>
            Bench
          </q-card-title>
          <div class="card-main bg-white">
            <q-item link separator v-for="player in bench" :key="player.id" @click.native="goToPlayer(player.id)">
              <q-btn @click.stop="submitLineup()" round small style="font-size: 12px; font-weight:400" :class="buttonClass(player.id)">BN</q-btn>
              <q-item-side class="player-avatar" :avatar="playerLookup[player.id].position === 'Def' ? './statics/' + teamMap[playerLookup[player.id].team] + '.svg' : playerLookup[player.id].cbs_id ? 'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[player.id].cbs_id + '.jpg' : './statics/avatar.jpg'" />
              <div class="q-item-main q-item-section team-players">
                <div class="q-item-label team-player-name">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}}. {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <blitz-injury class="injury" :player="player.id"></blitz-injury><small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
                <blitz-versus class="q-item-sublabel" rank :player="player.id"></blitz-versus>
              </div>
              <div v-if="!byeBool(player.id)" class="q-item-side q-item-side-right q-item-section">
                <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{scoringLookup[player.id].score}}</div>
                <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;"><small>{{ updatedProjection[player.id].projection }}</small></div>
              </div>
              <div v-if="byeBool(player.id)" class="q-item-side q-item-side-right q-item-section">
                <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">-</div>
                <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;"><small>-</small></div>
              </div>
            </q-item>
          </div>
        </q-card>
        <q-card v-if="league.injuredReserve !== '0' && injuredReserve.length < 0" class="compact-card bg-white">
          <q-card-title>
            Injured Reserve
          </q-card-title>
          <q-card-separator />
          <div class="card-main bg-white">
            <q-item link separator v-for="player in injuredReserve" :key="player.id" @click.native="goToPlayer(player.id)">
              <q-btn round small style="font-size: 14px; font-weight:400" class="q-item-avatar q-btn-flat text-primary">IR</q-btn>
              <q-item-side class="player-avatar" :avatar="playerLookup[player.id].position === 'Def' ? './statics/' + teamMap[playerLookup[player.id].team] + '.svg' : playerLookup[player.id].cbs_id ? 'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[player.id].cbs_id + '.jpg' : './statics/avatar.jpg'" />
              <div class="q-item-main q-item-section team-players">
                <div class="q-item-label team-player-name">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}}. {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <blitz-injury class="injury" :player="player.id"></blitz-injury><small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
                <blitz-versus class="q-item-sublabel" rank :player="player.id"></blitz-versus>
              </div>
              <q-item-side right>-</q-item-side>
            </q-item>
          </div>
        </q-card>
        <q-card v-if="league.taxiSquad !== '0'" class="compact-card bg-white">
          <q-card-title>
            Taxi Squad
          </q-card-title>
          <q-card-separator />
          <div class="card-main bg-white">
            <q-item link separator v-for="player in taxiSquad" :key="player.id" @click.native="goToPlayer(player.id)">
              <q-btn round small style="font-size: 14px; font-weight:400" class="q-item-avatar q-btn-flat text-primary">TS</q-btn>
              <q-item-side class="player-avatar" :avatar="playerLookup[player.id].position === 'Def' ? './statics/' + teamMap[playerLookup[player.id].team] + '.svg' : playerLookup[player.id].cbs_id ? 'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[player.id].cbs_id + '.jpg' : './statics/avatar.jpg'" />
              <div class="q-item-main q-item-section team-players">
                <div class="q-item-label team-player-name">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}}. {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <blitz-injury class="injury" :player="player.id"></blitz-injury><small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
                <blitz-versus class="q-item-sublabel" rank :player="player.id"></blitz-versus>
              </div>
              <q-item-side right>-</q-item-side>
            </q-item>
          </div>
        </q-card>
      </q-list>
      <q-modal position="bottom" v-model="swapModal">
        <q-list link class="no-border no-pad">
          <q-list-header>
            Swap {{swapPlayer.name}} with another player:
          </q-list-header>
          <div v-for="player in modalPlayers" :key="player.id">
            <q-item @click.native="movePlayer(player.id, player.index)" link>
              <q-btn round small style="font-size: 12px; font-weight:400" :class="[ parseFloat(scoringLookup[player.id].gameSecondsRemaining) < 3600 ? 'q-btn-flat text-primary' : 'q-btn-outline bg-white text-primary', 'q-item-avatar']">{{player.slot}}</q-btn>
              <div class="q-item-main q-item-section team-players">
                <div class="q-item-label team-player-name">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}}. {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <blitz-injury class="injury" :player="player.id"></blitz-injury><small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
                <blitz-versus class="q-item-sublabel" rank :player="player.id"></blitz-versus>
              </div>
              <div class="q-item-side q-item-side-right q-item-section">
                <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{scoringLookup[player.id].score}}</div>
                <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;"><small>{{ updatedProjection[player.id].projection }}</small></div>
              </div>
            </q-item>
          </div>
        </q-list>
      </q-modal>
      <q-modal position="bottom" v-model="errorModal">
        <div style="padding:20px;" class="text-justify light-paragraph" v-html="lineupResponseFormatted"></div>
      </q-modal>
    </div>
    <div v-if="!rosterCheck" style="height: calc(100vh - 112px)">
      <div class="absolute-center text-center light-paragraph">
        No players on your roster
      </div>
    </div>
  </div>
</template>

<script>
import { date, format } from 'quasar'
import { mapGetters } from 'vuex'
import blitzInjury from './blitzInjury.vue'
import blitzVersus from './blitzVersus.vue'

export default {
  name: 'BTeam',
  components: {
    blitzInjury,
    blitzVersus
  },
  props: {
    thisTeam: String
  },
  data () {
    return {
      response: null,
      swapModal: false,
      modalPositionIndex: '',
      modalPlayers: [],
      swapPlayer: {},
      errorModal: false
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'main/activeLeague',
      leagueData: 'main/leagueData',
      players: 'main/players',
      rosters: 'main/rosters',
      league: 'main/league',
      fullNflSchedule: 'main/fullNflSchedule',
      liveScoring: 'main/liveScoring',
      projectedScores: 'main/projectedScores',
      teamMap: 'main/teamMap',
      currentWeek: 'main/currentWeek',
      token: 'main/token',
      lineupResponse: 'main/lineupResponse',
      lineupLocal: 'main/lineupLocal',
      lineupSynced: 'main/lineupSynced'
    }),
    rosterCheck () {
      if (this.rosterLookup[this.thisTeam].player) {
        return true
      } else {
        return false
      }
    },
    rosterLookup () {
      var array = this.rosters.franchise
      return this.lookup(array, 'id')
    },
    playerLookup () {
      var array = this.players.player
      return this.lookup(array, 'id')
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    },
    lineLookup () {
      var array = this.lineupLocal
      var key = 'id'
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        array[i]['index'] = i
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    projectedLookup () {
      var array = this.projectedScores.playerScore
      return this.lookup(array, 'id')
    },
    updatedProjection () {
      var obj = {}
      this.teamScoring.players.player.forEach(el => {
        var score = parseFloat(this.scoringLookup[el.id].score)
        var projection = this.projectedLookup[el.id] ? parseFloat(this.projectedLookup[el.id].score) : 0
        var newProjection = ''
        var timeRemaining = parseFloat(this.scoringLookup[el.id].gameSecondsRemaining)
        if (!score) {
          score = 0
        }
        var rate = projection / 3600
        newProjection = timeRemaining === 0 ? projection : ((timeRemaining * rate) + score).toFixed(2)
        obj[el.id] = {projection: newProjection}
      })
      return obj
    },
    teamScoring () {
      var scoring = ''
      if (this.liveScoring.matchup) {
        this.liveScoring.matchup.forEach((el) => {
          el.franchise.forEach((el2) => {
            if (el2.id === this.thisTeam) {
              scoring = el2
            }
          })
        })
      }
      if (this.liveScoring.franchise) {
        this.liveScoring.franchise.forEach((el) => {
          if (el.id === this.thisTeam) {
            scoring = el
          }
        })
      }
      return scoring
    },
    scoringLookup () {
      var array = this.teamScoring.players.player
      return this.lookup(array, 'id')
    },
    startersSorted () {
      let array = []
      let positions = this.positionsBasic
      let positionLookup = this.playerLookup
      this.teamScoring.players.player.slice(0).forEach((el) => {
        const obj = {
          id: el.id,
          pos: positionLookup[el.id].position,
          status: el.status,
          score: el.score
        }
        array.push(obj)
      })
      array.sort(function (a, b) {
        return positions.indexOf(a.pos) - positions.indexOf(b.pos)
      })
      return array
    },
    matchupLookup () {
      const { pad } = format
      var obj = {}
      var weekNumb = this.currentWeek - 1
      this.fullNflSchedule.nflSchedule[weekNumb].matchup.forEach((el, i) => {
        var kickoff = new Date(el.kickoff * 1000)
        var seconds = parseInt(el.gameSecondsRemaining)
        obj[el.team[0].id] = {
          vs: el.team[1].id,
          day: date.formatDate(kickoff, 'ddd'),
          time: date.formatDate(kickoff, 'h' + ':' + 'mm' + 'a'),
          result: parseInt(el.team[0].score) > parseInt(el.team[1].score) ? ('W' + ' ' + el.team[0].score + '-' + el.team[1].score) : ('L' + ' ' + el.team[0].score + '-' + el.team[1].score),
          location: ((el.team[0].isHome === '0') ? '@' : 'vs'),
          remaining: this.pluralize(4 - Math.floor(seconds / 900)) + ' ' + Math.floor((seconds % 900) / 60) + ':' + pad((seconds % 900) % 60, 2)
        }
        obj[el.team[1].id] = {
          vs: el.team[0].id,
          day: date.formatDate(kickoff, 'ddd'),
          time: date.formatDate(kickoff, 'h' + ':' + 'mm' + 'a'),
          result: parseInt(el.team[1].score) > parseInt(el.team[0].score) ? ('W' + ' ' + el.team[1].score + '-' + el.team[0].score) : ('L' + ' ' + el.team[1].score + '-' + el.team[0].score),
          location: ((el.team[1].isHome === '0') ? '@' : 'vs'),
          remaining: this.pluralize(4 - Math.floor(seconds / 900)) + ' ' + Math.floor((seconds % 900) / 60) + ':' + pad((seconds % 900) % 60, 2)
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
    startersServer () {
      var players = []
      var positions = this.startingPosObject
      let playerObj = this.playerLookup
      this.teamScoring.players.player.forEach(el => {
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
    startersRendered () {
      if (this.lineupSynced) {
        return this.startersServer
      } else {
        return this.lineupLocal
      }
    },
    bench () {
      var localLookup = this.lookup(this.lineupLocal, 'id')
      var bench = []
      this.teamScoring.players.player.forEach(el => {
        if (el.status === ('nonstarter' || 'ROSTER') && !localLookup[el.id]) {
          var obj = {
            id: el.id
          }
          bench.push(obj)
        }
      })
      return bench
    },
    taxiSquad () {
      var taxiSquad = []
      this.rosterLookup[this.thisTeam].player.forEach(el => {
        if (el.status === 'TAXI_SQUAD') {
          var obj = {
            id: el.id
          }
          taxiSquad.push(obj)
        }
      })
      return taxiSquad
    },
    injuredReserve () {
      var injuredReserve = []
      this.rosterLookup[this.thisTeam].player.forEach(el => {
        if (el.status === 'INJURED_RESERVE') {
          var obj = {
            id: el.id
          }
          injuredReserve.push(obj)
        }
      })
      return injuredReserve
    },
    positionsBasic () {
      var pos = []
      this.league.starters.position.forEach((el) => {
        pos.push(el.name)
      })
      return pos
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
    },
    lineupResponseFormatted () {
      let search = '&lt;br/&gt;'
      let replacement = '<br>'
      let response = this.lineupResponse.split(search).join(replacement)
      search = '<error>'
      replacement = '<div>'
      return response.split(search).join(replacement)
    }
  },
  methods: {
    goToPlayer (id) {
      this.$router.push('/player/' + id)
    },
    buttonClass (id) {
      var cls = ''
      if (parseFloat(this.scoringLookup[id].gameSecondsRemaining) < 3600 && this.byeBool[id]) {
        cls = 'q-btn-flat text-primary q-item-avatar'
      } else {
        cls = 'q-btn-outline bg-white text-primary q-item-avatar'
      }
      return cls
    },
    byeBool (id) {
      if (this.matchupLookup[this.playerLookup[id].team]) {
        return false
      } else {
        return true
      }
    },
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    modalLogic (pid, index) {
      var localLookup = this.lineLookup
      var players = []
      var name = this.playerLookup[pid] ? this.playerLookup[pid].name : ''

      this.positions[index].forEach((pos) => {
        this.startersSorted.forEach((el) => {
          if (pos === this.playerLookup[el.id].position && name !== this.playerLookup[el.id].name) {
            if (localLookup[el.id]) {
              el.slot = localLookup[el.id].position
              el.index = localLookup[el.id].index
            } else {
              el.slot = 'BN'
            }
            players.push(el)
          }
        })
      })
      this.swapPlayer['name'] = name.split(', ').reverse().join(' ')
      this.swapPlayer['id'] = pid
      this.modalPlayers = players
      this.modalPositionIndex = index
      this.swapModal = true
    },
    movePlayer (newId, newPos) {
      this.swapModal = false
      let starters = []

      var index = this.modalPositionIndex
      if (this.lineupSynced) {
        starters = this.startersServer
      } else {
        starters = this.lineupLocal
      }

      var startersCSV = ''
      starters[index].id = newId
      if (newPos) {
        starters[newPos].id = this.swapPlayer['id']
      }
      console.log(starters)
      starters.forEach((el) => {
        if (el.id) {
          if (startersCSV === '') {
            startersCSV = el.id
          } else {
            startersCSV = startersCSV + ',' + el.id
          }
        }
      })
      console.log(startersCSV)
      this.$store.commit('main/SET_DATA', {type: 'lineupLocal', data: starters})
      this.$store.commit('main/SET_DATA', {type: 'lineupSynced', data: false})
      this.submitLineup(startersCSV)
    },
    pluralize: function (value) {
      value = value.toString()
      if (value.endsWith('1')) {
        value = value.toString() + 'st'
      } else if (value.endsWith('2')) {
        value = value.toString() + 'nd'
      } else if (value.endsWith('3')) {
        value = value.toString() + 'rd'
      } else if (parseInt(value) > 9 && parseInt(value) < 20) {
        value = value.toString() + 'th'
      } else {
        value = value.toString() + 'th'
      }
      return value
    },
    submitLineup (lineup) {
      let data = {
        cookie: this.token,
        host: this.leagueData[this.activeLeague].host,
        season: '2019',
        TYPE: 'lineup',
        L: this.activeLeague,
        W: this.currentWeek,
        STARTERS: lineup
      }
      this.$store.dispatch('main/API_POST', { data })
        .then((response) => {
          console.log(response)
          if (!response.includes('Error')) {
            this.$store.commit('main/SET_DATA', {type: 'lineupSynced', data: false})
          }
          this.$store.commit('main/SET_DATA', {type: 'lineupResponse', data: response})
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.team-child .q-item-side.player-avatar
  min-width 40px
  border-radius 50%
  overflow hidden
  height 40px
.team-child .q-item-side.player-avatar img
  width 30px
  height 40px
  border-radius 0
  margin 0 5px
.team-child .q-chip
  min-height 16px
  font-size 10px
  padding-left 8px
  padding-right 8px
  background #ff1744
.injury
  display inline-block
.card-main .q-item-separator
  border-top 1px solid #e0e0e0
.error-button
  padding 2px
</style>
