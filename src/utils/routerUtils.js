export function parseSearch (search) {
  let searchRegExp = /(\?q=.+)&(time=[0-9]{1,})/g
  let matchGroups = searchRegExp.exec(search)
  let playlist = matchGroups[1].slice(3)
  let timeframe = matchGroups[2].slice(5)
  return [playlist, timeframe]
}
