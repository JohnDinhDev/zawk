const rl = require("readline-sync");
const fs = require("fs");

const generateEnv = () => {
  let hiddenInput = false;
  const result = {};
  const questions = [
    {
      text: "Do you want all your following inputs to be hidden? [Y/N]\n [Y]es or [N]o: ",
      defaultInput: 'n',
      handler: (input) => {
        if (input.toLowerCase().indexOf("y") > -1) {
          hiddenInput = true;
        }
      },
    },
    {
      text: "What port do you want to expose the server to? Default is 3000\nPort: ",
      defaultInput: '3000',
      handler: function (input) {
        const port = parseInt(input);
        result.port = port;
        console.log(port, port.toString().length);
        if (
          port.toString().length !== input.length ||
          port < 1 ||
          port > 9999 ||
          Number.isNaN(port) ||
          port < 1 ||
          port > 9999
        ) {
          const newInput = rl.question(
            "Please enter a valid port number from 1-9999\nPort: ",
            { hideEchoBack: hiddenInput }
          );
          this.handler(newInput);
        }
      },
    },
    {
      text: "What do you want to name your database?\nDatabase Name: ",
      defaultInput: 'mydb',
      handler: function (input) {
        result.dbName = input;
      },
    },
    {
      text: "Set the password for the root MySQL user\nRoot Password: ",
      defaultInput: 'Password123!',
      handler: function (input) {
        result.rootPass = input;
      },
    },
    {
      text: "Enter MySQL User Name\nMySQL User Name: ",
      defaultInput: 'wordpress',
      handler: function (input) {
        result.mysqlUser = input;
      },
    },
    {
      text: "Enter MySQL user password\nMySQL User Password: ",
      defaultInput: 'Password123!',
      handler: function (input) {
        result.mysqlUserPass = input;
      },
    },
    {
      text: "Enter WordPress home url ex: http://localhost:3000 or google.com\nHome Url: ",
      defaultInput: `http://localhost`,
      handler: function (input) {
        let resultStr = input;
        if (!input.startsWith("http")) {
          resultStr = "http://" + resultStr;
        }

        if (input.includes("//localhost") && !input.includes(`:${result.port}`)) {
          resultStr += `:${result.port}`;
        }

        result.wpHomeUrl = resultStr;
      },
    },
    {
      text: "Enter debug file log path ex: /var/log/app/debug.log\nDebug Log Path: ",
      defaultInput: '/var/log/app/debug.log',
      handler: function (input) {
        result.debugLogPath = input;
      },
    },
  ];

  questions.forEach((question) => {
    const inputValue = rl.question(question.text, {
      hideEchoBack: hiddenInput,
      defaultInput: question.defaultInput
    });
    question.handler(inputValue);
  });

  console.log(result);


  fs.readFile("./.env.example", "utf-8", (err, data) => {
    // Regex to split lines of text
    const resultEnvArr = data.split(/\r?\n/);

    resultEnvArr.forEach((line, index) => {
      switch (true) {
        case line.includes("PORT="):
          resultEnvArr[index] = `PORT='${result.port}'`;
          break;
        case line.includes("MYSQL_DATABASE="):
          resultEnvArr[index] = `MYSQL_DATABASE='${result.dbName}'`;
          break;
        case line.includes("MYSQL_ROOT_PASSWORD"):
          resultEnvArr[index] = `MYSQL_ROOT_PASSWORD='${result.rootPass}'`;
          break;
        case line.includes("MYSQL_USER="):
          resultEnvArr[index] = `MYSQL_USER='${result.mysqlUser}'`;
          break;
        case line.includes("MYSQL_PASSWORD="):
          resultEnvArr[index] = `MYSQL_PASSWORD='${result.mysqlUserPass}'`;
          break;
        case line.includes("WP_HOME="):
          resultEnvArr[index] = `WP_HOME='${result.wpHomeUrl}'`;
          break;
        case line.includes("WP_DEBUG_LOG="):
          resultEnvArr[index] = `WP_DEBUG_LOG='${result.debugLogPath}'`;
          break;
      }
    });

    fs.writeFileSync("./.env", resultEnvArr.join("\n"), "utf-8");
    console.log("Env file has been generated.");
  });
};

module.exports = generateEnv;

generateEnv();
