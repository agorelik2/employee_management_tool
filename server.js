const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "MishaG#21",
  database: "employee_mng_DB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  mainMenu();
});

// Main Menu
function mainMenu() {
  return inquirer
    .prompt([
      {
        type: "list",
        message: "What Would you like to do?",
        name: "mainMenu",
        choices: [
          "View All Employees",
          "View All Departments",
          "View All Roles",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employees",
          "View Employees By Manager",
          "Update Employee's Manager",
          "Delete Department",
          "Delete Role",
          "Delete Employee",
          "Quit",
        ],
      },
    ])
    .then((res) => {
      switch (res.mainMenu) {
        case "View All Employees":
          viewEmployees();
          break;

        case "View All Departments":
          viewDepartments();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update Employees":
          updateEmployees();
          break;

        case "View Employees By Manager":
          viewEmployeesbyManager();
          break;

        case "Update Employee's Manager":
          updateEmployeesManager();
          break;

        case "Delete Department":
          deleteDepartment();
          break;

        case "Delete Role":
          deleteRole();
          break;

        case "Delete Employee":
          deleteEmployee();
          break;
        case "Quit":
        default:
          connection.end();
      }
    });
}

function viewEmployees() {} //"SELECT * FROM employees"
// function viewDepartments() {
//   //"SELECT * FROM departments"

//   connection.query("SELECT * FROM departments", (err, result) => {
//     if (err) throw err;

//     console.table(result);

//     mainMenu();
//   });

//}
function viewDepartments() {
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
}

function viewRoles() {
  //"SELECT * FROM roles"
  connection.query("SELECT * FROM roles;", (err, result) => {
    if (err) throw err;

    console.table(result);

    mainMenu();
  });
}

function addDepartment() {
  return inquirer
    .prompt([
      {
        type: "input",
        message: "What department name would you like to add?",
        name: "department",
      },
    ])
    .then((answer) => {
      connection.query(
        "insert into departments set ?",
        { name: answer.department },
        (err, result) => {
          if (err) throw err;
          console.log("department is added");

          mainMenu();
        }
      );
    });
} //"INSERT INTO departments SET ?",
function addRole() {} //"INSERT INTO roles SET ?"
function addEmployee() {} //"INSERT INTO employees SET ?",
function updateEmployees() {} //"UPDATE employees SET role_id = ? WHERE roles_id = ?",
function viewEmployeesbyManager() {} //"SELECT * FROM employees WHERE manager_id"
function updateEmployeesManager() {}
function deleteDepartment() {}
function deleteRole() {}
function deleteEmployee() {}
