<template>
  <q-pull-to-refresh class="chat-layout">
    <div v-if="!dataLoaded" style="height: calc(100vh - 112px)">
      <q-spinner color="secondary" size="40px" class="absolute-center" style="margin-left: -20px;"/>
    </div>
    <div v-if="dataLoaded" class="contain-main bg-white">
      <q-list link class="no-padding">
        <q-card class="compact-card bg-white">
          <q-card-title>
            League Chat
          </q-card-title>
          <q-item
            link
            @click.native="goToThread('1000')"
          >
            <div class="q-item-side q-item-side-left q-item-section">
              <div :style="logoUrl" class="q-item-avatar"></div>
            </div>
            <q-item-main
              class="ellipses"
              :label="league.name"
              :sublabel="leagueChat[0] ? (leagueChat[0].franchise_id === myTeam ? 'You' : teamLookup[leagueChat[0].franchise_id].owner_name.split(' ')[0]) + ': ' + leagueChat[0].message : 'Start a chat'"
              :sublabel-lines="1"
              />
            <q-item-side right>
              <q-item-tile class="text-dark">
                {{leagueChat[0] ? leagueChat[0].timestamp : ''}}
              </q-item-tile>
            </q-item-side>
          </q-item>
          <q-card-title>
            Other Chats
          </q-card-title>
          <q-item
            link
            v-for="chat in franchiseList"
            :key="chat.id"
            @click.native="goToThread(chat.id)"
          >
            <q-item-side v-if="chat.icon" :avatar="chat.icon" />
            <q-btn v-else round small style="font-size: 14px; font-weight:400; height: 38px; width: 38px;" class="q-btn-outline bg-white text-primary q-item-avatar q-item-section">{{ chat.owner_name ? chat.owner_name[0] : chat.name[0] }}</q-btn>
            <q-item-main
              class="ellipses"
              :label="chat.name"
              :sublabel="chatList[chat.id][0] ? (chatList[chat.id][0].franchise_id === myTeam ? 'You' : teamLookup[chatList[chat.id][0].franchise_id].owner_name.split(' ')[0]) + ': ' + chatList[chat.id][0].message : 'Start a chat'"
              :sublabel-lines="1"
              />
            <q-item-side right>
              <q-item-tile class="text-dark">
                {{chat.timestamp}}
              </q-item-tile>
            </q-item-side>
          </q-item>
        </q-card>
      </q-list>
    </div>
  </q-pull-to-refresh>
</template>

