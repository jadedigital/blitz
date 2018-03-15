<template>
  <q-layout ref="childLayout" view="hHh lpr fFf" class="otherMatchup">
    <q-layout-header>
      <q-toolbar>
        <q-btn dense flat>
          <q-icon @click.native="$router.go(-1)" name="arrow_back" />
        </q-btn>
        <q-toolbar-title>
          Matchup
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-page-container>
      <div v-if="!dataLoaded" style="height: calc(100vh - 50px)">
        <q-spinner color="secondary" size="40px" class="absolute-center" style="margin-left: -20px;"/>
      </div>
      <q-pull-to-refresh v-if="dataLoaded" :handler="refresher" class="matchup">
        <blitz-matchup :teamA="teamA" :teamB="teamB"/>
      </q-pull-to-refresh>
    </q-page-container>
  </q-layout>
</template>

<script>
import blitzMatchup from '../components/blitzMatchup.vue'

export default {
  name: 'matchup',
  components: {
    blitzMatchup
  },
  data () {
    return {
      dataLoaded: false,
      teamA: '',
      teamB: ''
    }
  },
  methods: {
    refresher (done) {
      done()
    },
    loadData () {
      this.dataLoaded = true
    }
  },
  activated () {
    this.teamA = this.$route.params.teamA
    this.teamB = this.$route.params.teamB
    setTimeout(this.loadData, 500)
  },
  deactivated () {
    this.dataLoaded = false
  }
}
</script>

<style lang="stylus" scoped>
.otherMatchup
  background-color #fff
</style>
