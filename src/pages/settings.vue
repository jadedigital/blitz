<template>
  <q-layout ref="childLayout" view="hHh lpr fFf" class="settings-layout">
    <q-layout-header>
      <q-toolbar>
        <q-btn dense flat>
          <q-icon @click.native="$router.go(-1)" name="arrow_back" />
        </q-btn>
        <q-toolbar-title>
          Settings
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-page-container>
      <q-list no-border link separator sparse>
        <q-item @click.native="$router.push('/settings/general')">
          <q-item-side color="primary" icon="mdi-settings" />
          <q-item-main label="General" />
        </q-item>
        <q-item>
          <q-item-side color="primary" icon="mdi-football-helmet" />
          <q-item-main label="Team customization" />
        </q-item>
        <q-item>
          <q-item-side color="primary" icon="mdi-bell" />
          <q-item-main label="Notifications" />
        </q-item>
        <q-item>
          <q-item-side color="primary" icon="mdi-palette" />
          <q-item-main label="Theme customization" />
        </q-item>
      </q-list>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'settings'
}
</script>

<style lang="stylus" scoped>
.settings-layout
  background-color #fff
</style>