<script>
import {
  date,
  format
} from 'quasar'
import { arrayCheck } from '../plugins/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'chat',
  data () {
    return {
      response: null,
      dataLoaded: false,
      error: false,
      newWeek: '',
      search: '',
      monthMap: {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12'
      },
      timeMap: {
        'a.m.': '1',
        'p.m.': '2'
      }
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'main/activeLeague',
      leagueData: 'main/leagueData',
      league: 'main/league',
      chat: 'main/chat',
      token: 'main/token'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      var obj = this.lookup(array, 'id')
      obj['0000'] = {
        name: 'Commissioner',
        owner_name: 'Commish'
      }
      obj['1000'] = {
        name: 'League Chat'
      }
      return obj
    },
    chatLoopable () {
      const chatLoopable = arrayCheck(this.chat.message)
      return chatLoopable
    },
    chatList () {
      var chatList = {}
      var chatArray = []
      var commish = {
        id: '0000',
        name: 'Commissioner'
      }
      const franchiseArray = [...this.league.franchises.franchise]

      franchiseArray.unshift(commish)
      franchiseArray.forEach(el => {
        if (this.chat.message) {
          const chatLoopable = arrayCheck(this.chat.message)
          chatLoopable.forEach(el2 => {
            if (el2._attributes.to && (el2._attributes.franchise_id === el.id || el2._attributes.to === el.id)) {
              chatArray.push(el2._attributes)
            }
          })
        }
        chatList[el.id] = chatArray
        chatArray = []
      })

      return chatList
    },
    leagueChat () {
      const { pad } = format
      let timeStamp = Date.now()
      var today = date.formatDate(timeStamp, 'MMM DD')
      var chatArray = []

      if (this.chat.message) {
        const chatLoopable = arrayCheck(this.chat.message)
        chatLoopable.forEach(el => {
          if (!el._attributes.to) {
            chatArray.push(el._attributes)
          }
        })
      }
      if (chatArray[0]) {
        if (today === chatArray[0].posted.split(' ')[1] + ' ' + pad(chatArray[0].posted.split(' ')[2], 2)) {
          chatArray[0]['timestamp'] = chatArray[0].posted.split(' ')[3].split(':')[0] + ':' + chatArray[0].posted.split(' ')[3].split(':')[1] + ' ' + chatArray[0].posted.split(' ')[4].split('.').join('')
        } else {
          chatArray[0]['timestamp'] = chatArray[0].posted.split(' ')[1] + ' ' + chatArray[0].posted.split(' ')[2]
        }
      }
      return chatArray
    },
    franchiseList () {
      const { pad } = format
      let timeStamp = Date.now()
      var today = date.formatDate(timeStamp, 'MMM DD')

      var commish = {
        id: '0000',
        name: 'Commissioner'
      }
      const franchiseArray = [...this.league.franchises.franchise]
      franchiseArray.unshift(commish)
      franchiseArray.splice(franchiseArray.findIndex(this.matchesMyTeam), 1)
      franchiseArray.forEach(el => {
        if (this.chatList[el.id][0]) {
          el['latest'] = parseInt(this.chatList[el.id][0].posted.split(' ')[6] + this.monthMap[this.chatList[el.id][0].posted.split(' ')[1]] + pad(this.chatList[el.id][0].posted.split(' ')[2], 2) + this.timeMap[this.chatList[el.id][0].posted.split(' ')[4]] + pad(this.chatList[el.id][0].posted.split(' ')[3].split(':')[0], 2) + this.chatList[el.id][0].posted.split(' ')[3].split(':')[1] + this.chatList[el.id][0].posted.split(' ')[3].split(':')[2])

          if (today === this.chatList[el.id][0].posted.split(' ')[1] + ' ' + pad(this.chatList[el.id][0].posted.split(' ')[2], 2)) {
            el['timestamp'] = this.chatList[el.id][0].posted.split(' ')[3].split(':')[0] + ':' + this.chatList[el.id][0].posted.split(' ')[3].split(':')[1] + ' ' + this.chatList[el.id][0].posted.split(' ')[4].split('.').join('')
          } else {
            el['timestamp'] = this.chatList[el.id][0].posted.split(' ')[1] + ' ' + this.chatList[el.id][0].posted.split(' ')[2]
          }
        } else {
          el['latest'] = 0
        }
      })
      var franchiseArraySorted = this.order(franchiseArray, 'latest')
      return franchiseArraySorted
    },
    logoUrl () {
      let url = this.league.leagueLogo ? this.league.leagueLogo : './statics/blitz-logo.svg'
      var style = {
        background: 'url(' + url + ') center no-repeat',
        backgroundSize: 'cover'
      }
      return style
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
    matchesMyTeam (el) {
      return el.id === this.myTeam
    },
    order (list, key) {
      return list.sort((a, b) => {
        var x = parseFloat(a[key]); var y = parseFloat(b[key])
        return ((x < y) ? 1 : ((x > y) ? -1 : 0))
      })
    },
    goToThread (id) {
      this.$router.push('/thread/' + id)
    },
    refresher (done) {
      this.fetchData()
      done()
    },
    fetchData () {
      const host = this.leagueData[this.activeLeague].host
      const cookie = this.token
      const league = this.activeLeague

      this.$store.dispatch('main/GET_CHATS', { host: host, cookie: cookie, league: league })
        .then((response) => {
          this.dataLoaded = true
          this.error = false
        })
        .catch(() => {
          console.log('peek')
          this.dataLoaded = true
          this.error = true
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
.chat-layout .q-list
  border none
.chat-layout .q-item-side-right
  font-size 12px
  min-width 52px
.chat-layout .q-item-sublabel
  font-size 14px
</style>
