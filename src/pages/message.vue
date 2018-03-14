<template>
  <q-layout ref="childLayout" view="hHh lpr fFf" class="message">
    <q-layout-header>
      <q-toolbar>
        <q-btn dense flat>
          <q-icon @click.native="$router.go(-1)" name="arrow_back" />
        </q-btn>
        <q-toolbar-title>
          {{currentMsgThread.title}}
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
        <q-chat-message
          v-for="(msg, key) in msgPretty"
          :key="key"
          :name="teamLookup[msg.franchise].name"
          :avatar="teamLookup[msg.franchise].icon ? teamLookup[msg.franchise].icon : './statics/avatar.jpg'"
          :text="[msg.body]"
          :stamp="msg.weekday"
          :sent="msg.franchise === myTeam"
          :bg-color="msg.franchise === myTeam ? 'secondary' : 'grey-3'"
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
import { mapGetters } from 'vuex'

export default {
  name: 'message',
  data () {
    return {
      dataLoaded: false,
      msgInput: '',
      timer: ''
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'main/activeLeague',
      leagueData: 'main/leagueData',
      currentMsgThread: 'main/currentMsgThread',
      messageBoardThread: 'main/messageBoardThread',
      league: 'main/league'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    msgPretty () {
      var locale = 'en-us'
      var array = []
      var msgArray = []
      var obj = {}
      if (!Array.isArray(this.messageBoardThread.post)) {
        msgArray.push(this.messageBoardThread.post)
      } else {
        msgArray = this.messageBoardThread.post
      }
      msgArray.forEach(el => {
        var date = new Date(el.postTime * 1000)
        obj = {
          franchise: el.franchise,
          weekday: date.toLocaleString(locale, { weekday: 'short' }),
          day: date.toLocaleString(locale, { day: 'numeric' }),
          month: date.toLocaleString(locale, { month: 'short' }),
          body: el.body
        }
        array.push(obj)
      })
      return array
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      var obj = this.lookup(array, 'id')
      obj['0000'] = {
        name: 'Commissioner'
      }
      return obj
    }
  },
  methods: {
    refresher (done) {
      this.fetchData()
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
      var requests = [
        'messageBoardThread'
      ]

      this.$store.dispatch('main/API_REQUEST', { types: requests, thread: this.$route.params.id })
        .then((response) => {
          this.dataLoaded = true
        })
    }
  },
  activated () {
    setTimeout(this.fetchData, 500)
    this.timer = setInterval(this.fetchData, 5000)
  },
  deactivated () {
    clearInterval(this.timer)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="stylus">
.message .msg-input
  margin-bottom 0px
  margin-top 0px
  padding-bottom 14px
  padding-top 14px
  padding-right 6px
  padding-left 6px
  background-color #fff
.message
  background-color #fff
</style>
