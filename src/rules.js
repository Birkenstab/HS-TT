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
  }
]
