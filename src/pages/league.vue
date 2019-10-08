<template>
  <q-pull-to-refresh :handler="refresher" class="league">
    <div v-if="!dataLoaded" style="height: calc(100vh - 112px)">
      <q-spinner color="secondary" size="40px" class="absolute-center" style="margin-left: -20px;"/>
    </div>
    <div v-if="error" style="height: calc(100vh - 112px)">
      <div class="absolute-center text-center light-paragraph">
        Can't fetch data.<br>
        Try again later.
      </div>
    </div>
    <q-tabs v-if="dataLoaded && !error" inverted class="secondary-tabs">
      <!-- Tabs - notice slot="title" -->
      <q-tab
        default
        slot="title"
        name="tab-1"
        label="Standings"
      />
      <q-tab
        slot="title"
        name="tab-2"
        label="Transactions"
      />
      <q-tab
        slot="title"
        name="tab-3"
        label="Message Board"
      />
      <!-- Targets -->
      <div class="contain-main bg-white">
        <q-tab-pane keep-alive class="no-pad no-border standings" name="tab-1">
          <q-card class="compact-card bg-white" v-for="(division, key) in standings" :key="key">
            <q-card-title>
              {{divisionLookup[key].name}}
            </q-card-title>
            <q-card-separator />
            <div class="card-main bg-white">
              <div class="q-table horizontal-separator">
                <div class="row header-row border-bottom">
                  <div @click="sort(key, 'rank', -1)" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'rank'}">W-L-T</div>
                  <div @click="sort(key, 'streakSort', -1)" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'streakSort'}">Streak</div>
                  <div @click="sort(key, 'pf', -1)" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'pf'}">PF</div>
                  <div @click="sort(key, 'pa', -1)" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'pa'}">PA</div>
                  <div v-if="teamLookup['0001'].bbidAvailableBalance" @click="sort(key, 'budget', -1)" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'budget'}">Budget</div>
                  <div v-if="teamLookup['0001'].waiverSortOrder" @click="sort(key, 'waiver', -1)" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'waiver'}">Waiver</div>
                  <div v-if="league.divisions.count > 1" @click="sort(key, 'divw', -1)" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'divw'}">Division</div>
                </div>
                <div
                  class="border-bottom main-row"
                  v-for="team in division"
                  :key="team.id"
                  :class="{'active': selectedTeam === team.id}"
                  @click="goToTeam(team.id)"
                >
                  <div class="row text-left col-pad name-row">
                    <q-item separator class="col-12">
                      <div class="rank">{{team.rank}}</div>
                      <q-item-side v-if="teamLookup[team.id].icon" :avatar="teamLookup[team.id].icon"/>
                      <q-btn v-else round small style="font-size: 14px; font-weight:400; height: 38px; width: 38px;" class="q-btn-outline bg-white text-primary q-item-avatar q-item-section">{{ teamLookup[team.id].owner_name ? teamLookup[team.id].owner_name[0] : teamLookup[team.id].name[0] }}</q-btn>
                      <q-item-main :label="teamLookup[team.id].name" :sublabel="teamLookup[team.id].owner_name" />
                    </q-item>
                  </div>
                  <div class="row stat-row">
                    <div nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'rank'}">{{team.h2hw}}-{{team.h2hl}}-{{team.h2ht}}</div>
                    <div nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'streakSort'}">{{team.streak_type ? team.streak_type + team.streak_len : '-'}}</div>
                    <div nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'pf'}">{{team.pf}}</div>
                    <div nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'pa'}">{{team.pa ? team.pa : 0}}</div>
                    <div v-if="teamLookup[team.id].bbidAvailableBalance" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'budget'}">{{teamLookup[team.id].bbidAvailableBalance}}</div>
                    <div v-if="teamLookup[team.id].waiverSortOrder" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'waiver'}">{{teamLookup[team.id].waiverSortOrder}}</div>
                    <div v-if="league.divisions.count > 1" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'divw'}">{{team.divw ? team.divw : 0}}-{{team.divl ? team.divl : 0}}-{{team.divt ? team.divt : 0}}</div>
                  </div>
                </div>
              </div>
            </div>
          </q-card>
        </q-tab-pane>
        <q-tab-pane
          keep-alive
          class="no-pad no-border transactions"
          name="tab-2"
        >
          <div v-if="transactionPretty">
            <div v-for="(move, key) in transactionPretty" :key="key">
              <q-item v-if="move.franchise" separator class="team-name-main">
                <q-item-side :avatar="teamLookup[move.franchise].icon ? teamLookup[move.franchise].icon : './statics/avatar.jpg'" />
                <q-item-main>
                  <q-item-tile sublabel class="text-primary">{{move.type.replace('_', ' ')}}<span class="text-tertiary" v-if="move.price"> - ${{move.price}}</span></q-item-tile>
                  <q-item-tile label>{{teamLookup[move.franchise].name}}</q-item-tile>
                  <q-item-tile class="move" v-if="move.type === 'IR'">
                    <span v-if="move.activated">Activated: </span>
                    <span v-for="(player, key2) in move.activated" :key="key2">{{playerLookup[player] ? playerLookup[player].name.split(', ').reverse().join(' ') : ''}}<span v-if="move.activated[key2 + 1]">, </span></span>
                  </q-item-tile>
                  <q-item-tile class="move" v-if="move.type === 'IR'">
                    <span v-if="move.deactivated">Deactivated: </span>
                    <span v-for="(player, key2) in move.deactivated" :key="key2">{{playerLookup[player] ? playerLookup[player].name.split(', ').reverse().join(' ') : ''}}<span v-if="move.deactivated[key2 + 1]">, </span></span>
                  </q-item-tile>
                  <q-item-tile class="move" v-if="move.added && move.added[0] !== ''">
                    <span>Added: </span>
                    <span v-for="(player, key2) in move.added" :key="key2">{{playerLookup[player] ? playerLookup[player].name.split(', ').reverse().join(' ') : ''}}<span v-if="move.added[key2 + 1]">, </span></span>
                  </q-item-tile>
                  <q-item-tile class="move" v-if="move.dropped && move.dropped[0] !== ''">
                    <span>Dropped: </span>
                    <span v-for="(player, key2) in move.dropped" :key="key2">{{playerLookup[player] ? playerLookup[player].name.split(', ').reverse().join(' ') : ''}}<span v-if="move.dropped[key2 + 1]">, </span></span>
                  </q-item-tile>
                </q-item-main>
                <q-item-side right>
                  {{move.weekday}}, {{move.month}} {{move.day}}
                </q-item-side>
              </q-item>
            </div>
          </div>
        </q-tab-pane>
        <q-tab-pane
          keep-alive
          class="no-pad no-border msg-board"
          name="tab-3"
        >
          <q-list highlight v-if="msgBoardPretty">
            <q-item
              v-for="chat in msgBoardPretty"
              :key="chat.id"
              @click.native="goToMsg(chat.id, chat.subject)"
            >
              <q-item-side :avatar="teamLookup[chat.franchise_id].icon ? teamLookup[chat.franchise_id].icon : './statics/avatar.jpg'" />
              <q-item-main :label="chat.subject" :sublabel="teamLookup[chat.franchise_id].name" />
              <q-item-side right>
                <q-item-tile>
                  {{chat.weekday}}, {{chat.month}} {{chat.day}}
                </q-item-tile>
              </q-item-side>
            </q-item>
          </q-list>
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn
              round
              icon="edit"
              size="lg"
              class="bg-tertiary shadow-5 text-white"
              @click="$router.push('/newmessage')"
            />
          </q-page-sticky>
        </q-tab-pane>
      </div>
    </q-tabs>
  </q-pull-to-refresh>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'league',
  data () {
    return {
      response: null,
      error: false,
      colSortKeys: {},
      colSortOrders: {},
      dataLoaded: false,
      selectedTeam: ''
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'main/activeLeague',
      leagueData: 'main/leagueData',
      rosters: 'main/rosters',
      players: 'main/players',
      leagueStandings: 'main/leagueStandings',
      league: 'main/league',
      transactions: 'main/transactions',
      messageBoard: 'main/messageBoard'
    }),
    standings () {
      var obj = {}
      var array = []
      var index = ''
      this.league.divisions.division.forEach(el => {
        index = 1
        this.leagueStandings.franchise.forEach(el2 => {
          if (this.teamLookup[el2.id].division === el.id) {
            el2['rank'] = index
            el2['budget'] = this.teamLookup[el2.id].bbidAvailableBalance
            el2['waiver'] = this.teamLookup[el2.id].waiverSortOrder
            if (el2.streak_type === 'L') {
              el2['streakSort'] = el2.streak_len * -1
            } else {
              el2['streakSort'] = el2.streak_len
            }
            array.push(el2)
            index += 1
          }
        })
        array = this.order(array, this.colSortKeys[el.id], this.colSortOrders[el.id])
        obj[el.id] = array
        array = []
      })
      return obj
    },
    transactionPretty () {
      var locale = 'en-us'
      var array = []
      var transArray = []
      var obj = {}
      if (this.transactions.transaction) {
        if (!Array.isArray(this.transactions.transaction)) {
          transArray.push(this.transactions.transaction)
        } else {
          transArray = this.transactions.transaction
        }
        transArray.forEach(el => {
          var date = new Date(el.timestamp * 1000)
          obj = {
            franchise: el.franchise,
            type: el.type,
            transaction: el.transaction,
            weekday: date.toLocaleString(locale, { weekday: 'short' }),
            day: date.toLocaleString(locale, { day: 'numeric' }),
            month: date.toLocaleString(locale, { month: 'short' }),
            activated: el.activated ? el.activated.split(',') : '',
            deactivated: el.deactivated ? el.deactivated.split(',') : '',
            added: el.transaction ? el.transaction.split('|').slice(0, 1).join().split(',') : '',
            dropped: el.transaction ? el.transaction.split('|').slice(-1).join().split(',') : '',
            price: el.type === 'BBID_WAIVER' ? el.transaction.split('|').slice(1, 2).join() : ''
          }
          array.push(obj)
        })
      }
      return array
    },
    msgBoardPretty () {
      var locale = 'en-us'
      var array = []
      var msgArray = []
      var obj = {}
      if (this.messageBoard.thread) {
        if (!Array.isArray(this.messageBoard.thread)) {
          msgArray.push(this.messageBoard.thread)
        } else {
          msgArray = this.messageBoard.thread
        }
        msgArray.forEach(el => {
          var date = new Date(el.lastPostTime * 1000)
          obj = {
            franchise_id: el.franchise_id,
            weekday: date.toLocaleString(locale, { weekday: 'short' }),
            day: date.toLocaleString(locale, { day: 'numeric' }),
            month: date.toLocaleString(locale, { month: 'short' }),
            subject: el.subject,
            id: el.id
          }
          array.push(obj)
        })
      }
      return array
    },
    playerLookup () {
      var array = this.players.player
      return this.lookup(array, 'id')
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      var obj = this.lookup(array, 'id')
      obj['0000'] = {
        name: 'Commissioner'
      }
      return obj
    },
    divisionLookup () {
      var array = this.league.divisions.division
      return this.lookup(array, 'id')
    }
  },
  watch: {
    activeLeague: function () {
      this.fetchStandings()
    }
  },
  methods: {
    order (list, key, order) {
      return list.sort((a, b) => {
        var x = a[key]; var y = b[key]
        return ((x < y) ? 1 : ((x > y) ? -1 : 0)) * order
      })
    },
    sort (id, key, order) {
      this.colSortKeys[id] = key
      this.colSortOrders[id] = this.colSortOrders[id] * order
    },
    refresher (done) {
      this.fetchStandings()
      done()
    },
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    goToMsg (id, title) {
      this.$store.commit('main/SET_DATA', {type: 'currentMsgThread', data: {id: id, title: title}})
      this.$router.push('/message/' + id)
    },
    goToTeam (team) {
      window.scrollTo(0, 0)
      this.selectedTeam = team
      this.$router.push('/team/' + team)
    },
    fetchStandings () {
      var requests = [
        'transactions',
        'messageBoard',
        'rosters',
        'leagueStandings'
      ]
      this.$store.dispatch('main/API_REQUEST', { types: requests })
        .then((response) => {
          this.dataLoaded = true
          this.error = false
        })
        .catch(() => {
          this.dataLoaded = true
          this.error = true
        })
    }
  },
  created () {
    setTimeout(this.fetchStandings, 500)
  },
  activated () {
    this.selectedTeam = ''
  },
  mounted () {
    this.league.divisions.division.forEach(el => {
      this.$set(this.colSortKeys, el.id, 'rank')
      this.$set(this.colSortOrders, el.id, -1)
    })
  }
}
</script>

<style lang="stylus" scoped>
.league .rank
  padding-right 12px
  font-weight 500
.league .q-item
  font-weight 500
  font-size 14px
.league .q-item-sublabel
  font-weight 300
  font-size 12px
.league .transactions .q-item-sublabel
  font-weight 400
  font-size 12px
.league .transactions .move
  font-size 12px
.league .q-item .price
  font-weight 500
  font-size 14px
.league .msg-board .q-list
  border 0
.league .main-row
  padding 8px 0
.league .name-row
  padding 0 10px
.league .header-row
  font-weight 700
  text-align center
  padding 6px 0
.league .stat-row
  padding-top 6px
.league .q-table .q-item
  padding 0
.league .q-table
  font-size 12px
  width 100%
.league .q-table .active
  background-color #ccc
</style>
