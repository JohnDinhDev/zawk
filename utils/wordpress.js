require("dotenv").config();
const fs = require("fs");
const generateSalts = require("./generateSalts");

const generateEnv = () => {
  const saltsArr = generateSalts().split(/\r?\n/);
  fs.readFile("./wordpress/.env.example", "utf-8", (err, data) => {
    // Regex to split lines of text
    const resultEnvArr = data.split(/\r?\n/);
    let saltsArrCounter = 0;

    resultEnvArr.forEach((_line, index) => {
      switch (index) {
        case 0:
          resultEnvArr[index] = `DB_NAME='${process.env.MYSQL_DATABASE}'`;
          break;
        case 1:
          resultEnvArr[index] = `DB_USER='${process.env.MYSQL_USER}'`;
          break;
        case 2:
          resultEnvArr[index] = `DB_PASSWORD='${process.env.MYSQL_PASSWORD}'`;
          break;
        case 9:
          resultEnvArr[index] = `DB_HOST='db'`;
          break;
        case 13:
          resultEnvArr[index] = `WP_HOME='${process.env.WP_HOME}'`;
          break;
        case 15:
          resultEnvArr[index] = `WP_DEBUG_LOG='${process.env.WP_DEBUG_LOG}'`;
          break;
      }

      if (index >= 18 && index <= 25) {
        resultEnvArr[index] = saltsArr[saltsArrCounter];
        saltsArrCounter++;
      }
    });

    fs.writeFileSync("./wordpress/.env", resultEnvArr.join("\n"), "utf-8");
    console.log("WordPress .env file has been generated");
  });
};

module.exports = generateEnv;

// maybe remove this?
generateEnv();
