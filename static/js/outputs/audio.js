var AudioOut = function() {

}

AudioOut.prototype.update = function(data, action, events, step) {

  var eventsType = _.map(events, function(event) { return event.type }).join(',')
  if (//'speechSynthesis' in window &&
    eventsType === 'GOAL') {
    var audio = new Audio('./sound/goal.mp3');
    audio.play();
  //   var goalMsg = new SpeechSynthesisUtterance();
  //     goalMsg.text="Et c'est le but";
  //     goalMsg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Hysterical"; })[0];
  //     goalMsg.lang = 'fr-FR';
  //     goalMsg.range = parseFloat("1");;
  //     goalMsg.pitch = parseFloat("1");;
  //     window.speechSynthesis.speak(goalMsg);
  }
}
