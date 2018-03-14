const _ = require("lodash")

module.exports = [
  { // Feiertage und Ferien
    action(lecture) {
      const holidays = [
        // Osterfeiertage
        { day: 30, month: 3, year: 2018 },
        { day: 2, month: 4, year: 2018 },

        // Tag der Arbeit
        { day: 1, month: 5, year: 2018 },

        // Christi Himmelfahrt
        { day: 10, month: 5, year: 2018 },

        // Pfingsferien
        { day: 21, month: 5, year: 2018 },
        { day: 22, month: 5, year: 2018 },
        { day: 23, month: 5, year: 2018 },
        { day: 24, month: 5, year: 2018 },
        { day: 25, month: 5, year: 2018 },
        { day: 28, month: 5, year: 2018 },
        { day: 29, month: 5, year: 2018 },
        { day: 30, month: 5, year: 2018 },
        { day: 31, month: 5, year: 2018 }, // Fronleichnam
        { day: 1, month: 6, year: 2018 }
      ]
      lecture.dates = lecture.dates.filter(date => !_.some(holidays, date))
    }
  },
  { // Erster Vorlesungstag 13.3. erst ab 9:50
    moduleNo: "043020371000",
    day: 2,
    timeFrom: { hour: 8, minute: 0 },
    timeTo: { hour: 9, minute: 30 },
    action(lecture) {
      _.remove(lecture.dates, { day: 13, month: 3, year: 2018 })
    }
  },
  { // LINA-Tutorium Mittwoch 14:00
    moduleNo: "042020072000",
    day: 3,
    timeFrom: { hour: 14, minute: 0 },
    timeTo: { hour: 15, minute: 30 },
    action(lecture) {
      lecture.name += " Tutorium"
      lecture.shortName += "-Tut."
    }
  },
  { // PROG-Tutorium Montag 11:30
    moduleNo: "043020171000",
    day: 1,
    timeFrom: { hour: 11, minute: 30 },
    timeTo: { hour: 13, minute: 0 },
    action(lecture) {
      lecture.name += " Tutorium"
      lecture.shortName += "-Tut."
    }
  },
  { // RNET
    moduleNo: "043020271000",
    day: 4,
    action(lecture) {
      console.log(lecture)
      if (!_.some([{ hour: 11, minute: 30 }, { hour: 14, minute: 0 }], lecture.timeFrom)
        || !_.some([{ hour: 13, minute: 0 }, { hour: 15, minute: 30 }], lecture.timeTo))
        return

      console.log("weiter")

      const lab = [
        { day: 29, month: 3, year: 2018 },
        { day: 5, month: 4, year: 2018 },
        { day: 26, month: 4, year: 2018 },
        { day: 3, month: 5, year: 2018 },
        { day: 7, month: 6, year: 2018 },
        { day: 14, month: 6, year: 2018 }
      ]
      if (lecture.room === "C12 - Labor Rechnernetze") {
        console.log("Filtere Labs")
        lecture.dates = lecture.dates.filter(date => _.some(lab, date))
      } else if (lecture.room === "A103 - Hörsaal A103") {
        console.log("Filtere Vorlesung")
        lecture.dates = lecture.dates.filter(date => !_.some(lab, date))
      }
    }
  }
]
