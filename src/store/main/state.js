export default {
  token: '',
  version: '',
  leagueData: {},
  activeLeague: '',
  rosters: '',
  players: '',
  leagueStandings: '',
  league: '',
  freeAgents: '',
  projectedScores: '',
  injuries: '',
  topAdds: '',
  topOwns: '',
  topDrops: '',
  topStarters: '',
  liveScoring: '',
  matchupLiveScoring: '',
  fullNflSchedule: '',
  pointsAllowed: '',
  playerScores: '',
  playerStatus: '',
  currentWeek: '',
  futureDraftPicks: '',
  activePlayer: '',
  transactions: '',
  messageBoard: '',
  currentMsgThread: '',
  messageBoardThread: '',
  leagueTab: '',
  matchupTeams: {teamA: '', teamB: ''},
  chat: '',
  draftResults: '',
  settings: {
    navbar: ['team', 'league', 'matchup', 'players', 'chat'],
    toolbarHide: false
  },
  teamMap: {
    ARI: 'ARI',
    ATL: 'ATL',
    BAL: 'BAL',
    BUF: 'BUF',
    CAR: 'CAR',
    CHI: 'CHI',
    CIN: 'CIN',
    CLE: 'CLE',
    DAL: 'DAL',
    DEN: 'DEN',
    DET: 'DET',
    GBP: 'GB',
    HOU: 'HOU',
    IND: 'IND',
    JAC: 'JAX',
    KCC: 'KC',
    LAR: 'LA',
    LAC: 'LAC',
    MIA: 'MIA',
    MIN: 'MIN',
    NEP: 'NE',
    NOS: 'NO',
    NYG: 'NYG',
    NYJ: 'NYJ',
    OAK: 'OAK',
    PHI: 'PHI',
    PIT: 'PIT',
    SEA: 'SEA',
    SFO: 'SF',
    TBB: 'TB',
    TEN: 'TEN',
    WAS: 'WAS'
  },
  api: {
    rosters: {
      type: 'rosters',
      value: 'rosters',
      params: 'rosterParams',
      timeOut: 3600000,
      timeStamp: 0
    },
    players: {
      type: 'players',
      value: 'players',
      params: 'playerParams',
      timeOut: 3600000,
      timeStamp: 0
    },
    leagueStandings: {
      type: 'leagueStandings',
      value: 'leagueStandings',
      params: 'standingsParams',
      timeOut: 3600000,
      timeStamp: 0
    },
    freeAgents: {
      type: 'freeAgents',
      value: 'freeAgents',
      params: 'freeAgentsParams',
      timeOut: 3600000,
      timeStamp: 0
    },
    league: {
      type: 'league',
      value: 'league',
      params: 'leagueParams',
      timeOut: 3600000,
      timeStamp: 0
    },
    projectedScores: {
      type: 'projectedScores',
      value: 'projectedScores',
      params: 'projectedScoresParams',
      timeOut: 3600000,
      timeStamp: 0
    },
    topAdds: {
      type: 'topAdds',
      value: 'topAdds',
      params: 'topAddsParams',
      timeOut: 3600000,
      timeStamp: 0
    },
    topOwns: {
      type: 'topOwns',
      value: 'topOwns',
      params: 'topOwnsParams',
      timeOut: 3600000,
      timeStamp: 0
    },
    fullNflSchedule: {
      type: 'fullNflSchedule',
      value: 'fullNflSchedule',
      params: 'nflScheduleParams',
      timeOut: 3600000,
      timeStamp: 0
    },
    liveScoring: {
      type: 'liveScoring',
      value: 'liveScoring',
      params: 'liveScoringParams',
      timeOut: 3600000,
      timeStamp: 0
    },
    matchupLiveScoring: {
      type: 'matchupLiveScoring',
      value: 'liveScoring',
      params: 'matchupLiveScoringParams',
      timeOut: 0,
      timeStamp: 0
    },
    pointsAllowed: {
      type: 'pointsAllowed',
      value: 'pointsAllowed',
      params: 'pointsAllowedParams',
      timeOut: 3600000,
      timeStamp: 0
    },
    injuries: {
      type: 'injuries',
      value: 'injuries',
      params: 'injuriesParams',
      timeOut: 3600000,
      timeStamp: 0
    },
    futureDraftPicks: {
      type: 'futureDraftPicks',
      value: 'futureDraftPicks',
      params: 'futureDraftPicksParams',
      timeOut: 3600000,
      timeStamp: 0
    },
    transactions: {
      type: 'transactions',
      value: 'transactions',
      params: 'transactionsParams',
      timeOut: 3600000,
      timeStamp: 0
    },
    messageBoard: {
      type: 'messageBoard',
      value: 'messageBoard',
      params: 'messageBoardParams',
      timeOut: 0,
      timeStamp: 0
    }
  }
}
