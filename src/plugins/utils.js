export function arrayCheck (data) {
  var array = []
  if (!Array.isArray(data)) {
    array.push(data)
  }
  else {
    array = data
  }
  return array
}

export function lookup (array, key) {
  var lookup = {}
  for (var i = 0, len = array.length; i < len; i++) {
    lookup[array[i][key]] = array[i]
  }
  return lookup
}