<template>
  <q-layout ref="childLayout" view="hHh lpr fFf" class="thread-layout">
    <q-layout-header>
      <q-toolbar>
        <q-btn dense flat>
          <q-icon @click.native="$router.go(-1)" name="arrow_back" />
        </q-btn>
        <q-toolbar-title v-if="dataLoaded">
          {{teamLookup[activeThread].name}}
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-page-container>
      <div v-if="!dataLoaded" style="height: calc(100vh - 112px);">
        <q-spinner color="secondary" size="40px" class="absolute-center" style="margin-left: -20px;"/>
      </div>
      <q-pull-to-refresh
        :handler="refresher"
        v-if="dataLoaded"
      >
        <div v-if="!thread[0]" style="height: calc(100vh - 50px)">
          <div class="absolute-center text-center light-paragraph">
            Send<br>
            <span class="text-primary text-italic">{{teamLookup[activeThread].name}}</span><br>
            a message
          </div>
        </div>
        <q-chat-message
          v-for="msg in thread"
          :key="msg.id"
          :name="teamLookup[msg.franchise_id].name"
          :avatar="teamLookup[msg.franchise_id].icon ? teamLookup[msg.franchise_id].icon : './statics/avatar.jpg'"
          :text="[msg.message]"
          :stamp="msg.timestamp"
          :sent="msg.franchise_id === myTeam"
          :bg-color="msg.franchise_id === myTeam ? 'primary' : 'grey-3'"
          :text-color="msg.franchise_id === myTeam ? 'white' : 'dark'"
        />
      </q-pull-to-refresh>
    </q-page-container>
    <q-layout-footer>
      <q-input
        class="msg-input"
        v-model="msgInput"
        placeholder="Enter message"
        :after="[
          {
            icon: 'send',
            handler () {
              // do something...
            }
          }
        ]"
      />
    </q-layout-footer>
  </q-layout>
</template>

<script>
import {
  date,
  format
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'thread',
  data () {
    return {
      dataLoaded: false,
      error: false,
      msgInput: '',
      timer: '',
      activeThread: ''
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'main/activeLeague',
      leagueData: 'main/leagueData',
      league: 'main/league',
      chat: 'main/chat'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      var obj = this.lookup(array, 'id')
      obj['0000'] = {
        name: 'Commissioner'
      }
      obj['1000'] = {
        name: 'League Chat'
      }
      return obj
    },
    thread () {
      var chatArray = []
      const { pad } = format
      let timeStamp = Date.now()
      var today = date.formatDate(timeStamp, 'MMM DD')

      if (this.activeThread === '1000') {
        this.chat.message.forEach(el => {
          if (!el._attributes.to) {
            if (today === el._attributes.posted.split(' ')[1] + ' ' + pad(el._attributes.posted.split(' ')[2], 2)) {
              el._attributes['timestamp'] = el._attributes.posted.split(' ')[3].split(':')[0] + ':' + el._attributes.posted.split(' ')[3].split(':')[1] + ' ' + el._attributes.posted.split(' ')[4].split('.').join('')
            } else {
              el._attributes['timestamp'] = el._attributes.posted.split(' ')[1] + ' ' + el._attributes.posted.split(' ')[2]
            }
            chatArray.push(el._attributes)
          }
        })
      } else {
        this.chat.message.forEach(el => {
          if (el._attributes.to && (el._attributes.franchise_id === this.activeThread || el._attributes.to === this.activeThread)) {
            if (today === el._attributes.posted.split(' ')[1] + ' ' + pad(el._attributes.posted.split(' ')[2], 2)) {
              el._attributes['timestamp'] = el._attributes.posted.split(' ')[3].split(':')[0] + ':' + el._attributes.posted.split(' ')[3].split(':')[1] + ' ' + el._attributes.posted.split(' ')[4].split('.').join('')
            } else {
              el._attributes['timestamp'] = el._attributes.posted.split(' ')[1] + ' ' + el._attributes.posted.split(' ')[2]
            }
            chatArray.push(el._attributes)
          }
        })
      }

      return chatArray.reverse()
    }
  },
  methods: {
    refresher (done) {
      done()
    },
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    fetchData () {
      const host = this.leagueData[this.activeLeague].host
      const cookie = this.leagueData[this.activeLeague].cookie
      const league = this.activeLeague

      this.$store.dispatch('main/GET_CHATS', { host: host, cookie: cookie, league: league })
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
  activated () {
    this.activeThread = this.$route.params.id
    setTimeout(this.fetchData, 500)
  }
}
</script>

<style lang="stylus" scoped>
.thread-layout .msg-input
  margin-bottom 0px
  margin-top 0px
  padding-bottom 14px
  padding-top 14px
  padding-right 6px
  padding-left 6px
  background-color #fff
.thread-layout
  background-color #fff
</style>
