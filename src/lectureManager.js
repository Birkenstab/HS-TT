const path = require("path")

const fs = require("fs-extra")
const _ = require("lodash")

const crawler = require("./crawler")
const configManager = require("./configManager")

let lectures = null // List of all lectures
let updated = null // Last updated date

async function init () {
  try {
    // Load lectures and last updated date from JSON file
    const content = JSON.parse(await fs.readFile(path.join(__dirname, "../cache/lectures.json"), "utf-8"))
    lectures = content.lectures
    updated = new Date(content.updated)
    console.log("Lectures loaded from cache file")
  } catch (e) {
    console.warn("No cached lectures found. Ignoring it", e)
  }
  updateLectures()
  setInterval(updateLectures, 5 * 60 * 1000) // Load Lectures every 5 minutes
}

async function updateLectures () {
  try {
    lectures = await crawler.load()
    applyRules()
    updated = new Date()
  } catch (e) {
    console.error("Error loading lectures from server", e)
  }
  try {
    await fs.writeFile(path.join(__dirname, "../cache/lectures.json"), JSON.stringify({
      lectures,
      updated: updated.getTime()
    }), "utf-8")
    console.log("Saved lectures to cache file")
  } catch (e) {
    console.warn("Error saving lectures to cache file. Ignoring it", e)
  }
}

/**
 * Get lectures on the provided date
 * @param date
 */
function getLecturesOf (date) {
  return lectures.filter(lecture => _.some(lecture.dates, date)) // _.some checks if lecture.dates contains date
}

function applyRules () {
  configManager.rules.forEach(rule => {
    const condition = {...rule} // Clone rule Object
    delete condition.action // delete action function because it does not belong to the conditions
    _.filter(lectures, condition)
      .forEach(lecture => rule.action(lecture)) // Apply rule to every lecture that fulfills the condition
  })
  console.log("Applied rules")
}

module.exports = {
  getLectures: () => lectures,

  /**
   * Return date of last update
   */
  getUpdated: () => updated,

  /**
   * Return 5 days of timetable
   * @param day
   * @param month
   * @param year
   * @returns {*}
   */
  getTimetable ({day, month, year}) {
    if (lectures === null)
      return null
    let times = []
    lectures.map(lecture => ({timeFrom: lecture.timeFrom, timeTo: lecture.timeTo})) // Find all unique times
      .forEach(time => {
        if (_.findIndex(times, time) === -1) { // if not already added to times
          times.push(time)
        }
      })
    times.sort((a, b) => a.timeFrom.hour * 60 + a.timeFrom.minute - (b.timeFrom.hour * 60 + b.timeFrom.minute)) // Sort from early to late

    const days = []
    const d = new Date(year, month - 1, day) // Month is zero-based
    for (let i = 0; i < 5; i++) {
      const lecturesToDay = getLecturesOf({day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear()})
      const day = times.map(time => { // For every time that exists, map the lectures that belong to that time
        return lecturesToDay.filter(lecture => _.isEqual(lecture.timeFrom, time.timeFrom) && _.isEqual(lecture.timeTo, time.timeTo))
      })

      days.push(day)
      d.setDate(d.getDate() + 1)
    }

    return {
      times,
      days
    }

  }
}

init()
