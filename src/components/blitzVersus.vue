<template>
  <div
    v-if="!playerLookup[player].team.startsWith('FA')"
  >
    {{matchupLookup[playerLookup[player].team].day}} {{matchupLookup[playerLookup[player].team].time}} -
    <span
      :class="matchupPoints[playerLookup[player].position][matchupLookup[playerLookup[player].team].vs].rank < 11 ? 'text-green-14' : matchupPoints[playerLookup[player].position][matchupLookup[playerLookup[player].team].vs].rank < 21 ? 'text-yellow-9' : 'text-red-13'"
    >
      {{matchupLookup[playerLookup[player].team].location}} {{matchupLookup[playerLookup[player].team].vs}} <span v-if="rank">({{matchupPoints[playerLookup[player].position][matchupLookup[playerLookup[player].team].vs].rankPretty}})</span>
    </span>
  </div>
</template>

<script>
import {
  date,
  format
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  props: {
    rank: Boolean,
    player: String
  },
  computed: {
    ...mapGetters({
      activeLeague: 'main/activeLeague',
      leagueData: 'main/leagueData',
      players: 'main/players',
      league: 'main/league',
      fullNflSchedule: 'main/fullNflSchedule',
      pointsAllowed: 'main/pointsAllowed',
      currentWeek: 'main/currentWeek'
    }),
    playerLookup () {
      var array = this.players.player
      return this.lookup(array, 'id')
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
    matchupPoints () {
      var object = {}
      this.league.starters.position.forEach(el => {
        object[el.name] = this.matchupPointsUtil(el.name)
      })
      return object
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
    matchupPointsUtil (pos) {
      var array = []
      var object = {}
      this.pointsAllowed.team.forEach(el => {
        var lookup = this.lookup(el.position, 'name')
        var obj = {
          team: el.id,
          points: lookup[pos].points
        }
        array.push(obj)
        object[el.id] = {
          points: lookup[pos].points
        }
      })
      array.sort(function (a, b) {
        if (a.points > b.points) return -1
        if (a.points < b.points) return 1
        return 0
      })
      array.forEach(el => {
        object[el.team].rank = array.findIndex(x => x.team === el.team) + 1
        object[el.team].rankPretty = this.pluralize(array.findIndex(x => x.team === el.team) + 1)
      })
      return object
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
    }
  }
}
</script>

<style lang="stylus">

</style>
