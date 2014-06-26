var SelectionState = function(stateManager) {
  this.stateManager = stateManager
  this.name = 'selection'

  this.data = {
    opponents: []
  }
}

/* Plz rewrite me... plzzzzz !!!!! */
SelectionState.prototype.run = function() {

  var $startBtn = $("#start_match")
  var $wrapperCountries = $("#countries")
  var state = this

  $startBtn.hide()

  // Start the match
  $startBtn.on('click', _.bind(this.startGame, this))

  // Display opponents
  _.map(Country.all(), function(country) {
    $wrapperCountries.append('<li data-uid="' + country.uid + '"><img src="' + country.img +'" /> ' + country.name + '</li>')
  })

  // Opponents selection
  $wrapperCountries.on('click', 'li', function() {
    var $this = $(this)
    var uid = $this.data('uid')

    if ($this.hasClass('selected')) {
      $this.removeClass('selected')
      state.data.opponents = _.without(state.data.opponents, uid)
      $startBtn.hide()
    } else {
      $this.addClass('selected')
      state.data.opponents.push(uid)
      if (state.data.opponents.length == 2) $startBtn.show()
    }
  })
}

SelectionState.prototype.startGame = function() {
  var data = { opponents: this.data.opponents }
  this.stateManager.go(MatchState, data)
}
