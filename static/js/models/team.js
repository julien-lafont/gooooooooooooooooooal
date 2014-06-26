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
  return [
    this.players[0],
    [ this.players[1], this.players[2], this.players[3], this.players[4] ],
    [ this.players[5], this.players[6], this.players[7] ],
    [ this.players[8], this.players[9], this.players[10] ],
  ]
}
