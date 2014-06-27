var MatchState = function(stateManager, params) {
  this.name = 'match'
  this.stateManager = stateManager

  this.blue = Country.get(params.opponents[0]).team()
  this.red = Country.get(params.opponents[1]).team().reverse()
  this.currentTeam = 0

  var teams = _.map([this.blue, this.red], function(team) {
    return {
      score: 0,
      team: team,
      country: team.country
    }
  })

  // Match state game
  this.data = {
    teams: teams,
    ball: [2, 2]
  }

  this.step = 0 // Current step in the game
  this.repeater = null // Tick emitter

  // Game simulator implementation
  this.simulator = new Simulator()

  var graphics = new GraphicsOut()

  // hacky reverse

  var bteamReversed = $.extend(true, {}, teams[1].team)
  var _oldAtt = bteamReversed.positions[3]
  var _oldDef = bteamReversed.positions[1]
  bteamReversed.positions[1] = _oldAtt
  bteamReversed.positions[3] = _oldDef

  graphics.drawPlayers(teams[0].team.positions, bteamReversed.positions)
  graphics.drawFlags(teams[0].country.img, teams[1].country.img)

  // Outputs receiving game state
  this.outputs = [
    //new ConsoleOut(),
    new AudioOut(),
    graphics,
    new ScoreOut()
    // new WebglOut(),
    // new CommentatorOut(),
    // new MovieOut()
    // new TweetOut()
  ]

  this.audioIn = new AudioIn()

  this.MAX_STEP = 180
  this.STEP_WAIT = 500 // ms
}

MatchState.prototype.run = function() {
  console.info("Run match " + this.blue.country.name + " VS " + this.red.country.name)

  this.repeater = setInterval(_.bind(function() {
    if (this.isMatchEnded()) {
      this.finishMatch()
    } else {
      this.tick()
    }
  }, this), this.STEP_WAIT)

}

MatchState.prototype.tick = function() {

  // Simulate the next move and return new data, action and striking events
  var next = this.simulator.next(this.data, this.currentTeam, this.audioIn.fetch())

  var data = next.data
  var action = next.action
  var events = next.events

  // Send result to all outputs
  _.each(this.outputs, _.bind(function(output) {
    output.update(data, action, events, this.step, this.currentTeam)
  }, this))

  // Update internal state
  this.data = data
  this.currentTeam = next.nextMoveTeam
  this.step++
}

MatchState.prototype.isMatchEnded = function() {
  return this.step > this.MAX_STEP
}

MatchState.prototype.finishMatch = function() {
  clearInterval(this.repeater)
  this.stateManager.go(ScoreState, this.data.teams)
}
