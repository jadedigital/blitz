import { arrayCheck } from '../../plugins/utils'

export const AUTH_REQUEST = ({ commit, dispatch, getters }, payload) => {
  return new Promise((resolve, reject) => {
    var userParams = {
      USERNAME: payload.username,
      PASSWORD: payload.password
    }
    var url = 'https://keepersync.com/auth/mfl'
    Vue.$axios.get(url, {params: userParams})
      .then(response => {
        const array = arrayCheck(data)
        const token = response.data.cookie
        const firstLeague = array[0].league.url.substring(array[0].league.url.lastIndexOf('/') + 1)

        var leagueData = {}
        array.forEach(el => {
          var str = el.league.url
          var host = str.substring(str.lastIndexOf('//') + 2, str.indexOf('.'))
          var leagueId = str.substring(str.lastIndexOf('/') + 1)
          leagueData[leagueId] = {host: host, teamId: el.league.franchise_id}  
        })
        
        commit('SET_DATA', {type: 'token', data: token})
        commit('SET_DATA', {type: 'activeLeague', data: firstLeague})
        commit('SET_DATA', {type: 'leagueData', data: leagueData})
        return dispatch('GET_LEAGUE_DATA')
      })
      .then(() => {
        return dispatch('GET_WEEK')
      })
      .then(() => {
        resolve()
      })
      .catch((error) => {
        if (error) {
          reject(error)
        }
      })
  })
}

export const GET_LEAGUE_DATA = ({ commit, getters }) => {
  return new Promise((resolve, reject) => {
    const data = getters.leagueData
    const leagueId = getters.activeLeague
    const token = getters.token
    var leagueParams = {
      cookie: token,
      host: data[leagueId].host,
      TYPE: 'league',
      L: leagueId,
      JSON: 1
    }
    var url = 'https://keepersync.com/mfl/export'

    Vue.$axios.get(url, {
      params: leagueParams
    })
      .then((response) => {
        const responseData = JSON.parse(response.data)
        commit('SET_DATA', {type: 'league', data: responseData['league']})
        resolve(responseData)
      })
      .catch((error) => {
        if (error) {
          reject(error)
        }
      })
  })
}

export const GET_WEEK = ({ commit, getters }) => {
  return new Promise((resolve, reject) => {
    const data = getters.leagueData
    const leagueId = getters.activeLeague
    const token = getters.token
    var nflScheduleParams = {
      cookie: token,
      host: data[leagueId].host,
      TYPE: 'nflSchedule',
      JSON: 1
    }
    var url = 'https://keepersync.com/mfl/export'

    Vue.$axios.get(url, {
      params: nflScheduleParams
    })
      .then((response) => {
        var responseData = JSON.parse(response.data)
        var timeLeft = 0
        var week = ''
        var schedule = arrayCheck(responseData.nflSchedule.matchup)
        schedule.forEach(el => {
          timeLeft += parseFloat(el.gameSecondsRemaining)
        })
        if (timeLeft > 0) {
          week = parseFloat(responseData.nflSchedule.week)
        }
        else {
          week = parseFloat(responseData.nflSchedule.week) + 1
        }
        const currentWeek = Math.min(week, getters.endWeek)
        commit('SET_DATA', {type: 'currentWeek', data: week})
        resolve(week)
      })
      .catch((error) => {
        if (error) {
          reject(error)
        }
      })
  })
}

export const API_REQUEST = ({ commit, getters }, payload) => {
  var requests = []
  payload.types.forEach(el => {
    requests.push(getters.api[el])
  })

  var url = 'https://keepersync.com/mfl/export'
  var promises = []
  requests.forEach(el => {
    let timeCheck = Date.now()
    let apiParams = getters.params[el.params]
    const data = getters.leagueData
    const leagueId = getters.activeLeague
    apiParams['cookie'] = getters.token
    apiParams['host'] = data[leagueId].host
    const diff = timeCheck - el.timeStamp
    if (diff > el.timeOut) {
      console.log('fetching ' + el.type + ' data from server')
      promises.push(Vue.$axios.get(url, {
        params: apiParams
      })
        .then((response) => {
          const responseData = JSON.parse(response.data)
          commit('SET_DATA', {type: el.type, data: responseData[el.value]})
          commit('API_TIMESTAMP', {type: el.type, data: timeCheck})
          return responseData
        })
        .catch((error) => {
          if (error) {
            return error
          }
        })
      )
    }
  })

  return Promise.all(promises)
}
