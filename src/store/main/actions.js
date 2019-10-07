import axios from 'axios'
import { arrayCheck } from '../../plugins/utils'

export const AUTH_REQUEST = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    var userParams = {
      USERNAME: payload.username,
      PASSWORD: payload.password,
      season: '2019'
    }
    var url = 'https://keepersync.com/auth/mfl'
    axios.get(url, {params: userParams})
      .then(response => {
        const data = response.data.leagues.league
        const array = arrayCheck(data)
        const str = JSON.stringify(array)
        console.log(str)
        const token = response.data.cookie
        const firstLeague = array[0].url.substring(array[0].url.lastIndexOf('/') + 1)
        console.log(firstLeague)
        var leagueData = {}
        array.forEach(el => {
          var str = el.url
          var host = str.substring(str.lastIndexOf('//') + 2, str.indexOf('.'))
          var leagueId = str.substring(str.lastIndexOf('/') + 1)
          leagueData[leagueId] = {host: host, teamId: el.franchise_id}
        })
        console.log(leagueData)

        commit('SET_DATA', {type: 'token', data: token})
        commit('SET_DATA', {type: 'leagueData', data: leagueData})
        commit('SET_DATA', {type: 'activeLeague', data: firstLeague})
        resolve()
      })
      .catch((error) => {
        if (error) {
          console.log('uh oh')
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
      JSON: 1,
      season: '2019'
    }
    var url = 'https://keepersync.com/mfl/export'

    axios.get(url, {
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
      JSON: 1,
      season: '2019'
    }
    var url = 'https://keepersync.com/mfl/export'

    axios.get(url, {
      params: nflScheduleParams
    })
      .then((response) => {
        var responseData = JSON.parse(response.data)
        var timeLeft = 0
        var week = ''
        var schedule = arrayCheck(responseData.nflSchedule.week)
        schedule.forEach(el => {
          timeLeft += parseFloat(el.gameSecondsRemaining)
        })
        if (timeLeft > 0) {
          week = parseFloat(responseData.nflSchedule.week)
        } else {
          week = parseFloat(responseData.nflSchedule.week) + 1
        }
        const currentWeek = Math.min(week, getters.endWeek)
        commit('SET_DATA', {type: 'currentWeek', data: currentWeek})
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
    apiParams['season'] = '2019'
    if (payload.week) {
      apiParams['W'] = payload.week
    }
    if (payload.player) {
      apiParams['P'] = payload.player
    }
    if (payload.thread) {
      apiParams['THREAD'] = payload.thread
    }
    const diff = timeCheck - el.timeStamp
    if (diff > el.timeOut) {
      console.log('fetching ' + el.type + ' data from server')
      promises.push(axios.get(url, {
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

export const GET_MFL = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    let data = {
      params: {
        L: payload.league,
        P: payload.player,
        TYPE: 'playerRosterStatus',
        JSON: 1
      }
    }
    let config = {
      headers: {
        cookie: payload.cookie
      }
    }
    var url = 'https://' + payload.host + '.myfantasyleague.com/2017/export'

    axios.get(url, data, config)
      .then((response) => {
        var responseData = response.data
        commit('SET_DATA', {type: 'playerRosterStatus', data: responseData})
        resolve(responseData)
      })
      .catch((error) => {
        if (error) {
          reject(error)
        }
      })
  })
}

export const API_LINEUP = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    let data = {
      params: {
        L: payload.league,
        STARTERS: payload.starters,
        W: payload.week,
        TYPE: 'lineup'
      }
    }
    let config = {
      headers: {
        cookie: payload.cookie
      }
    }
    var url = 'https://' + payload.host + '.myfantasyleague.com/2017/import'

    axios.get(url, data, config)
      .then((response) => {
        var responseData = response.data
        resolve(responseData)
      })
      .catch((error) => {
        if (error) {
          reject(error)
        }
      })
  })
}

export const GET_CHATS = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    var queryParams = {
      host: payload.host,
      league: payload.league,
      cookie: payload.cookie
    }
    var url = 'https://keepersync.com/mfl/chat'

    axios.get(url, {
      params: queryParams
    })
      .then((response) => {
        var responseData = response.data
        commit('SET_DATA', {type: 'chat', data: responseData['messages']})
        resolve(responseData)
      })
      .catch((error) => {
        if (error) {
          reject(error)
        }
      })
  })
}

export const GET_PLAYER_NEWS = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    var queryParams = {
      player: parseInt(payload.player)
    }
    var url = 'https://keepersync.com/playernews'

    axios.get(url, {
      params: queryParams
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        if (error) {
          reject(error)
        }
      })
  })
}

export const GET_PLAYER_STATS = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    var queryParams = {
      player: parseInt(payload.player)
    }
    var url = 'https://keepersync.com/playerstats'

    axios.get(url, {
      params: queryParams
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        if (error) {
          reject(error)
        }
      })
  })
}
