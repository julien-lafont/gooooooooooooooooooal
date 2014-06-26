var Country = function(json) {
  this._json = json

  this.uid = json.uid
  this.name = json.name
  this.img = json.img
  this.link = json._link
}

/**
 * List all countries
 * @return Array[Country]
 */
Country.all = function() {
  return _.map(data, function(d) { return new Country(d) })
}

/**
 * Retrieve specific country identified by its uid
 * @return Country
*/
Country.get = function(uid) {
  return new Country(_.find(data, { uid: uid}))
}

/**
 * Lazyly construct team representation
 * @return Team
 */
Country.prototype.team = function() {
  if (!this._team)
    this._team = new Team(this._json)
  return this._team
}
