var GraphicsOut = function() {
      this.fieldEl = $("#field")
}

GraphicsOut.prototype.update = function(data, action, events, step) {

}

GraphicsOut.prototype.drawBall = function(data, action, events, step) {

}

GraphicsOut.prototype.leftTeamPos = [
    {x: 0.5, y: 3},
    {x: 2, y: 2},
    {x: 2, y: 3},
    {x: 2, y: 4},
    {x: 4, y: 1},
    {x: 4, y: 2},
    {x: 4, y: 4},
    {x: 4, y: 5},
    {x: 7, y: 2},
    {x: 7, y: 3},
    {x: 7, y: 4},
    ]

GraphicsOut.prototype.rightTeamPos = [
    {x: 9.5, y: 3},
    {x: 8, y: 2},
    {x: 8, y: 3},
    {x: 8, y: 4},
    {x: 6, y: 1},
    {x: 6, y: 2},
    {x: 6, y: 4},
    {x: 6, y: 5},
    {x: 3, y: 2},
    {x: 3, y: 3},
    {x: 3, y: 4},
    ]


GraphicsOut.prototype.drawPlayers = function(posLeft, posRight) {
  var pposA = _.flatten(posLeft)
  var pposB = _.flatten(posRight)

  this.drawTeam(pposA, this.leftTeamPos)
  this.drawTeam(pposB, this.rightTeamPos)
}

GraphicsOut.prototype.drawTeam = function(ppos, teamPos) {
    // field is 10 x 6
    var pxPos = _.map(teamPos, function(e) {
      return {x: e.x/10, y: e.y/6}
    })

    var fieldW = 1000
    var fieldH = 600

    for(i in ppos) {
      var x = fieldW*pxPos[i].x
      var y = fieldH*pxPos[i].y

      this.fieldEl.append("<div class='player' style='left:"+x+"px;top:"+y+"px'><img src='"+ppos[i].general.picture+"' /></div>");
    }
}

