var Simulator = function() {
  // Simulator state (if needed)
}

Simulator.prototype.next = function(data, teamPlaying) {
  var actionsList = [
    {
      type: 'SHORT_PASS',
      from: data.teams[0].team.players[0],
      to: data.teams[0].team.players[1],
      success: true
    },
    {
      type: 'SHOOT',
      from: data.teams[0].team.players[0],
      to: data.teams[0].team.players[1],
      success: true
    },
    {
      type: 'BACK_PASS',
      from: data.teams[0].team.players[0],
      to: data.teams[0].team.players[1],
      success: true
    },
    {
      type: 'LONG_PASS',
      from: data.teams[0].team.players[0],
      to: data.teams[0].team.players[1],
      success: true
    }
  ]
  // Fake simulator
  return {
    data: data,
    action : actionsList[ Math.floor(Math.random() * actionsList.length) ],
    events: [
      {
        type: 'YELLOW_CARD',
        target: data.teams[0].team.players[2]
      }, {
        type: 'GOAL',
        target: data.teams[0].country
      }, {
        type: 'INJURY',
        target: data.teams[0].team.players[3]
      }
    ]
  }
}
