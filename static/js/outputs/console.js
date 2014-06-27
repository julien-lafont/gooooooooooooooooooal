var ConsoleOut = function() {
  // init

}

ConsoleOut.prototype.update = function(data, action, events, step) {
  var score = _.map(data.teams, function(team) { return team.score }).join(':')
  var eventsType = _.map(events, function(event) { return event.type }).join(',')
  console.log("Step " + step, score, action.type, eventsType)
}

var AudioOut = function() {

}

AudioOut.prototype.update = function(data, action, events, step) {
  if ('speechSynthesis' in window && action.type === 'SHOOT') {
    var goalMsg = new SpeechSynthesisUtterance();
      goalMsg.text="Et c'est le tir";
      goalMsg.voice = "Hysterical";
      goalMsg.lang = 'fr-FR';
      window.speechSynthesis.speak(goalMsg);
  }
}
