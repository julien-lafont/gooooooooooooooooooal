var Team = function(json) {

  /**
   * Country associated with this team
   * @return Country
  */
  this.country = Country.get(json.uid)

  /**
   * List all players in the team
   * @return Array[Player]
   */
  this.players = _.map(json.players, function(player, index) {
    return new Player(player, index, this.country)
  })

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

// TODO with real algo (cf specs vsi)
Team.prototype.calculPositions =  function() {
  var order = ["GK", "LB", "CB", "RB", "CDM", "LM", "RM", "CM", "CAM", "LW", "RW", "ST", "CF"],
      orderedPlayers =  this.players.sort(function(player1, player2) {
        return order.indexOf(player1.general.position) - order.indexOf(player2.general.position);
      });
  return [
    orderedPlayers[0],
    [ orderedPlayers[1], orderedPlayers[2], orderedPlayers[3]],
    [ orderedPlayers[5], orderedPlayers[6], orderedPlayers[7], orderedPlayers[4]],
    [ orderedPlayers[8], orderedPlayers[9], orderedPlayers[10] ],
  ]
}
