var Player = function(json, uid, country) {
  this.uid = uid
  this.country = country

  this.link = json._link
  this.general = json.general
  this.stats = json.stats
  this.overview = json.overview

  this.health = 100   // Vie
  this.mana = 100     // Endurance
  this.rage = 0       // Jauge de rage
  this.warning = 0    // Nombre de cartons
}
