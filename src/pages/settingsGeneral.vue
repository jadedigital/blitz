<template>
  <q-layout ref="childLayout" view="hHh lpr lFf" class="settings-layout">
    <q-layout-header>
      <q-toolbar>
        <q-btn dense flat>
          <q-icon @click.native="$router.go(-1)" name="arrow_back" />
        </q-btn>
        <q-toolbar-title>
          General Settings
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-page-container>
      <q-list no-border link separator sparse>
        <q-item @click.native="showDialog">
          <q-item-side color="primary" icon="mdi-table-row" />
          <q-item-main>Navbar Items</q-item-main>
        </q-item>
        <q-item tag="label">
          <q-item-side color="primary" :icon="settings.toolbarHide ? 'mdi-eye-off' : 'mdi-eye'" />
          <q-item-main>
            <q-item-tile label>Hide Toolbar on Scroll</q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-toggle v-model="toolbarHide" />
          </q-item-side>
        </q-item>
      </q-list>
    </q-page-container>
    <q-layout-footer>
      <q-tabs v-if="navbarModalOpen" inverted class="bg-white main-nav">
        <q-tab v-if="settings.navbar.includes('team')" exact slot="title" icon="mdi-football-helmet" label="My Team" />
        <q-tab v-if="settings.navbar.includes('league')" exact slot="title" icon="mdi-trophy-variant" label="League" />
        <q-tab v-if="settings.navbar.includes('matchup')" exact slot="title" icon="mdi-shield-half-full" label="Matchup"/>
        <q-tab v-if="settings.navbar.includes('players')" exact slot="title" icon="mdi-account-multiple" label="Players"/>
        <q-tab v-if="settings.navbar.includes('chat')" exact slot="title" icon="mdi-forum" label="Chat"/>
        <q-tab v-if="settings.navbar.includes('draft')" exact slot="title" icon="view_comfy" label="Draft"/>
        <q-tab v-if="settings.navbar.includes('polls')" exact slot="title" icon="mdi-poll" label="Polls"/>
      </q-tabs>
    </q-layout-footer>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'settingsGeneral',
  data () {
    return {
      navbarModalOpen: false,
      toolbarHide: false,
      navbar: [],
      navbarItems: [
        {label: 'Team', value: 'team'},
        {label: 'League', value: 'league'},
        {label: 'Matchup', value: 'matchup'},
        {label: 'Players', value: 'players'},
        {label: 'Chat', value: 'chat'},
        {label: 'Draft', value: 'draft'},
        {label: 'Polls', value: 'polls'}
      ]
    }
  },
  watch: {
    toolbarHide (newValue, oldValue) {
      let settingsNew = this.settings
      settingsNew['toolbarHide'] = newValue
      console.log(settingsNew)
      this.$store.commit('main/SET_DATA', {type: 'settings', data: settingsNew})
    },
    navbar (newArray) {
      let settingsNew = this.settings
      settingsNew['navbar'] = newArray
      console.log(settingsNew)
      this.$store.commit('main/SET_DATA', {type: 'settings', data: settingsNew})
    }
  },
  computed: {
    ...mapGetters({
      settings: 'main/settings'
    })
  },
  methods: {
    showDialog () {
      this.navbarModalOpen = true
      this.$q.dialog({
        title: 'Navigation Bar Items',
        message: 'Select items to show/hide',
        options: {
          type: 'toggle',
          model: this.navbar,
          items: this.navbarItems
        },
        cancel: true
      }).then(data => {
        console.log(data)
        this.navbarModalOpen = false
        this.navbar = data
      }).catch(() => {
        console.log('canceled...')
        this.navbarModalOpen = false
      })
    }
  },
  created () {
    this.toolbarHide = this.settings.toolbarHide
    const navbarCache = [...this.settings.navbar]
    this.navbar = navbarCache
  }
}
</script>

<style lang="stylus" scoped>
@import '~variables'
.settings-layout
  background-color #fff
.settings-modal .list-item
  padding 10px
.settings-modal .modal-content
  padding 10px 25px
  border-radius 16px
.q-tab
  font-size 10px
  padding 0
  min-height 62px
.q-tab.icon-and-label
  padding 0
  min-height 62px
.q-tabs-inverted .q-tabs-scroller
  color #555
.q-tab.active
  color #3d5afe
.settings-modal.fullscreen
  bottom 62px
.settings-modal .modal-header
  font-size 18px
  font-weight 500
  padding 10px 0
  color $grey-7
</style>
