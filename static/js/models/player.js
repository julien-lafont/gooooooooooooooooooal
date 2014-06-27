var Player = function(json, uid, country) {
  this.uid = uid
  this.country = country

  this.link = json._link
  this.general = json.general
  this.stats = json.stats
  this.overview = json.overview

  this.health = 100   // Vie
  this.stamina = 100  // Endurance
  this.rage = 0       // Jauge de rage
  this.warning = 0    // Nombre de cartons

  this.isGoal = false
  this.isDefender = false
  this.isCentral = false
  this.isAttacker = false
}

Player.prototype.stat = function(stat) {
  return this.stats[stat] || 50
}

Player.prototype.overallPower = function() {
  // 0 : ineficient
  // 1 : 100% capacity
  return (this.health + this.stamina + this.rage) / 300
}
