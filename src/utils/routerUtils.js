export function parseSearch(search) {
  const searchRegExp = /(\?q=.+)&(time=[0-9]{1,})/g
  const matchGroups = searchRegExp.exec(search)
  const playlist = matchGroups[1].slice(3)
  const timeframe = matchGroups[2].slice(5)
  return [playlist, timeframe]
}
