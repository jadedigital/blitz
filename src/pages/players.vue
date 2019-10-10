<template>
  <q-pull-to-refresh :handler="refresher">
    <div v-if="!dataLoaded" style="height: calc(100vh - 112px)">
      <q-spinner color="secondary" size="40px" class="absolute-center" style="margin-left: -20px;"/>
    </div>
    <div v-if="dataLoaded" class="contain-main players">
      <q-card class="compact-card">
        <div class="row">
          <div class="col-6">
            <q-card-title>
              {{statusFilter === 'fa' ? 'Free Agents' : 'All Players'}}
            </q-card-title>
          </div>
          <div class="col-6 filter-button text-right">
            <q-btn @click="filterCollapse=!filterCollapse" class="bg-grey-3 text-primary" flat size="sm" round color="primary" icon="filter_list" />
          </div>
        </div>
        <q-collapsible v-model="filterCollapse" :header-style="'display: none;'" class="players-header">
          <div class="row small-pad">
            <q-btn
              v-for="(pos, index) in selectOptions"
              :key="index"
              flat
              size="md"
              rounded
              :label="pos.label"
              :class="[positionFilter.includes(pos.value) ? 'bg-primary text-white' : 'bg-grey-3 text-dark']"
              @click="togglePos(pos.value)"
            />
          </div>
          <div class="row small-pad">
            <div class="col-6">
              <q-btn @click.native="statusFilter = 'fa'" :class="[statusFilter === 'fa' ? 'bg-primary text-white' : 'bg-grey-3 text-dark', 'full-width']" flat size="md" rounded label="Free Agents" />
            </div>
            <div class="col-6">
              <q-btn @click.native="statusFilter = 'all'" :class="[statusFilter === 'all' ? 'bg-primary text-white' : 'bg-grey-3 text-dark', 'full-width']" flat size="md" rounded label="All Players" />
            </div>
          </div>
        </q-collapsible>
        <q-search
          hide-underline
          class="player-search-main"
          v-model="query"
          icon="search"
          inverted-light
          color="grey-2"
        />

        <div class="card-main bg-white relative-position no-overflow">
          <div class="q-table">
            <div class="row header-row border-bottom">
              <div @click="sort('projected')"  nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'projected'}">Proj</div>
              <div @click="sort('fpts')"  nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'fpts'}">FPts</div>
              <div @click="sort('added')" nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'added'}">% Added</div>
              <div @click="sort('owned')" nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'owned'}">% Owned</div>
              <div @click="sort('started')" nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'started'}">% Started</div>
              <div @click="sort('dropped')" nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'dropped'}">% Dropped</div>
            </div>
            <div
              class="border-bottom main-row"
              v-for="player in playersSorted"
              :key="player.id"
              :class="{'active': selectedPlayer === player.id}"
              @click="goToPlayer(player.id)"
            >
              <div class="row text-left col-pad name-row">
                <q-item separator class="col-12">
                  <q-btn v-if="faLookup[player.id] && faLookup[player.id].status !== 'locked'" round small outline color="primary" class="q-item-avatar action-btn">
                    <q-icon name="add" color="primary" size="18px"></q-icon>
                  </q-btn>
                  <q-icon v-if="!faLookup[player.id] || faLookup[player.id].status === 'locked'" class="q-item-avatar action-btn" name="lock_outline" color="primary" size="28px"></q-icon>
                  <q-item-side v-if="playerLookup[player.id].position !== 'Def'" :avatar="'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[player.id].cbs_id + '.jpg'" />
                  <q-item-side v-if="playerLookup[player.id].position === 'Def'" :avatar="'./statics/' + teamMap[playerLookup[player.id].team] + '.svg'" />
                  <div class="q-item-main q-item-section team-players">
                    <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}}. {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}}<small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
                    <div v-if="!playerLookup[player.id].team.toUpperCase().startsWith('FA') && !byeBool(player.id)" class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{matchupLookup[playerLookup[player.id].team].day}} {{matchupLookup[playerLookup[player.id].team].time}} - <span v-if="matchupPositions.indexOf(playerLookup[player.id].position) !== -1" :class="matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}} ({{matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rankPretty}})</span><span v-if="matchupPositions.indexOf(playerLookup[player.id].position) === -1">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}}</span></div>
                    <div v-if="byeBool(player.id)" class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">BYE</div>
                  </div>
                </q-item>
              </div>
              <div class="row stat-row">
                <div nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'projected'}">{{player.projected}}</div>
                <div nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'fpts'}">{{player.fpts}}</div>
                <div nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'added'}">{{player.added}}</div>
                <div nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'owned'}">{{player.owned}}</div>
                <div nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'started'}">{{player.started}}</div>
                <div nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'dropped'}">{{player.dropped}}</div>
              </div>
            </div>
            <div class=" row fa-table-footer">
              <div class="text-center text-primary col-12">
                <i>Load more</i>
                <q-btn @click="loadMore" class="load-more" round small color="primary" icon="keyboard_arrow_down"></q-btn>
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </div>
    <div
      :class="overlay ? 'overlay' : ''"
      @click="overlay = false"
    >
    </div>
  </q-pull-to-refresh>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'players',
  data () {
    return {
      dataLoaded: false,
      colSortKey: 'projected',
      limit: 10,
      query: '',
      queryColumn: 'name',
      positionFilter: [],
      statusFilter: 'fa',
      playersDetails: [],
      overlay: false,
      selectedPlayer: '',
      filterCollapse: false,
      statusOptions: [
        {
          label: 'All Players',
          value: 'all'
        },
        {
          label: 'Free Agents',
          value: 'fa'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'main/activeLeague',
      league: 'main/league',
      leagueData: 'main/leagueData',
      rosters: 'main/rosters',
      players: 'main/players',
      freeAgents: 'main/freeAgents',
      projectedScores: 'main/projectedScores',
      topAdds: 'main/topAdds',
      topOwns: 'main/topOwns',
      topDrops: 'main/topDrops',
      topStarters: 'main/topStarters',
      fullNflSchedule: 'main/fullNflSchedule',
      pointsAllowed: 'main/pointsAllowed',
      currentWeek: 'main/currentWeek',
      playerScores: 'main/playerScores',
      endWeek: 'main/endWeek',
      teamMap: 'main/teamMap'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    positionFilterTransform () {
      return this.positionFilter.map(item => item.toLowerCase())
    },
    playerLookup () {
      var array = this.players.player
      return this.lookup(array)
    },
    projectedLookup () {
      var array = this.projectedScores.playerScore
      return this.lookup(array)
    },
    ytdLookup () {
      var array = this.playerScores.playerScore
      return this.lookup(array)
    },
    faLookup () {
      var array = this.freeAgents.leagueUnit.player
      return this.lookup(array)
    },
    addedLookup () {
      var array = this.topAdds.player
      return this.lookup(array)
    },
    ownedLookup () {
      var array = this.topOwns.player
      return this.lookup(array)
    },
    droppedLookup () {
      var array = this.topDrops.player
      return this.lookup(array)
    },
    startedLookup () {
      var array = this.topStarters.player
      return this.lookup(array)
    },
    gamesPlayedBool () {
      var obj = this.pointsAllowed
      if (Object.keys(obj).length === 0 && obj.constructor === Object) {
        return false
      } else {
        return true
      }
    },
    matchupLookup () {
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
      var obj = {}
      this.fullNflSchedule.nflSchedule[this.currentWeek].matchup.forEach((el, i) => {
        var date = new Date(el.kickoff * 1000)
        obj[el.team[0].id] = {
          vs: el.team[1].id,
          day: days[date.getDay()],
          time: ((date.getHours() === 0) ? '00' : date.getHours()) + ':' + ((date.getMinutes() === 0) ? '00' : date.getMinutes()),
          location: ((el.team[0].isHome === '0') ? '@' : 'vs')
        }
        obj[el.team[1].id] = {
          vs: el.team[0].id,
          day: days[date.getDay()],
          time: ((date.getHours() === 0) ? '00' : date.getHours()) + ':' + ((date.getMinutes() === 0) ? '00' : date.getMinutes()),
          location: ((el.team[1].isHome === '0') ? '@' : 'vs')
        }
      })
      obj['FA*'] = {
        vs: 'FA',
        day: '',
        time: '',
        location: ''
      }
      obj['FA'] = {
        vs: 'FA',
        day: '',
        time: '',
        location: ''
      }
      return obj
    },
    playersSorted () {
      var list = this.playersDetails
      if (this.query) {
        list = this.findBy(list, this.query, this.queryColumn)
      }
      if (this.colSortKey) {
        list = this.order(list, this.colSortKey)
      }
      if (this.positionFilterTransform[0]) {
        list = this.filter(list, 'position', this.positionFilterTransform)
      }
      if (this.statusFilter === 'fa') {
        list = this.filter(list, 'status', ['fa'])
      }
      list = list.slice(0, this.limit)
      return list
    },
    matchupPoints () {
      var object = {}
      this.matchupPositions.forEach(el => {
        object[el] = this.matchupPointsUtil(el)
      })
      return object
    },
    matchupPositions () {
      var array = []
      this.pointsAllowed.team[0].position.slice(0).forEach(el => {
        array.push(el.name)
      })
      return array
    },
    selectOptions () {
      var array = []
      this.league.starters.position.slice(0).forEach(el => {
        var obj = {}
        obj['label'] = el.name
        obj['value'] = el.name
        array.push(obj)
      })
      return array
    }
  },
  methods: {
    goToPlayer (id) {
      this.selectedPlayer = id
      this.$router.push('/player/' + id)
    },
    lookup (array, key) {
      if (!key) {
        key = 'id'
      }
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    findBy (list, value, key) {
      return list.filter(function (el) {
        return value.toLowerCase().split(' ').every(x => String(el[key]).toLowerCase().includes(x))
      })
    },
    order (list, key) {
      return list.sort((a, b) => {
        var x = parseFloat(a[key]); var y = parseFloat(b[key])
        return ((x < y) ? 1 : ((x > y) ? -1 : 0))
      })
    },
    filter (list, key, value) {
      return list.filter(el => {
        return value.indexOf(el[key].toLowerCase()) !== -1
      })
    },
    sort (key) {
      this.colSortKey = key
    },
    loadMore () {
      this.limit += 10
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
      object['FA*'] = {
        points: '',
        rank: '',
        rankPretty: ''
      }
      object['FA'] = {
        points: '',
        rank: '',
        rankPretty: ''
      }
      return object
    },
    byeBool (id) {
      if (this.matchupLookup[this.playerLookup[id].team]) {
        return false
      } else {
        return true
      }
    },
    pluralize: function (value) {
      value = value.toString()
      if (value.endsWith('1')) {
        value = value.toString() + 'st'
      } else if (value.endsWith('2')) {
        value = value.toString() + 'nd'
      } else if (value.endsWith('3')) {
        value = value.toString() + 'rd'
      } else {
        value = value.toString() + 'th'
      }
      return value
    },
    refresher (done) {
      this.fetchData()
      done()
    },
    togglePos (val) {
      let list = this.positionFilter
      if (list.includes(val)) {
        list.splice(list.indexOf(val), 1)
      } else {
        list.push(val)
      }
      this.positionFilter = list
    },
    showDialog () {
      this.$q.dialog({
        title: 'Positions',
        message: 'Filter player list by position.',
        options: {
          type: 'checkbox',
          model: this.positionFilter,
          items: this.selectOptions
        },
        cancel: true
      }).then(data => {
        console.log(data)
        this.positionFilter = data
      }).catch(() => {
        console.log('canceled...')
      })
    },
    removeChip (chip) {
      var array = this.positionFilter
      var index = array.indexOf(chip)
      array.splice(index, 1)
    },
    loadPlayersDetails () {
      var list = []
      var playerArray = this.players.player
      playerArray.forEach(el => {
        if (this.matchupPositions.indexOf(this.playerLookup[el.id].position) !== -1) {
          var obj = {}
          obj['projected'] = (this.projectedLookup[el.id] && this.projectedLookup[el.id].score !== '' ? parseFloat(this.projectedLookup[el.id].score) : 0)
          obj['added'] = (this.addedLookup[el.id] ? parseFloat(this.addedLookup[el.id].percent) : 0)
          obj['owned'] = (this.ownedLookup[el.id] ? parseFloat(this.ownedLookup[el.id].percent) : 0)
          obj['dropped'] = (this.droppedLookup[el.id] ? parseFloat(this.droppedLookup[el.id].percent) : 0)
          obj['started'] = (this.startedLookup[el.id] ? parseFloat(this.startedLookup[el.id].percent) : 0)
          obj['name'] = this.playerLookup[el.id].name
          obj['team'] = this.playerLookup[el.id].team
          obj['position'] = this.playerLookup[el.id].position
          obj['fpts'] = (this.ytdLookup[el.id] ? this.ytdLookup[el.id].score : 0)
          obj['id'] = el.id
          obj['status'] = (this.faLookup[el.id] ? 'fa' : 'owned')
          list.push(obj)
        }
      })
      this.playersDetails = list
    },
    fetchData () {
      var requests = [
        'playerScores',
        'topDrops',
        'topStarters',
        'rosters',
        'freeAgents',
        'projectedScores',
        'topAdds',
        'topOwns',
        'fullNflSchedule',
        'pointsAllowed',
        'playerScores'
      ]

      this.$store.dispatch('main/API_REQUEST', { types: requests })
        .then((response) => {
          this.loadPlayersDetails()
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
    this.limit = 10
    this.selectedPlayer = ''
  }
}
</script>

<style lang="stylus" scoped>
@import '~variables'
.players .main-row
  padding 8px 0
.players .header-row
  font-weight 700
  text-align center
  padding 6px 0
.players .stat-row
  padding-top 6px
.players .q-table .q-item
  padding 0
.players .q-table .q-item-label
  font-weight 500
  font-size 14px
.players .q-table .q-item-sublabel
  font-weight 300
  font-size 12px
.players .q-table
  font-size 12px
  width 100%
.players .q-table .active
  background-color #ccc
.players .col-pad
  padding-left 12px!important
  padding-right 12px!important
.players .sortable span
  font-size 10px
.players .load-more
  margin-left calc(50% - 20px)
  margin-top 10px
  display block
.players .card-main.no-overflow
  overflow initial
.players .fa-table-footer
  font-size 14px
  font-weight 400
  width 100%
  padding 6px 0
.players.contain-main
  padding-bottom 82px
.players .players-spinner
  position relative
  left 50%
  margin 100px 0 100px -20px
.players .list-enter-active, .list-leave-active {
  transition: all 0.2s;
}
.players .list-enter, .list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.players .q-collapsible .q-item-division
  padding 5px 16px
.players .action-btn
  margin-right 20px
.players .q-if.player-search-main
  margin 0 16px 16px 16px
  border-radius 22px
  box-shadow none
.players .q-if
  margin 10px 0
.players .q-chip
  margin 2px
.filter-button
  padding 16px
.q-popover
  border-radius 10px
  box-shadow 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12)
.q-popover .q-item
  padding 2px 16px
  min-height: 36px
.q-popover .q-list-separator
  padding 0
.players-header .q-card-container
  padding 16px 0
.small-pad
  padding 4px 0
</style>
