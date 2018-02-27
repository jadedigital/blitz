export default {
  token: '',
  version: '',
  leagueData: '',
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
  displayTeam: '',
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
    }
  },
  params: {
    rosterParams: {
      TYPE: 'rosters',
      L: leagueId,
      JSON: 1
    },
    playerParams: {
      TYPE: 'players',
      DETAILS: 1,
      JSON: 1
    },
    injuriesParams: {
      TYPE: 'injuries',
      JSON: 1
    },
    leagueParams: {
      TYPE: 'league',
      L: leagueId,
      JSON: 1
    },
    standingsParams: {
      TYPE: 'leagueStandings',
      L: leagueId,
      JSON: 1
    },
    freeAgentsParams: {
      TYPE: 'freeAgents',
      L: leagueId,
      JSON: 1
    },
    projectedScoresParams: {
      TYPE: 'projectedScores',
      L: leagueId,
      W: week,
      COUNT: 3000,
      JSON: 1
    },
    topAddsParams: {
      TYPE: 'topAdds',
      JSON: 1
    },
    topOwnsParams: {
      TYPE: 'topOwns',
      JSON: 1
    },
    nflScheduleParams: {
      TYPE: 'nflSchedule',
      W: 'ALL',
      JSON: 1
    },
    liveScoringParams: {
      TYPE: 'liveScoring',
      L: leagueId,
      W: week,
      DETAILS: 1,
      JSON: 1
    },
    pointsAllowedParams: {
      TYPE: 'pointsAllowed',
      L: leagueId,
      JSON: 1
    },
    futureDraftPicksParams: {
      TYPE: 'futureDraftPicks',
      L: this.activeLeague,
      JSON: 1
    }
  }
}
