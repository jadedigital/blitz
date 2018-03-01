/*
export const someGetter = (state) => {
}
*/
export const isAuthenticated = state => !!state.token
export const token = state => state.token
export const version = state => state.version
export const leagueData = state => state.leagueData
export const activeLeague = state => state.activeLeague
export const rosters = state => state.rosters
export const players = state => state.players
export const league = state => state.league
export const leagueStandings = state => state.leagueStandings
export const freeAgents = state => state.freeAgents
export const projectedScores = state => state.projectedScores
export const topOwns = state => state.topOwns
export const topAdds = state => state.topAdds
export const topDrops = state => state.topDrops
export const topStarters = state => state.topStarters
export const fullNflSchedule = state => state.fullNflSchedule
export const liveScoring = state => state.liveScoring
export const matchupLiveScoring = state => state.matchupLiveScoring
export const pointsAllowed = state => state.pointsAllowed
export const injuries = state => state.injuries
export const playerScores = state => state.playerScores
export const dummyToolbar = state => state.dummyToolbar
export const currentWeek = state => state.currentWeek
export const futureDraftPicks = state => state.futureDraftPicks
export const activePlayer = state => state.activePlayer
export const teamMap = state => state.teamMap
export const transactions = state => state.transactions
export const messageBoard = state => state.messageBoard
export const currentMsgThread = state => state.currentMsgThread
export const messageBoardThread = state => state.messageBoardThread
export const leagueTab = state => state.leagueTab
export const matchupTeams = state => state.matchupTeams
export const playerStatus = state => state.playerStatus
export const chat = state => state.chat
export const draftResults = state => state.draftResults
export const settings = state => state.settings
export const endWeek = state => {
  return state.league.endWeek
}
export const api = state => state.api
export const params = state => {
  if (state.activeLeague) {
    return {
      rosterParams: {
        cookie: state.token,
        host: state.leagueData[state.activeLeague].host,
        TYPE: 'rosters',
        L: state.activeLeague,
        JSON: 1
      },
      playerParams: {
        cookie: state.token,
        host: state.leagueData[state.activeLeague].host,
        TYPE: 'players',
        DETAILS: 1,
        JSON: 1
      },
      injuriesParams: {
        cookie: state.token,
        host: state.leagueData[state.activeLeague].host,
        TYPE: 'injuries',
        JSON: 1
      },
      leagueParams: {
        cookie: state.token,
        host: state.leagueData[state.activeLeague].host,
        TYPE: 'league',
        L: state.activeLeague,
        JSON: 1
      },
      standingsParams: {
        cookie: state.token,
        host: state.leagueData[state.activeLeague].host,
        TYPE: 'leagueStandings',
        L: state.activeLeague,
        JSON: 1
      },
      freeAgentsParams: {
        cookie: state.token,
        host: state.leagueData[state.activeLeague].host,
        TYPE: 'freeAgents',
        L: state.activeLeague,
        JSON: 1
      },
      projectedScoresParams: {
        cookie: state.token,
        host: state.leagueData[state.activeLeague].host,
        TYPE: 'projectedScores',
        L: state.activeLeague,
        W: state.currentWeek,
        COUNT: 3000,
        JSON: 1
      },
      topAddsParams: {
        cookie: state.token,
        host: state.leagueData[state.activeLeague].host,
        TYPE: 'topAdds',
        JSON: 1
      },
      topOwnsParams: {
        cookie: state.token,
        host: state.leagueData[state.activeLeague].host,
        TYPE: 'topOwns',
        JSON: 1
      },
      nflScheduleParams: {
        cookie: state.token,
        host: state.leagueData[state.activeLeague].host,
        TYPE: 'nflSchedule',
        W: 'ALL',
        JSON: 1
      },
      liveScoringParams: {
        cookie: state.token,
        host: state.leagueData[state.activeLeague].host,
        TYPE: 'liveScoring',
        L: state.activeLeague,
        W: state.currentWeek,
        DETAILS: 1,
        JSON: 1
      },
      matchupLiveScoringParams: {
        cookie: state.token,
        host: state.leagueData[state.activeLeague].host,
        TYPE: 'liveScoring',
        L: state.activeLeague,
        W: state.currentWeek,
        DETAILS: 1,
        JSON: 1
      },
      pointsAllowedParams: {
        cookie: state.token,
        host: state.leagueData[state.activeLeague].host,
        TYPE: 'pointsAllowed',
        L: state.activeLeague,
        JSON: 1
      },
      futureDraftPicksParams: {
        cookie: state.token,
        host: state.leagueData[state.activeLeague].host,
        TYPE: 'futureDraftPicks',
        L: state.activeLeague,
        JSON: 1
      },
      transactionsParams: {
        cookie: state.token,
        host: state.leagueData[state.activeLeague].host,
        TYPE: 'transactions',
        L: state.activeLeague,
        COUNT: 30,
        JSON: 1
      },
      messageBoardParams: {
        cookie: state.token,
        host: state.leagueData[state.activeLeague].host,
        TYPE: 'messageBoard',
        L: state.activeLeague,
        JSON: 1
      }
    }
  } else {
    return ''
  }
}
