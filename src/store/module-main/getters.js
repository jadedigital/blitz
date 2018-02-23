/*
export const someGetter = (state) => {
}
*/
export const leagueData = state => state.leagueData
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
export const displayTeam = state => state.displayTeam
export const playerStatus = state => state.playerStatus
export const chat = state => state.chat
export const draftResults = state => state.draftResults
export const settings = state => state.settings
export const endWeek = state => {
  return state.league.endWeek
}
