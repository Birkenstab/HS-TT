const requestPromise = require("request-promise")
const cheerio = require("cheerio")

const configManager = require("./configManager")

const request = requestPromise.defaults({
  jar: true, // Enable Cookies
  timeout: 180 * 1000 // 180s
})

async function login () {
  const result = await request({
    uri: "https://lsf.verwaltung.hs-ulm.de/qisserver/rds?state=user&type=1&category=auth.login&startpage=portal.vm&breadCrumbSource=portal",
    method: "POST",
    form: {
      asdf: configManager.loginCredentials.username,
      fdsa: configManager.loginCredentials.password
    },
    simple: false,
    resolveWithFullResponse: true
  })
  if (result.statusCode !== 302) {
    throw new Error("Error logging in: status " + result.statusCode)
  }
  console.log("Logged in")
}

async function isLoggedIn () {
  const result = await request("https://lsf.verwaltung.hs-ulm.de/qisserver/rds?state=user&type=0&topitem=")
  return !result.includes("Benutzerkennung")
}

/**
 * Return URLs of all modules
 * @returns {Promise.<[String]>}
 */
async function loadTimetable (programNo, semester) {
  //const page = await request("https://lsf.verwaltung.hs-ulm.de/qisserver/rds?state=wplan&week=-1&act=show&pool=&show=plan&P.vx=lang&fil=plu&P.subc=plan")
  const page = await request(`https://lsf.verwaltung.hs-ulm.de/qisserver/rds?state=wplan&act=stg&pool=stg&show=plan&P.vx=kurz&r_zuordabstgv.ppflichtid=3&missing=allTerms&k_abstgv.abstgvnr=${programNo}&r_zuordabstgv.phaseid=${8 + semester}&week=-1`)
  const $ = cheerio.load(page)
  const blocks = $("table[width='100%'][border='1'] > tbody > tr > td > table")

  const modules = new Set()
  blocks.each(index => {
    const dings = blocks.eq(index)
    const a = dings.children("tbody").children("tr").children("td.klein").first().find("a")
    modules.add(a.attr("href"))
  })

  return [...modules]
}

/**
 * Load a single module
 * @param url
 * @returns {Promise.<*[]>}
 */
async function loadModule (url) {
  const page = await request(url)
  const $ = cheerio.load(page)

  const h1 = $("h1")
  const name = h1.text().replace(" - Einzelansicht", "")

  const shortName = $("[headers='basic_4']").text()

  const moduleNo = $("[headers='basic_3']").text()

  const table = $("[summary='Übersicht über alle Veranstaltungstermine']")
  const rows = table.children("tbody").children("tr")
  const lectures = []
  for (let i = 0; i < rows.length; i++) { // A module contains multiple lectures
    const row = rows.eq(i)
    if (row.children("th").length > 0)
      continue;
    const href = row.children("td").eq(0).children("a").attr("href")

    lectures.push((async () => {
      const page = await request(href) // Make request to get the dates of a lecture
      const $ = cheerio.load(page)

      const time = row.children("td").eq(2).text().trim()
      const match = time.match(/(\d{2}):(\d{2})\sbis\s(\d{2}):(\d{2})/)
      const timeFrom = {
        hour: parseInt(match[1]),
        minute: parseInt(match[2])
      }
      const timeTo = {
        hour: parseInt(match[3]),
        minute: parseInt(match[4])
      }

      const room = row.children("td").eq(5).children("a").text()
      const shortRoom = room.split(" - ")[0]

      const lis = $(".mikronavi").eq(1).children("ul").children("li")
      const dates = []
      for (let i = 0; i < lis.length; i++) {
        const date = lis.eq(i).text().match(/(\d{2})\.(\d{2})\.(\d{4})/)
        dates.push({
          day: parseInt(date[1]),
          month: parseInt(date[2]),
          year: parseInt(date[3])
        })
      }

      const as = row.children("td").eq(7).children("a")
      const teachers = []
      for (let i = 0; i < as.length; i++) {
        teachers.push(as.eq(i).text().trim())
      }

      const days = ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."]
      const day = days.indexOf(row.children("td").eq(1).text().trim())

      const lecture = {
        name,
        shortName,
        moduleNo,
        timeFrom,
        timeTo,
        room,
        shortRoom,
        dates,
        teachers,
        day
      }
      return lecture
    })())
  }
  return await Promise.all(lectures) // Wait until all lectures of this module are loaded
}

/**
 * Load lectures from lsf
 * @returns {Promise.<Array>}
 */
async function load (programNo, semester) {
  console.log("Starting lecture load…")
  //await login()
  //console.log("Logged In: " + await isLoggedIn())
  const modules = await loadTimetable(programNo, semester)
  const lectures = []
  // Wait until all loadModules functions are completed
  await Promise.all(modules.map(async module => lectures.push(...await loadModule(module))))
  console.log(`Loaded ${lectures.length} lectures in ${modules.length} modules`)

  return lectures
}

exports.load = load
