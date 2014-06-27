var Team = function(json) {

  var that = this

  /**
   * Country associated with this team
   * @return Country
  */
  this.country = Country.get(json.uid)

  /**
   * List all players in the team
   * @return Array[Player]
   */

  this.players = (function() {
    return _.map(json.players, function(player, index) {
      return new Player(player, index, that.country)
    })
  })()

  /**
   * List player positions
   * [goal, defenders, middles, attackers]
   * @return Array[Array|Player]
   */
  this.positions = this.calculPositions()

  /**
   * Shortcut to get goal
   * @return Player
   */
  this.goal = this.positions[0]

}

Team.prototype.reverse = function() {
  var oldAtt = this.positions[3]
  var oldDef = this.positions[1]
  this.positions[1] = oldAtt
  this.positions[3] = oldDef
  return this;
}

Team.prototype.calculPositions =  function() {
  var order = ["GK", "LB", "CB", "RB", "CDM", "LM", "RM", "CM", "CAM", "LW", "RW", "ST", "CF"],
      orderedPlayers =  this.players.sort(function(player1, player2) {
        return order.indexOf(player1.general.position) - order.indexOf(player2.general.position);
      });

  orderedPlayers[0].isGoal = true
  orderedPlayers[1].isDefender = true
  orderedPlayers[2].isDefender = true
  orderedPlayers[3].isDefender = true
  orderedPlayers[4].isCentral = true
  orderedPlayers[5].isCentral = true
  orderedPlayers[6].isCentral = true
  orderedPlayers[7].isCentral = true
  orderedPlayers[8].isAttacker = true
  orderedPlayers[9].isAttacker = true
  orderedPlayers[10].isAttacker = true

  return [
    orderedPlayers[0],
    [ orderedPlayers[1], orderedPlayers[2], orderedPlayers[3]],
    [ orderedPlayers[5], orderedPlayers[6], orderedPlayers[7], orderedPlayers[4]],
    [ orderedPlayers[8], orderedPlayers[9], orderedPlayers[10] ],
  ]
}
