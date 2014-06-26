var StateManager = function() {
  this.currentState = null
}

StateManager.prototype.start = function() {
  this.go(SelectionState)
}

StateManager.prototype.go = function(stateConstructor, params) {
  if (!_.isFunction(stateConstructor)) {
    console.erro("State must be a function !")
    return;
  }

  this.currentState = new stateConstructor(this, params || {})
  $('.state').hide()
  $('#state_' + this.currentState.name).show()

  this.currentState.run()
}
