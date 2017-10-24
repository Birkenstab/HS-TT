const express = require("express")
const moment = require("moment")

const router = express.Router()

const lectureManager = require("../lectureManager")

router.get(["/", "/:date"], function (req, res) {
  let d = moment() // Current date
  if (req.params.date) {
    const match = req.params.date.match(/^([0-9]{1,2})(?:-([0-9]{4}))?$/) // e.g. '32' or '1-2017'
    if (match) {
      d.week(parseInt(match[1]))
      if (match[2])
        d.year(parseInt(match[2]))
    } else {
      res.render("error", {message: "Malformed URL", error: {status: "Usage: / or /<KW> or /<KW>-<Jahr>"}})
      return
    }
  }
  d.day("monday")
  const timetable = lectureManager.getTimetable({day: d.date(), month: d.month() + 1, year: d.year()})
  if (timetable === null) {
    console.warn("No lectures found")
    res.render("error", {message: "Keine Stundenplandaten gespeichert. Versuch es später nochmal", error: {}})
    return
  }
  // Convert lectures to the form [[time, mondayBlock1, tuesdayBlock1, wednesdayBlock1, …], [time, mondayBlock2, tuesdayBlock2, …], …]
  const hours = timetable.times.map((time, index) => [time, ...timetable.days.map(day => day[index])])
  const headers = [""]
  timetable.days.forEach(() => {
    headers.push(d.toDate()) // Convert moment date to js date
    d.add(1, "day")
  })

  const nextWeek = moment(d).add(1, "week")
  const lastWeek = moment(d).subtract(1, "week")

  res.render("index", {
    title: "Stundenplan Inf1",
    currentWeek: moment(),
    thisWeek: d,
    lastWeek,
    nextWeek,
    timetable: hours,
    headers,
    updated: lectureManager.getUpdated(), // Update date
  })
})

module.exports = router
