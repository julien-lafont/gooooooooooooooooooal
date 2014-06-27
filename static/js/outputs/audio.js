var AudioOut = function() {

}

AudioOut.prototype.update = function(data, action, events, step) {
  if ('speechSynthesis' in window && action.type === 'SHOOT') {
    var goalMsg = new SpeechSynthesisUtterance();
      goalMsg.text="Et c'est le tir";
      goalMsg.voice = "Hysterical";
      goalMsg.lang = 'fr-FR';
      window.speechSynthesis.speak(goalMsg);
  }
}
