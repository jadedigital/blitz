<template>
  <div class="team-child">
    <q-list link class="no-border no-pad bg-grey-1">
      <q-card class="compact-card bg-white">
        <q-card-title>
          Roster
        </q-card-title>
        <q-card-separator />
        <div class="card-main bg-white">
          <q-item link separator v-for="player in startersOld" :key="player.id" @click="goToPlayer(player.id)">
            <q-btn @click.stop="showAS(playerLookup[player.id].name)" round small style="font-size: 12px; font-weight:400" :class="[ parseFloat(scoringLookup[player.id].gameSecondsRemaining) < 3600 ? 'q-btn-flat text-primary' : 'q-btn-outline bg-white text-primary', 'q-item-avatar']">{{ player.position }}</q-btn>
            <q-item-side class="player-avatar" :avatar="playerLookup[player.id].position === 'Def' ? './statics/' + teamMap[playerLookup[player.id].team] + '.svg' : playerLookup[player.id].cbs_id ? 'https://sports.cbsimg.net/images/football/nfl/players/60x80/' + playerLookup[player.id].cbs_id + '.jpg' : './statics/avatar.jpg'" />
            <div class="q-item-main q-item-section team-players">
              <div class="q-item-label team-player-name">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <blitz-injury class="injury" :player="player.id"></blitz-injury><small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
              <blitz-versus class="q-item-sublabel" rank :player="player.id"></blitz-versus>
            </div>
            <div class="q-item-side q-item-side-right q-item-section">
              <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{scoringLookup[player.id].score}}</div>
              <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;"><small>{{ updatedProjection[player.id].projection }}</small></div>
            </div>
          </q-item>
        </div>
      </q-card>
      <q-card class="compact-card bg-white">
        <q-card-title>
          Bench
        </q-card-title>
        <q-card-separator />
        <div class="card-main bg-white">
          <q-item link separator v-for="player in bench" :key="player.id" @click="goToPlayer(player.id)">
            <q-btn @click.stop="showAS(playerLookup[player.id].name)" round small style="font-size: 12px; font-weight:400" :class="[ parseFloat(scoringLookup[player.id].gameSecondsRemaining) < 3600 ? 'q-btn-flat text-primary' : 'q-btn-outline bg-white text-primary', 'q-item-avatar']">BN</q-btn>
            <q-item-side class="player-avatar" :avatar="playerLookup[player.id].position === 'Def' ? './statics/' + teamMap[playerLookup[player.id].team] + '.svg' : playerLookup[player.id].cbs_id ? 'https://sports.cbsimg.net/images/football/nfl/players/60x80/' + playerLookup[player.id].cbs_id + '.jpg' : './statics/avatar.jpg'" />
            <div class="q-item-main q-item-section team-players">
              <div class="q-item-label team-player-name">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <blitz-injury class="injury" :player="player.id"></blitz-injury><small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
              <blitz-versus class="q-item-sublabel" rank :player="player.id"></blitz-versus>
            </div>
            <div class="q-item-side q-item-side-right q-item-section">
              <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{scoringLookup[player.id].score}}</div>
              <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;"><small>{{ updatedProjection[player.id].projection }}</small></div>
            </div>
          </q-item>
        </div>
      </q-card>
      <q-card class="compact-card bg-white">
        <q-card-title>
          Injured Reserve
        </q-card-title>
        <q-card-separator />
        <div class="card-main bg-white">
          <q-item link separator v-for="player in injuredReserve" :key="player.id" @click="goToPlayer(player.id)">
            <q-btn round small style="font-size: 14px; font-weight:400" class="q-item-avatar q-btn-flat text-primary">IR</q-btn>
            <q-item-side class="player-avatar" :avatar="playerLookup[player.id].position === 'Def' ? './statics/' + teamMap[playerLookup[player.id].team] + '.svg' : playerLookup[player.id].cbs_id ? 'https://sports.cbsimg.net/images/football/nfl/players/60x80/' + playerLookup[player.id].cbs_id + '.jpg' : './statics/avatar.jpg'" />
            <div class="q-item-main q-item-section team-players">
              <div class="q-item-label team-player-name">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <blitz-injury class="injury" :player="player.id"></blitz-injury><small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
              <blitz-versus class="q-item-sublabel" rank :player="player.id"></blitz-versus>
            </div>
            <q-item-side right>-</q-item-side>
          </q-item>
        </div>
      </q-card>
      <q-card class="compact-card bg-white">
        <q-card-title>
          Taxi Squad
        </q-card-title>
        <q-card-separator />
        <div class="card-main bg-white">
          <q-item link separator v-for="player in taxiSquad" :key="player.id" @click="goToPlayer(player.id)">
            <q-btn round small style="font-size: 14px; font-weight:400" class="q-item-avatar q-btn-flat text-primary">TS</q-btn>
            <q-item-side class="player-avatar" :avatar="playerLookup[player.id].position === 'Def' ? './statics/' + teamMap[playerLookup[player.id].team] + '.svg' : playerLookup[player.id].cbs_id ? 'https://sports.cbsimg.net/images/football/nfl/players/60x80/' + playerLookup[player.id].cbs_id + '.jpg' : './statics/avatar.jpg'" />
            <div class="q-item-main q-item-section team-players">
              <div class="q-item-label team-player-name">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <blitz-injury class="injury" :player="player.id"></blitz-injury><small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
              <blitz-versus class="q-item-sublabel" rank :player="player.id"></blitz-versus>
            </div>
            <q-item-side right>-</q-item-side>
          </q-item>
        </div>
      </q-card>
    </q-list>
  </div>
