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

GraphicsOut.prototype.update = function(data, action, events, step, currentTeam) {

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
    $("#player_"+playersHavingBall.left.country.uid+"_"+playersHavingBall.left.uid+" .player").addClass('pulse bluePulse')

  if(playersHavingBall.right != null)
    $("#player_"+playersHavingBall.right.country.uid+"_"+playersHavingBall.right.uid+" .player").addClass('pulse redPulse')

  this.drawBall(data.ball[0], data.ball[1], currentTeam)
}

GraphicsOut.prototype.drawFlags = function(left, right) {
  $("#flagA").css('background-image', "url('"+left+"')");
  $("#flagB").css('background-image', "url('"+right+"')");
}

GraphicsOut.prototype.drawBall = function(x, y, currentTeam) {
  // position transformation
  // 0,0 = Left Goal
  // 1,X = Left Team Defense
  // 2,X = Middle
  // 3,X = Right Team Defense
  // 4,0 = Right Goal

  var posList = currentTeam == 0 ? this.leftTeamPos : this.rightTeamPos
  var tIdx = 0

  var delta = {
    x : currentTeam == 0 ? 50 : -20,
    y : 20
  }

  //console.log(x, y, posList)
  if(x == 0) tIdx = currentTeam == 0 ? 0 : null
  if(x == 1) tIdx = currentTeam == 0 ? 1+y : 8+y
  if(x == 2) tIdx = currentTeam == 0 ? 4+y : 4+y
  if(x == 3) tIdx = currentTeam == 0 ? 8+y : 1+y
  if(x == 4) tIdx = currentTeam == 0 ? null : 0

  var conversion = posList[tIdx]

  $("#ball").css('left', conversion.x+delta.x);
  $("#ball").css('top', conversion.y+delta.y);

}

GraphicsOut.prototype.drawPlayers = function(posLeft, posRight) {
  // fix field size
  $("#fieldimg").css('width', GraphicsOut.prototype.fieldW+'px')
  $("#fieldimg").css('height', GraphicsOut.prototype.fieldH+'px')
  $("#field").css('width', GraphicsOut.prototype.fieldW+'px')
  $("#field").css('height', GraphicsOut.prototype.fieldH+'px')

  this.posLeft = posLeft
  this.posRight = posRight

  var pposA = _.flatten(posLeft)
  var pposB = _.flatten(posRight)

  this.drawTeam(pposA, this.leftTeamPos, "A")
  this.drawTeam(pposB, this.rightTeamPos, "B")
}

GraphicsOut.prototype.drawTeam = function(ppos, teamPos, teamName) {
    for(i in ppos) {
      this.fieldEl().append(
        "<div id='player_"+ppos[i].country.uid+"_"+ppos[i].uid+"' class='player_container' style='left:"+teamPos[i].x+"px;top:"+teamPos[i].y+"px'>"
        +"  <div class='player team"+teamName+"'>"
        +"    <img src='"+ppos[i].general.picture+"' />"
        +"  </div>"
        +"  <span class='player_name'>"+ ppos[i].general.name + "</span>"
        +"</div>"
      );
    }
}

