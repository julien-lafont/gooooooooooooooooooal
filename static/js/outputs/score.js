var ScoreOut = function() {

}

ScoreOut.prototype.update = function(data, action, events, step, teamPlaying) {
  var eventsType = _.map(events, function(event) { return event.type }).join(',')
  var teamPlaying = _.map(events, function(event) { return event.teamPlaying }).join(',')
  if (eventsType === 'GOAL') {
    if(teamPlaying == 0){
      $('#scoreTeam0').text(parseInt( $('#scoreTeam0').text()) + 1);
          $('#image').show();

          var hide = function(){
            $('#image').hide();
          }
          setTimeout(hide, 1500);  // 2 seconds
    }

    else {
      $('#scoreTeam1').text(parseInt( $('#scoreTeam1').text()) + 1);
        $('#image').show();

        var hide = function(){
          $('#image').hide();
        }
        setTimeout(hide, 1500);  // 2 seconds
    }
  }
}
