const inquirer = require("inquirer");

function promptUser() {
    return inquirer.prompt([
        {
            type: "list",
            name: "operation",
            message: "What operation would you like to preform?",
            choices: ["add employee", "add role", "add department", "view employees", "view roles", "view departments",],
        },


    ]).then(function (response) {
        var operation = response.operation;
        switch (operation) {
            case "add employee":
                console.log("add emp");
                break;

            case "add role":
                console.log("add role");
                break;

            case "add department":
                console.log("add dep");
                break;

            case "view employees":
                console.log("view emp");
                break;

            case "view roles":
                console.log("view roles");
                break;

            case "view departments":
                console.log("view dept");
                break;

        }



    })
}

module.exports = promptUser()