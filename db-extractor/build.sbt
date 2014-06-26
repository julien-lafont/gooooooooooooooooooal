name := """goooooooooooooooooooooooal"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.1"

libraryDependencies ++= Seq(
  ws,
  "org.jsoup" % "jsoup" % "1.7.3"
)
