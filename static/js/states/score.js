var ScoreState = function(st, params) {
  this.name = 'end'
  this.score = params
  console.log(this.score)
}

ScoreState.prototype.run = function() {
  alert(this.score[0].country.name +" : " + this.score[0].score + " - " + this.score[1].country.name + " : " + this.score[1].score)
}
