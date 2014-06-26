package controllers

import play.api.libs.ws.WS

import scala.collection.JavaConverters._
import java.io.{PrintWriter, File}

import org.joda.time.LocalDateTime
import org.jsoup._

import play.api._
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.json.Json._
import play.api.Play.current
import play.api.libs.concurrent.Execution.Implicits._

object Application extends Controller {

  val ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36"
  val baseurl = "http://www.futhead.com"

  def index = Action.async {

    val r = WS.url("https://gist.githubusercontent.com/studiodev/b003c9a8c78ef1c43ad4/raw/90f5b9c4db9dda4c5fa16da1836f1ae873c96d9b/players.json").get.map { r =>
     val countries = r.json.as[JsArray]

      countries.value.map { country =>
        val players = (country \ "players").as[JsArray]
        val positions = players.value.map(_.\("general").\("position").as[String])
        println(positions.mkString(", "))
        positions
      }.flatten.distinct
    }

    r.map(pos => Ok(pos.mkString(", ")))

    /*val countryHtml = Jsoup.connect("http://www.futhead.com/14/worldcup/").userAgent(ua).get
    val countryTable = countryHtml.select("body > div.container-fluid.main-content > div:nth-child(3) > div > div.row-fluid.player.border-bottom.no-left-margin > div > div.group-info > table").first
    val countries = countryTable.select("a").iterator().asScala.map { country =>
      val name = country.select("span").first().text
      val link = country.attr("href")
      val img = country.select("img").first().attr("src")
      val uid = link.dropRight(1).split("/").reverse(0)
      (uid, name, baseurl + link, img)
    }.toList

    val json = Json.toJson(countries.map {
      case (uid, name, link, img) =>
        Logger.info(s"# Parsing country: $name")

        val playersHtml = Jsoup.connect(link).userAgent(ua).get
        val players = playersHtml.select("#field").first().select("> div").iterator().asScala.map { player =>
          val link = player.select("> a")
          if (link.isEmpty) {
            Logger.info("Invalid link - Player missing")
            None
          }
          else Some(baseurl + link.attr("href"))
        }.toList.flatten

        val playersJson = Json.toJson(players.map { link =>
            extractPlayerData(link)
        }.flatten)

        obj(
          "_link" -> link,
          "uid" -> uid,
          "name" -> name,
          "img" -> img,
          "players" -> playersJson)
    })

    Logger.info("Finished")

    val timestamp = LocalDateTime.now.toString("YYYYddMM-HHmmss")
    val out = new PrintWriter(new File(s"export-$timestamp.json"))
    try { out.print(Json.prettyPrint(json)) }
    finally { out.close() }

    Ok(timestamp)*/

  }

  def extractPlayerData(url: String) = {
    Logger.info(s"... Parsing player: $url")

    val specsHtml = Jsoup.connect(url).userAgent(ua).get
    val ignore = !specsHtml.select("#player-overview-stats div.well p.lead").isEmpty
    if (ignore) {
      Logger.info("Player ignored, no stats available")
      None
    }
    else {
      val card = specsHtml.select("#player-overview-card").first
      val lines = specsHtml.select("#player-misc-stats table").first.select("tr").iterator().asScala.toList
      val data = lines.filter(_.children().size == 2).map { l => l.child(0).text -> l.child(1).text}.toMap
      val stats = specsHtml.select(".statbars .attr").iterator().asScala.map { l => l.child(1).text -> l.child(0).text.toInt}.toMap

      // Specificity
      val name = lines(0).text
      val rating = card.select(".playercard-rating").first.text.toInt
      val nationImg = card.select(".playercard-nation img").attr("src")
      val nationStr = data("Nation")
      val picture = card.select(".playercard-picture img").attr("src")
      val stats_total = data("Total Stats").toInt
                                      // http://en.wikipedia.org/wiki/Association_football_positions
      val position = data("Position") // GK:gardien, [L,C,R]B Défenseur, RF/LF, LW/RW, LM/RM, CAM/CM/CDM, ST/CF? : Striker
      val age = data("Age").toInt
      val height = data("Height").split("cm")(0).toInt
      val foot = data("Foot")

      // Global stats
      val pac = card.select(".playercard-attr1").text().split(" ")(0).toInt // Pace
      val sho = card.select(".playercard-attr2").text().split(" ")(0).toInt // Shooting
      val pas = card.select(".playercard-attr3").text().split(" ")(0).toInt // Passing
      val dri = card.select(".playercard-attr4").text().split(" ")(0).toInt // Dribbling
      val defe = card.select(".playercard-attr5").text().split(" ")(0).toInt // Defending
      val hea = card.select(".playercard-attr6").text().split(" ")(0).toInt // Heading

      val json = obj(
        "_link" -> url,
        "general" -> obj(
          "name" -> name,
          "rating" -> rating,
          "nation" -> obj(
            "name" -> nationStr,
            "img" -> nationImg
          ),
          "picture" -> picture,
          "position" -> position,
          "age" -> age,
          "height" -> height,
          "foot" -> foot,
          "score" -> stats_total),
        "stats" -> Json.toJson(stats),
        "overview" -> obj(
          "pace" -> pac,
          "shooting" -> sho,
          "passing" -> pas,
          "dribbling" -> dri,
          "defending" -> defe,
          "heading" -> hea
        )
      )

      Some(json)
    }
  }

}