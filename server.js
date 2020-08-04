const express = require("express");
const inquirer = require("inquirer");
const cTable = require("console.table");
const path = require("path");
const mysql = require("mysql");
const { isBuffer } = require("util");
const e = require("express");
const employee = require("../teamprofilemaker/lib/Employee");
// const promptUser = require("./public/promFuncs");

var app = express();
var PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Samdevmad1981feb!",
    database: "employeetracker",

});

connection.connect(function (err) {
    if (err) throw err;
    promptUser();
})

function promptUser() {
    return inquirer.prompt([
        {
            type: "list",
            name: "operation",
            message: "What operation would you like to preform?",
            choices: ["add employee", "add role", "add department", "view employees", "view roles", "view departments", "view employees by roles"],
        },


    ]).then(function (response) {
        var operation = response.operation;
        switch (operation) {
            case "add employee":
                addEmployee();
                break;

            case "add role":
                addRoles();
                break;

            case "add department":
                addDepartment();
                break;

            case "view employees":
                getEmployees();
                break;

            case "view roles":
                getRoles();
                break;

            case "view departments":
                viewDepartments();
                break;
            case "view employees by roles":
                viewEmployeesByRoles();
                break;

        }



    })
}
//  function to add employee to the database;
function addEmployee() {
    // this queries the role table to populate the choices for role when creating a new employee
    var query = "SELECT role.title, role.salary, role.department_id FROM role"

    connection.query(query, function (err, response) {
        if (err) throw err;
        // creates an array of objects from the roles table 
        const roles = response.map(({ title, salary, department_id }) => ({
            title: title,
            salary: salary,
            id: department_id,
        }));
        // creates an array of roles to use in the prompt to create a new employee
        const roleChoices = [];
        roles.forEach(element => { roleChoices.push(element.title) })

        addEmployeePrompt(roleChoices, roles);

    })
    function addEmployeePrompt(roleChoices, roles) {

        inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "Enter the employee's first name"
            },
            {
                type: "input",
                name: "lastName",
                message: "Enter the employee's last name"
            },
            {
                type: "list",
                name: "role",
                message: "select the employee's role",
                choices: roleChoices

            },
            {
                type: "input",
                name: "managerId",
                message: "Enter the employee Manager's Id"
            }
        ]).then(function (response) {
            var firstName = response.firstName;
            var lastName = response.lastName;
            var roleId = roles.find(element => element.title === response.role);
            var managerId = response.managerId;

            var query = "INSERT INTO employee SET ?";

            connection.query(query, {
                first_name: firstName,
                last_name: lastName,
                department_id: roleId.id,
                manager_id: managerId

            }, function (err, response) {
                if (err) throw err;
                console.table(response);
                console.log("new employee added successfully");
                promptUser()


            })



        })

    }
}
// function to add roles to the database;
function addRoles() {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Enter the title of the role you would like to add"
        },
        {
            type: "input",
            name: "salary",
            message: "Enter the salary of the role you are adding"
        },
        {
            type: "input",
            name: "departmentId",
            message: "enter the id of the department you are adding",


        },
    ]).then(function (response) {
        var title = response.title;
        var salary = response.salary;
        var departmentId = response.departmentId;

        var query = "INSERT INTO role Set ?";

        connection.query(
            query, {
            title: title,
            salary: salary,
            department_id: departmentId,
        }, function (err, response) {
            if (err) throw err;
            console.table(response);
            console.log("role inserted successfully");

            promptUser()

        }
        )


    })
}
function getRoles() {
    var query = "SELECT role.title, role.salary, role.department_id FROM role";


    connection.query(query, function (err, response) {
        if (err) throw err;
        console.table(response);

        promptUser();



    })

}
function getEmployees() {
    var query = "SELECT * FROM employee";

    connection.query(query, function (err, response) {
        if (err) throw err;
        console.table(response);

        promptUser()
    })
}
function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "Enter the name of the Department you would like to add"
        },
    ]).then((response) => {
        var query = "INSERT INTO department SET ?";
        connection.query(query, {
            name: response.departmentName,

        }, function (err, response) {
            if (err) throw err;
            console.log(response);
            console.log("your department was added successfully");

            promptUser();
        })

    })

}
function viewDepartments() {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, response) {
        if (err) throw err;
        console.table(response)
        promptUser()

    })
}
function viewEmployeesByRoles() {
    var query = " SELECT
    e.first_name employee,
        e.last_name employee,
            r.name roles,

                FROM
    employee e
    LEFT JOIN roles r USING(department_id); "
}







app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});