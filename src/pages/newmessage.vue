<template>
  <q-layout ref="childLayout" view="hHh lpr fFf" class="newmessage">
    <q-layout-header>
      <q-toolbar>
        <q-btn dense flat>
          <q-icon @click.native="$router.go(-1)" name="arrow_back" />
        </q-btn>
        <q-toolbar-title>
          New Message
        </q-toolbar-title>
        <q-btn flat>
          <q-icon name="send" />
        </q-btn>
      </q-toolbar>
    </q-layout-header>
    <q-page-container>
      <q-input
        class="msg-input"
        v-model="subject"
        placeholder="Subject"
        ref="subject"
      />
      <q-input
        class="msg-body"
        v-model="body"
        type="textarea"
        placeholder="Enter message"
        rows="5"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'newmessage',
  data () {
    return {
      body: '',
      subject: ''
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'main/activeLeague',
      leagueData: 'main/leagueData'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    }
  },
  methods: {
    focus () {
      this.$refs.subject.focus()
    }
  },
  activated () {
    setTimeout(this.focus, 500)
  }
}
</script>

<style lang="stylus" scoped>
.newmessage .msg-input
  margin-bottom 0px
  margin-top 0px
  padding-bottom 14px
  padding-top 14px
  padding-right 6px
  padding-left 6px
  background-color #fff
.newmessage .msg-body
  padding-right 6px
  padding-left 6px
  padding-top 14px
.newmessage
  background-color #fff
</style>
