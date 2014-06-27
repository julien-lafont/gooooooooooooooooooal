var ConsoleOut = function() {
  // init

}

ConsoleOut.prototype.update = function(data, action, events, step) {
  var score = _.map(data.teams, function(team) { return team.score }).join(':')
  var eventsType = _.map(events, function(event) { return event.type }).join(',')
  console.log("Step " + step, score, action.type, eventsType)
}
