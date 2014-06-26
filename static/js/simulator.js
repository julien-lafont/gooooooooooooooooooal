var Simulator = function() {
  // Simulator state (if needed)
}

Simulator.prototype.next = function(data, teamPlaying) {
  // Fake simulator
  return {
    data: data,
    action : {
      type: 'SHORT_PASS',
      from: data.teams[0].team.players[0],
      to: data.teams[0].team.players[1],
      success: true
    },
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
