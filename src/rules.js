const _ = require("lodash")

module.exports = [
  { // EPRO Montag Nachmittag
    moduleNo: "043010471000",
    day: 1,
    action (lecture) {
      const dates = [
        {date: {day: 9, month: 10, year: 2017}, notes: "Hochschul- und Studienorganisation"},
        {date: {day: 16, month: 10, year: 2017}, notes: "Wissenschaftliches Arbeiten"},
        {date: {day: 6, month: 11, year: 2017}, notes: "SOL 1"},
        {date: {day: 4, month: 12, year: 2017}, notes: "SOL 2"},
        {date: {day: 8, month: 1, year: 2018}, notes: "SOL 3"},
      ]
      lecture.dates = lecture.dates.filter(date => {
        for (let i = 0; i < dates.length; i++) {
          if (_.isEqual(date, dates[i].date)) {
            // TODO Notiz hinzu
            return true
          }
        }
        return false
      })
    }
  },
  { // An1
    moduleNo: "042010071000",
    day: 2,
    timeFrom: {hour: 9, minute: 50},
    timeTo: {hour: 11, minute: 20},
    room: "AULA - AULA",
    action (lecture) {
      lecture.dates = []
    }
  },
  { // TGINF
    moduleNo: "043010371000",
    timeFrom: {hour: 11, minute: 30},
    timeTo: {hour: 13, minute: 0},
    action (lecture) {
      if (![2, 3].includes(lecture.day))
        return

      const lab = [
        {day: 28, month: 11, year: 2017},
        {day: 29, month: 11, year: 2017},
        {day: 5, month: 12, year: 2017},
        {day: 6, month: 12, year: 2017},
        {day: 12, month: 12, year: 2017},
        {day: 13, month: 12, year: 2017},
        {day: 19, month: 12, year: 2017},
        {day: 20, month: 12, year: 2017},
        {day: 9, month: 1, year: 2018},
        {day: 10, month: 1, year: 2018},
        {day: 16, month: 1, year: 2018},
        {day: 17, month: 1, year: 2018},
      ]
      if (["C04b - PC-Pool Softwarelabor", "C04 - Labor Industrielle Bildverarbeitung"].includes(lecture.room)) {
        lecture.dates = lecture.dates.filter(date => _.some(lab, date))
      } else if (["A203 - Hörsaal A203", "AULA - AULA"].includes(lecture.room)) {
        lecture.dates = lecture.dates.filter(date => !_.some(lab, date))
      }
    }
  },
  { // EPRO Donnerstags
    moduleNo: "043010471000",
    day: 4,
    room: "A203 - Hörsaal A203",
    action (lecture) {
      lecture.dates = []
    }
  },
  { // An1-Tutorium
    moduleNo: "042010071000",
    day: 4,
    timeFrom: {hour: 14, minute: 0},
    timeTo: {hour: 15, minute: 30},
    action (lecture) {
      /*lecture.shortName += "-Tut"
      lecture.name += "-Tutorium"*/
      lecture.dates = [
        {day:2, month: 11, year: 2017} // Ersatzvorlesung wegen Feiertagen
      ]
    }
  },
  {
    moduleNo: "043010271000",
    day: 5,
    action (lecture) {
      const calendar = [
        {date: {day: 6, month: 10, year: 2017}, firstBlock: false, lab: false},
        {date: {day: 13, month: 10, year: 2017}, firstBlock: false, lab: false},
        {date: {day: 20, month: 10, year: 2017}, firstBlock: false, lab: false},
        {date: {day: 27, month: 10, year: 2017}, firstBlock: false, lab: false},
        {date: {day: 3, month: 11, year: 2017}, firstBlock: false, lab: false},
        {date: {day: 10, month: 11, year: 2017}, firstBlock: false, lab: false},
        {date: {day: 17, month: 11, year: 2017}, firstBlock: false, lab: false},
        {date: {day: 24, month: 11, year: 2017}, firstBlock: false, lab: false},
        {date: {day: 1, month: 12, year: 2017}, firstBlock: true, lab: true},
        {date: {day: 8, month: 12, year: 2017}, firstBlock: true, lab: true},
        {date: {day: 15, month: 12, year: 2017}, firstBlock: true, lab: true},
        {date: {day: 22, month: 12, year: 2017}, firstBlock: true, lab: true},
        {date: {day: 12, month: 1, year: 2018}, firstBlock: true, lab: true},
        {date: {day: 19, month: 1, year: 2018}, firstBlock: true, lab: true},
        {date: {day: 26, month: 1, year: 2018}, firstBlock: false, lab: false},
      ]
      lecture.dates = lecture.dates.filter(date => {
        let record
        for (let i = 0; i < calendar.length; i++) {
          if (_.isEqual(date, calendar[i].date)) {
            record = calendar[i]
            break
          }
        }
        if (!record)
          return true
        if (!record.firstBlock && _.isEqual(lecture.timeFrom, {hour: 8, minute: 0}))
          return false
        if (record.lab) {
          if (lecture.room === "A203 - Hörsaal A203")
            return false
        } else {
          if (lecture.room === "C12 - Labor Rechnernetze")
            return false
        }
        return true
      })
    }
  },
  { // Prog1 Freitag Nachmittag
    moduleNo: "043010171000",
    day: 5,
    timeFrom: {hour: 14, minute: 0},
    timeTo: {hour: 15, minute: 30},
    action (lecture) {
      lecture.dates = []
    }
  },
  { // Feiertage und Ferien
    action(lecture) {
      const holidays = [
        {day: 31, month: 10, year: 2017},
        {day: 1, month: 11, year: 2017},
        {day: 25, month: 12, year: 2017},
        {day: 26, month: 12, year: 2017},
        {day: 27, month: 12, year: 2017},
        {day: 28, month: 12, year: 2017},
        {day: 29, month: 12, year: 2017},
        {day: 30, month: 12, year: 2017},
        {day: 31, month: 12, year: 2017},
        {day: 1, month: 1, year: 2018},
        {day: 2, month: 1, year: 2018},
        {day: 3, month: 1, year: 2018},
        {day: 4, month: 1, year: 2018},
        {day: 5, month: 1, year: 2018},
        {day: 6, month: 1, year: 2018},
        {day: 7, month: 1, year: 2018}
      ]
      lecture.dates = lecture.dates.filter(date => !_.some(holidays, date))
    }
  },
  { // BWL fällt aus am 21.11. wegen Exkursionswoche
    moduleNo: "051745401001",
    day: 2,
    room: "AULA - AULA",
    action (lecture) {
      _.remove(lecture.dates, {day: 21, month: 11, year: 2017})
    }
  }
]
