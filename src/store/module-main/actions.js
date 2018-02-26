/*
export const someAction = (state) => {
}
*/
export const LOGIN = ({ dispatch, commit }, payload) => {
  var userParams = {
    USERNAME: payload.username,
    PASSWORD: payload.password
  }
  var url = 'https://keepersync.com/auth/mfl'
  this.$axios.get(url, {
    params: userParams
  })
    .then((response) => {
      var array = []
      var data = response.data.leagues
      if (!Array.isArray(data)) {
        array.push(data)
      }
      else {
        array = data
      }
      array.forEach(el => {
        var str = el.league.url
        var host = str.substring(str.lastIndexOf('//') + 2, str.indexOf('.'))
        var leagueId = str.substring(str.lastIndexOf('/') + 1)
        var leagueData = {}
        leagueData[leagueId] = {cookie: response.data.cookie, host: host, teamId: el.league.franchise_id}  
      })
      
      commit('SET_DATA', {type: 'activeLeague', data: array[0].league.url.substring(str.lastIndexOf('/') + 1)})
      commit('SET_DATA', {type: 'leagueData', data: leagueData})
      return getLeagueData()
    })
    .then((response) => {
      this.lastWeek = parseFloat(response.league.endWeek)
      return getWeek()
    })
    .then((response) => {
      console.log('week = ' + response)
      var week = Math.min(response, this.lastWeek)
      console.log('last week = ' + week)
      LocalStorage.set('currentWeek', week)
      var time = Date.now()
      LocalStorage.set('currentWeek_time', time)
      this.$store.commit('SET_DATA', {type: 'currentWeek', data: week})
      return callApi(week)
    })
    .then(() => {
      this.$router.push('user/team')
      this.loadingData = false
    })
    .catch((error) => {
      if (error) {
        this.loadingData = false
        Toast.create('Invalid username or password. Please try again.')
      }
    })
}
