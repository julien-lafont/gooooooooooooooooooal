var GraphicsOut = function() {
  this.leftTeamPos = [
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

  this.rightTeamPos = [
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

  this.posLeft = {}
  this.posRight = {}

  // field is 10 x 6
  this.leftTeamPos = _.map(this.leftTeamPos, function(e) {
    return {x: e.x/10, y: e.y/6}
  })
  this.leftTeamPos = _.map(this.leftTeamPos, function(e) {
    //console.log( { x: GraphicsOut.prototype.fieldW*e.x, y: GraphicsOut.prototype.fieldH*e.y })
    return {
      x: GraphicsOut.prototype.fieldW*e.x,
      y: GraphicsOut.prototype.fieldH*e.y
    }
  })
  // field is 10 x 6
  this.rightTeamPos = _.map(this.rightTeamPos, function(e) {
    return {x: e.x/10, y: e.y/6}
  })
  this.rightTeamPos = _.map(this.rightTeamPos, function(e) {
    //console.log( { x: GraphicsOut.prototype.fieldW*e.x, y: GraphicsOut.prototype.fieldH*e.y })
    return {
      x: GraphicsOut.prototype.fieldW*e.x,
      y: GraphicsOut.prototype.fieldH*e.y
    }
  })

}

GraphicsOut.prototype.fieldEl = function() { return $("#field") }
GraphicsOut.prototype.fieldW = 1000
GraphicsOut.prototype.fieldH = 600

GraphicsOut.prototype.update = function(data, action, events, step) {

  var playersHavingBall = {
    left: null,
    right: null
  }

  if(data.ball[0] == 0)       playersHavingBall.left = this.posLeft[0]
  else if(data.ball[0] == 1) {
    playersHavingBall.left = this.posLeft[1][data.ball[1]]
    playersHavingBall.right = this.posRight[3][data.ball[1]]
  }
  else if(data.ball[0] == 2) {
    playersHavingBall.left = this.posLeft[2][data.ball[1]]
    playersHavingBall.right = this.posRight[2][data.ball[1]]
  }
  else if(data.ball[0] == 3) {
    playersHavingBall.left = this.posLeft[3][data.ball[1]]
    playersHavingBall.right = this.posRight[1][data.ball[1]]
  }
  else if(data.ball[0] == 4) playersHavingBall.right = this.posLeft[0]


  $(".player").removeClass('pulse')
  $(".player").removeClass('redPulse')
  $(".player").removeClass('bluePulse')

  if(playersHavingBall.left != null)
    $("#player_"+playersHavingBall.left.country.uid+"_"+playersHavingBall.left.uid).addClass('pulse redPulse')

  if(playersHavingBall.right != null)
    $("#player_"+playersHavingBall.right.country.uid+"_"+playersHavingBall.right.uid).addClass('pulse bluePulse')

  this.drawBall(data.ball[0], data.ball[1])
}

GraphicsOut.prototype.drawBall = function(x, y) {
  // position transformation
  // 0,0 = Left Goal
  // 1,X = Left Team Defense
  // 2,X = Middle
  // 3,X = Right Team Defense
  // 4,0 = Right Goal

  var conversion = {}
  if(x == 0) conversion = this.leftTeamPos[0]
  if(x == 1) conversion = this.leftTeamPos[1+y]
  if(x == 2) conversion = this.leftTeamPos[4+y]
  if(x == 3) conversion = this.leftTeamPos[8+y]
  if(x == 4) conversion = this.leftTeamPos[11]

  $("#ball").css('top', conversion.x);
  $("#ball").css('left', conversion.y);

}

GraphicsOut.prototype.drawPlayers = function(posLeft, posRight) {
  this.posLeft = posLeft
  this.posRight = posRight

  var pposA = _.flatten(posLeft)
  var pposB = _.flatten(posRight)

  this.drawTeam(pposA, this.leftTeamPos, "A")
  this.drawTeam(pposB, this.rightTeamPos, "B")
}

GraphicsOut.prototype.drawTeam = function(ppos, teamPos, teamName) {
    for(i in ppos) {
      this.fieldEl().append("<div id='player_"+ppos[i].country.uid+"_"+ppos[i].uid+"' class='player team"+teamName+"' style='left:"+teamPos[i].x+"px;top:"+teamPos[i].y+"px'><img src='"+ppos[i].general.picture+"' /></div>");
    }
}