</template>

<script>
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
      response: null
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      rosters: 'rosters',
      players: 'players',
      league: 'league',
      liveScoring: 'liveScoring',
      projectedScores: 'projectedScores',
      teamMap: 'teamMap',
      displayTeam: 'displayTeam'
    }),
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
    projectedLookup () {
      var array = this.projectedScores.playerScore
      return this.lookup(array, 'id')
    },
    updatedProjection () {
      var obj = {}
      this.teamScoring.players.player.forEach(el => {
        var score = parseFloat(this.scoringLookup[el.id].score)
        var projection = parseFloat(this.projectedLookup[el.id].score)
        var newProjection = ''
        var timeRemaining = parseFloat(this.scoringLookup[el.id].gameSecondsRemaining)
        if (!score) {
          score = 0
        }
        var rate = projection / 3600
        newProjection = ((timeRemaining * rate) + score).toFixed(2)
        obj[el.id] = {projection: newProjection}
      })
      return obj
    },
    teamScoring () {
      var scoring = ''
      this.liveScoring.matchup.forEach((el) => {
        el.franchise.forEach((el2) => {
          if (el2.id === this.thisTeam) {
            scoring = el2
          }
        })
      })
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
      var array = []
      var positions = this.positionsBasic
      this.teamScoring.players.player.forEach((el) => {
        var obj = {
          id: el.id,
          pos: this.playerLookup[el.id].position,
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
    startersOld () {
      var starters = []
      var players = []
      var positions = this.positions
      var playerCheck = ''
      this.teamScoring.players.player.forEach(el => {
        if (el.status === 'starter') {
          players.push(el.id)
        }
      })
      positions.forEach((elarray) => {
        elarray.some((elPos) => {
          players.some((elId) => {
            if (this.playerLookup[elId].position === elPos) {
              var index = players.indexOf(elId)
              players.splice(index, 1)
              var position = elarray.length > 1 ? elarray.map((pos) => pos[0]).join('/') : elPos
              var obj = {
                id: this.playerLookup[elId].id,
                position: position
              }
              starters.push(obj)
            }
            playerCheck = elId
            return this.playerLookup[elId].position === elPos
          })
          return this.playerLookup[playerCheck].position === elPos
        })
      })
      return starters
    },
    bench () {
      var bench = []
      this.teamScoring.players.player.forEach(el => {
        if (el.status === 'nonstarter') {
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
        }
        else if (el.limit === '1' && el.name === 'K') {
          kick[0] = new Array(0)
          kick[0].push(el.name)
        }
        else if (el.limit.indexOf('-')) {
          min = el.limit.split('-')[0]
          max = el.limit.split('-')[1]
        }
        else {
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
    goToPlayer (id) {
      this.$router.push('/player/' + id)
    },
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    showAS (name) {
      var actions = []
      this.startersSorted.forEach((el) => {
        var action = {
          label: this.playerLookup[el.id].name,
          avatar: 'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + this.playerLookup[el.id].cbs_id + '.jpg',
          handler () {
            this.$q.notify('API call to submit lineup')
          }
        }
        actions.push(action)
      })
      this.$q.actionSheet({
        title: 'Move ' + name.split(', ').reverse().join(' '),
        actions: actions,
        dismissLabel: 'Cancel'
      })
    }
  }
}
</script>

<style lang="stylus">
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
</style>
