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
      if (!_.some([{ hour: 11, minute: 30 }, { hour: 14, minute: 0 }], lecture.timeFrom)
        || !_.some([{ hour: 13, minute: 0 }, { hour: 15, minute: 30 }], lecture.timeTo))
        return

      const lab = [
        { day: 29, month: 3, year: 2018 },
        { day: 5, month: 4, year: 2018 },
        { day: 26, month: 4, year: 2018 },
        { day: 3, month: 5, year: 2018 },
        { day: 7, month: 6, year: 2018 },
        { day: 14, month: 6, year: 2018 }
      ]
      if (lecture.room === "C12 - Labor Rechnernetze") {
        lecture.dates = lecture.dates.filter(date => _.some(lab, date))
      } else if (lecture.room === "A103 - Hörsaal A103") {
        lecture.dates = lecture.dates.filter(date => !_.some(lab, date))
      }
    }
  },
  { // MCOM
    moduleNo: "043020571000",
    action(lecture) {
      if (![1, 5].includes(lecture.day))
        return

      if (!_.some([{ hour: 9, minute: 50 }, { hour: 11, minute: 30 }, { hour: 14, minute: 0 }, { hour: 15, minute: 45 }], lecture.timeFrom)
        || !_.some([{ hour: 11, minute: 20 }, { hour: 13, minute: 0 }, { hour: 15, minute: 30 }, { hour: 17, minute: 15 }], lecture.timeTo))
        return

      const lab = [ // Labor und dann auch keine Vorlesung (außer Freitag 8:00 die ist ja immer)
        { day: 27, month: 4, year: 2018 },
        { day: 30, month: 4, year: 2018 },
        { day: 4, month: 5, year: 2018 },
        { day: 11, month: 5, year: 2018 },
        { day: 14, month: 5, year: 2018 },
        { day: 18, month: 5, year: 2018 },
        { day: 8, month: 6, year: 2018 },
        { day: 11, month: 6, year: 2018 },
        { day: 15, month: 6, year: 2018 },
        { day: 22, month: 6, year: 2018 },
        { day: 25, month: 6, year: 2018 },
        { day: 29, month: 6, year: 2018 }
      ]

      const noLecture = [ // Keine Vorlesung
        { day: 7, month: 5, year: 2018 },
        { day: 4, month: 6, year: 2018 },
        { day: 18, month: 6, year: 2018 }
      ]

      if (lecture.room === "C22 - Seminarraum Mikrocomputertechnik") {
        lecture.dates = lecture.dates.filter(date => _.some(lab, date))
      } else if (lecture.room === "C010 - Hörsaal C010") {
        lecture.dates = lecture.dates.filter(date => !_.some(lab, date) && !_.some(noLecture, date))
      }
    }
  },
  { // MCOM Vorlesung bei der ich nicht weiß warum die existiert
    moduleNo: "043020571000",
    day: 1,
    room: "A203 - Hörsaal A203",
    timeFrom: { hour: 15, minute: 45 },
    timeTo: { hour: 17, minute: 15 },
    action(lecture) {
      lecture.dates = []
    }
  },
  { // TINF Termin am Montag fällt nur am 19.3. weg weil das wieder auf Montag gelegt wurde
    moduleNo: "043020471000",
    day: 1,
    room: "A108 - Hörsaal A108",
    timeFrom: { hour: 9, minute: 50 },
    timeTo: { hour: 11, minute: 20 },
    action(lecture) {
      lecture.dates = lecture.dates.filter(date => !_.isEqual(date, { day: 19, month: 3, year: 2018 }))
    }
  },
  { // TINF-Tutorium
    moduleNo: "043020471000",
    day: 3,
    room: "A108 - Hörsaal A108",
    timeFrom: { hour: 11, minute: 30 },
    timeTo: { hour: 13, minute: 0 },
    action(lecture) {
      const dates = [
        { day: 28, month: 3, year: 2018 },
        { day: 11, month: 4, year: 2018 },
        { day: 25, month: 4, year: 2018 },
        { day: 9, month: 5, year: 2018 },
        { day: 6, month: 6, year: 2018 },
        { day: 20, month: 6, year: 2018 },
        { day: 4, month: 7, year: 2018 }
      ];
      lecture.name += " Tutorium"
      lecture.shortName += "-Tut."
      lecture.dates = lecture.dates.filter(date => _.some(dates, date));
    }
  },
  { // TINF Termin am Dienstag fällt nur am 20.3. nicht aus, weil das erst ersatzweise auf Dienstag verschoben wurde, jetzt aber doch nicht
    moduleNo: "043020471000",
    day: 2,
    room: "C07 - PC-Hörsaal",
    timeFrom: { hour: 14, minute: 0 },
    timeTo: { hour: 15, minute: 30 },
    action(lecture) {
      lecture.dates = lecture.dates.filter(date => _.isEqual(date, { day: 20, month: 3, year: 2018 }))
    }
  }
]
