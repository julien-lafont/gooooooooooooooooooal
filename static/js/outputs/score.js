var ScoreOut = function() {

}

ScoreOut.prototype.update = function(data, action, events, step) {
  var eventsType = _.map(events, function(event) { return event.type }).join(',')
  var teamPlaying = _.map(events, function(event) { return event.teamPlaying }).join(',')
  if (eventsType === 'GOAL') {
    if(teamPlaying === '0'){
      $('#scoreTeam0').text(parseInt( $('#scoreTeam1').html()) + 1);
          $('#image').show();

          var hide = function(){
            $('#image').hide();
          }
          setTimeout(hide, 1500);  // 2 seconds
    }

    if(teamPlaying === '1'){
      $('#scoreTeam1').text(parseInt( $('#scoreTeam1').html()) + 1);
        $('#image').show();

        var hide = function(){
          $('#image').hide();
        }
        setTimeout(hide, 1500);  // 2 seconds
    }
  }
}
