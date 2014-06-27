var Simulator = function() {

}

var nextTeam = function(current) {
  return (current+1)%2
}
var moveBall = function(ball, teamPlaying) {
  var sens = (teamPlaying == 0) ? 1 : -1
  var newBallCol = ball[0] + sens
  var lines = (newBallCol == 2) ? 4 : 3 // Lines available in the new column
  var newBallLine = Math.max(0, Math.min(lines - 1 , ball[1] + _.random(-1, 1)))
  var newBallPosition = [newBallCol, newBallLine]
  return newBallPosition
}

var STAT = {
  SHORT_PASS: 'Short Passing',
  SHOOT: 'Shot Power'
}

var CONST = {
  SUCCESS_GAIN_RAGE: 10,
  SUCCESS_ENDURANCE: -10,
  FAIL_ENDURANCE: 0,
  GOAL_GAIN_RAGE: 20,
  SHORT_PASS_RANDOMNESS: 0.4,
  SHOOT_RANDOMNESS: 0.2
}

var AttackAction = function(name, condition, fight, win, fail) {
  this.name = name
  this.condition = condition
  this.fight = fight
  this.win = win
  this.fail = fail
}

var ActionShortPass = new AttackAction(
  'SHORT_PASS',
  function condition(player, ball_col, ball_line) {
    return player.isDefender || player.isCentral
  },
  function fight(player, opponent) {
    var p1 = player.stat(STAT.SHORT_PASS) * player.overallPower()
    var p2 = opponent.stat(STAT.SHORT_PASS) * opponent.overallPower()
    var p1 = p1 + p1 * (Math.random() > 0.5 ? 1 : -1) * _.random(0, CONST.SHORT_PASS_RANDOMNESS) // add some randomness

    return p1 > p2
  },
  function win(player, opponent, ball, teamPlaying) {
    player.rage = player.rage + CONST.SUCCESS_GAIN_RAGE
    player.stamina = player.stamina + 10
    opponent.stamina = opponent.stamina + 10

    return {
      ball: moveBall(ball, teamPlaying),
      nextMoveTeam: teamPlaying,
      events: []
    }
  },
  function fail(player, opponent, ball, teamPlaying) {
    opponent.rage = opponent.rage + CONST.SUCCESS_GAIN_RAGE
    player.stamina = player.stamina + CONST.FAIL_ENDURANCE
    opponent.stamina = opponent.stamina + CONST.SUCCESS_ENDURANCE

    return {
      ball: ball,
      nextMoveTeam: nextTeam(teamPlaying),
      events: []
    }
  }
)

var ActionShoot = new AttackAction(
  'SHOOT',
  function condition(player, ball_col, ball_line) { return player.isAttacker },
  function fight(player, opponent) {
    var p1 = player.stat(STAT.SHOOT) * player.overallPower()
    var p2 = opponent.stat(STAT.SHOOT) * opponent.overallPower()
    var p1 = p1 + p1 * (Math.random() > 0.5 ? 1 : -1) * _.random(0, CONST.SHOOT_RANDOMNESS) // add some randomness

    return p1 > p2
  },
  function win(player, opponent, ball, teamPlaying) {
    player.rage = player.rage + CONST.GOAL_GAIN_RAGE
    player.stamina = player.stamina + CONST.FAIL_ENDURANCE
    opponent.stamina = opponent.stamina + CONST.SUCCESS_ENDURANCE

    return {
      ball: [2, 2],
      nextMoveTeam: nextTeam(teamPlaying),
      events: [
        { type: 'GOAL', player: player, country: player.country, teamPlaying: teamPlaying}
      ]
    }
  },
  function fail(player, opponent, ball, teamPlaying) {
    opponent.rage = opponent.rage + CONST.SUCCESS_GAIN_RAGE
    player.stamina = player.stamina + CONST.FAIL_ENDURANCE
    opponent.stamina = opponent.stamina + CONST.SUCCESS_ENDURANCE

    return {
      ball: ball,
      nextMoveTeam: nextTeam(teamPlaying),
      events: [
        { type: 'FAILED_SHOT', player: player, country: player.country }
      ]
    }
  }
)

var LinePass = new AttackAction(
  'LINE_PASS',
  function condition(player, ball_col, ball_line) {
    return player.isDefender || player.isCentral || player.isAttacker
  },
  function fight(player, opponent) { return true },
  function win(player, opponent, ball, teamPlaying) {
    player.rage = player.rage + CONST.SUCCESS_GAIN_RAGE
    player.stamina = player.stamina + 10
    opponent.stamina = opponent.stamina + 10

    var newLine = ball[1] + (Math.random() > 0.5) ? 1 : -1
    if (newLine < 0 || (ball[0] == 2 && newLine > 3) || (ball[0] != 2 && newLine > 2)) newLine = 1

    return {
      ball: [ball[0], newLine],
      nextMoveTeam: teamPlaying,
      events: []
    }
  },
  function fail(player, opponent, ball, teamPlaying) {
    opponent.rage = opponent.rage + CONST.SUCCESS_GAIN_RAGE
    player.stamina = player.stamina + CONST.FAIL_ENDURANCE
    opponent.stamina = opponent.stamina + CONST.SUCCESS_ENDURANCE

    return {
      ball: ball,
      nextMoveTeam: nextTeam(teamPlaying),
      events: []
    }
  }
)

Simulator.prototype.next = function(data, teamPlaying, aLotOfNoise) {
  var attackActions = [
    ActionShortPass,
    ActionShoot,
    LinePass
  ]
  // var actionsList = [
  //   {
  //     type: 'SHORT_PASS',
  //     from: data.teams[0].team.players[0],
  //     to: data.teams[0].team.players[1],
  //     success: true
  //   },
  //   {
  //     type: 'SHOOT',
  //     from: data.teams[0].team.players[0],
  //     to: data.teams[0].team.players[1],
  //     success: true
  //   },
  //   {
  //     type: 'BACK_PASS',
  //     from: data.teams[0].team.players[0],
  //     to: data.teams[0].team.players[1],
  //     success: true
  //   },
  //   {
  //     type: 'LONG_PASS',
  //     from: data.teams[0].team.players[0],
  //     to: data.teams[0].team.players[1],
  //     success: true
  //   }
  // ]
  // Fake simulator

  // Prepare data
  var ball = data.ball
  var teamAttack = data.teams[teamPlaying].team
  var teamDefense = data.teams[(teamPlaying+1)%2].team

  var attacker = teamAttack.positions[ball[0]][ball[1]]
  var defender = teamDefense.positions[ball[0]][ball[1]]

  // Select attack action
  var attackActionsAvailable = _.filter(attackActions, function(action) {
    return action.condition(attacker, ball[0], ball[1])
  })
  var action = attackActionsAvailable[_.random(0, attackActionsAvailable.length-1)]

  // Execute attack
  var success = action.fight(attacker, defender)
  var result = (success ? action.win : action.fail)(attacker, defender, ball, teamPlaying)

  console.log("TEAM " + teamPlaying + " move " + action.name +" is "+ success + "- Ball " + ball[0]+"/"+ball[1] +" -> " + result.ball[0]+"/" + result.ball[1])

  // Prepare result
  var moveResult = {}
  moveResult.data = data
  moveResult.data.ball = result.ball
  moveResult.action = {
    type: action.name,
    from: attacker,
    to: defender,
    success: success
  }
  moveResult.events = result.events
  moveResult.nextMoveTeam = result.nextMoveTeam

  return moveResult
}
