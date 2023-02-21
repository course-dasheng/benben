// 给我一个 ${functions} 语言下用于 ${language} 功能的库，并附上简短的说明以及源码地址，请用 zzz 语言回复
// `Give me some library for ${functions} functions in xxx language with a short description`
// `Deliver me some library for ${functions} functions in ${programmingLanguage} language with a short description and source code address, answer me in ${language}`
// 初始设置语言，其次给一个粘贴问题、输入问题的地方
import inquirer from "inquirer";
import { request } from "../utils/request.js";
import type { Response } from "../utils/request.js";
import Fs from "fs";
import Path from "path";
import Process from "process";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SettingJson {
  language: string;
  programmingLanguage: string;
}

const searchLibraryPath = Path.join(
  __dirname,
  "../../static/searchLibrary.json"
);

async function main() {
  const functions = "";
  const settingJson: SettingJson = JSON.parse(
    Fs.readFileSync(searchLibraryPath).toString()
  );
  if (!settingJson.language && !settingJson.programmingLanguage) {
    const { programmingLanguage, language, questions } = await inquirer.prompt([
      {
        type: "input",
        name: "programmingLanguage",
        message: "In using programming language: ",
      },
      {
        type: "input",
        name: "language",
        message: "Your answer language: ",
      },
      {
        type: "input",
        name: "questions",
        message: "Your questions: ",
      },
    ]);
    if (questions.trim().length === 0) {
      console.error("Please enter a valid questions");
      return;
    }
    const response = await request({
      functions: questions,
      programmingLanguage,
      language,
    });
    settingJson.language = language;
    settingJson.programmingLanguage = programmingLanguage;
    Fs.writeFileSync(searchLibraryPath, JSON.stringify(settingJson));
  } else {
    const { questions } = await inquirer.prompt([
      {
        type: "input",
        name: "questions",
        message: "Your questions: ",
      },
    ]);
    if (questions.trim().length === 0) {
      console.error("Please enter a valid questions");
      return;
    }
    const data = (await request({
      functions: questions,
      programmingLanguage: settingJson.programmingLanguage || "JavaScript",
      language: settingJson.language || "Chinese",
    })) as Response;

    let [a, b, c] = data?.choices;
    console.log(`${a}, ${b}, ${c}`);
  }
}
main();
export default main;
