import fs from "fs"
import path from "path"
import util from "util"

import { languagesSupported } from "./index"

require("dotenv").config()

const pWriteFile = util.promisify(fs.writeFile)

const saveFileToFileSystem = async (fileUrl, filePath) => {
  try {
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error("Failed to download file")
    }

    const json = await response.text()
    await pWriteFile(filePath, JSON.stringify(JSON.parse(json), null, 4), {
      encoding: "utf-8",
    })
  } catch (error) {
    fs.unlink(filePath, () => {}) // Delete the file if an error occurs
  }
}

/**
 * Main entry points that executes all the functions
 */
const doWork = async () => {
  await Promise.all(
    languagesSupported.map((lang) => {
      const root = path.join(__dirname, "..")
      const filePath = path.join(root, "i18n", "languages", `${lang}`)

      // eslint-disable-next-line no-console
      console.log(`prepare ${lang}...`)

      return saveFileToFileSystem(
        `${process.env.TRANSLO_I18N_BASE_URL}/${lang}`,
        filePath
      )
    })
  )

  // eslint-disable-next-line no-console
  console.log("all languages imported.")
}

doWork()
