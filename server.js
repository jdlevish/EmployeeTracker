const express = require("express");
const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql");








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
            choices: ["add employee", "add role", "add department", "view employees", "view roles", "view departments", "view employees by roles", "update employee's role", "delete employee"],
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
            case "update employee's role":
                updateRole();
                break;
            case "delete employee":
                deleteEmployee();
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
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                department_id: roleId.id.trim(),
                manager_id: managerId.trim()

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
// function to view available roles
function getRoles() {
    var query = "SELECT role.title, role.salary, role.department_id FROM role";


    connection.query(query, function (err, response) {
        if (err) throw err;
        console.table(response);

        promptUser();



    })

}
// function to view a table of all employees
function getEmployees() {
    var query = "SELECT * FROM employee";

    connection.query(query, function (err, response) {
        if (err) throw err;
        console.table(response);
        promptUser();
    })
}
// function to add new departments
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
// function to view departments
function viewDepartments() {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, response) {
        if (err) throw err;
        console.table(response)
        promptUser()

    })
}
// function to view employees by role
function viewEmployeesByRoles() {
    var query = "SELECT e.id, e.first_name , e.last_name,  r.title FROM employee e  LEFT JOIN role r on e.department_id = r.department_id ";







    connection.query(query, function (err, response) {
        if (err) throw err;
        console.table(response)
    })
}
// function to update role of employee
function updateRole() {
    viewEmployeesByRoles();
    var query1 = "SELECT role.title, role.salary, role.department_id FROM role"
    var roleChoices = []
    connection.query(query1, function (err, response) {
        if (err) throw err;
        // creates an array of objects from the roles table 
        const roles = response.map(({ title, salary, department_id }) => ({
            title: title,
            salary: salary,
            id: department_id,
        }));
        console.log(roles)
        // creates an array of roles to use in the prompt to create a new employee
        const roleChoices = [];
        roles.forEach(element => { roleChoices.push(element.title) })
        inquirer.prompt([
            {
                type: "input",
                name: "employeeId",
                message: "Enter the name of the id of the employee who's role you would like to update"
            },
            {
                type: "list",
                name: "role",
                message: "select the employee's new role",
                choices: roleChoices

            },
        ]).then(function (response) {
            var id = response.employeeId;
            var newRole = response.role
            var roleId = roles.find(element => element.title === newRole);

            var query2 = "UPDATE employee SET department_id =? WHERE id =?"

            connection.query(query2, [roleId.id, id], function (err, response) {
                if (err) throw err;
                console.log(response)
                console.log("employee " + id + "'s role has been updated")
                promptUser()
            })
        })



    })

}
function deleteEmployee() {
    var query1 = "SELECT * FROM employee";

    connection.query(query1, function (err, response) {
        if (err) throw err;
        console.table(response);

    })

    inquirer.prompt([
        {
            type: "input",
            name: "employeeId",
            message: "Enter the name of the id of the employee you would like to delete from the system"
        }

    ]).then(function (response) {
        var query = "DELETE FROM employee WHERE id=?"
        var id = response.employeeId
        connection.query(query, [id], function (err, response) {
            if (err) throw err;
            console.log(response)
            console.log("you have successfully removed the employee with id " + id);
            promptUser();

        })
    })

}







