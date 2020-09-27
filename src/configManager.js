
function loadRules() {
  try {
    exports.rules = require("../config/rules.js")
  } catch (e) {
    if (e.code === "MODULE_NOT_FOUND") {
      console.log("Rule file config/rules.js does not exist. Ignoring it")
      exports.rules = []
    } else {
      throw e
    }
  }
}

function loadCredentials() {
  try {
    const loginCredentials = require("../config/loginCredentials")
    if (!loginCredentials.username) {
      console.error("Login Credentials file: Missing username")
      process.exit(1)
    }
    if (!loginCredentials.password) {
      console.error("Login Credentials file: Missing password")
      process.exit(1)
    }

    exports.loginCredentials = loginCredentials

  } catch (e) {
    if (e.code === "MODULE_NOT_FOUND") {
      console.error("Login Credentials file not found.")
      /*console.error("You have to create the file config/loginCredentials.js with the following content:")
      console.error("module.exports = {\n" +
        "  username: \"< Your university username >\",\n" +
        "  password: \"< Your university password >\"\n" +
        "};")

      process.exit(1)*/
    } else {
      throw e
    }
  }
}

loadCredentials()
loadRules()
