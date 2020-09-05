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

function viewEmployees() {
  connection.query(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id LEFT JOIN employees manager on manager.id = employees.manager_id;",
    (err, result) => {
      if (err) throw err;

      // Clean up results to display as table.
      console.table(result);

      mainMenu();
    }
  );
}

//"SELECT * FROM employees"
function viewDepartments() {
  //"SELECT * FROM departments"

  connection.query("SELECT * FROM departments", (err, result) => {
    if (err) throw err;

    console.table(result);

    mainMenu();
  });
}
// function viewDepartments() {
//   connection.query("SELECT * FROM departments", function (err, res) {
//     if (err) throw err;
//     console.table(res);
//     mainMenu();
//   });
// }

function viewRoles() {
  //"SELECT * FROM roles"
  connection.query(
    "SELECT roles.id, roles.title, roles.salary, departments.name AS department, departments.id AS department_id FROM roles INNER JOIN departments ON roles.department_id = departments.id",
    (err, result) => {
      if (err) throw err;

      console.table(result);

      mainMenu();
    }
  );
}

function addDepartment() {
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    console.table(res);
    // let deptArray = [];
    // deptArray.push(res[0].name);
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
            console.log(`You have added the dept ${answer.department}`);

            mainMenu();
          }
        );
      });
  });
} //"INSERT INTO departments SET ?",

function addRole() {
  connection.query(
    "SELECT roles.id, roles.title, roles.salary, departments.name AS department, departments.id AS department_id FROM roles INNER JOIN departments ON roles.department_id = departments.id",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      // let titleArray = [];
      // titleArray.push(res[0].title);
      // console.log(`Response title ${res[0].title}`);
      inquirer
        .prompt([
          {
            name: "title",
            type: "input",
            message: "What is the title of the role you would like to create?",
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary for this role?",
          },
          {
            name: "department_id",
            type: "input",
            message: "What is the department id for this role?",
          },
        ])
        .then(function (answer) {
          console.log(`You have added the role ${answer.title}`);
          connection.query(
            "INSERT INTO roles SET ?",
            {
              title: answer.title,
              salary: answer.salary,
              department_id: answer.department_id,
            },
            function (err, res) {
              if (err) throw err;
              console.table(res.affectedRows);
              mainMenu();
            }
          );
        });
    }
  );
} //"INSERT INTO roles SET ?"

function addEmployee() {
  connection.query(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.id AS roles_id, departments.name AS department,  CONCAT(manager.first_name, ' ', manager.last_name) AS manager, manager.id as manager_id  FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id LEFT JOIN employees manager on manager.id = employees.manager_id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      inquirer
        .prompt([
          {
            type: "input",
            message: "Please enter employee's first name",
            name: "firstName",
          },
          {
            type: "input",
            message: "Please enter employee last name",
            name: "lastName",
          },
          {
            type: "input",
            message: "Enter employee role ID",
            name: "emplyoeeId",
          },
          {
            type: "input",
            message: "Please enter manager ID",
            name: "managerId",
          },
        ])
        .then((answer) => {
          connection.query(
            "INSERT INTO employees set ?",
            {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: answer.emplyoeeId,
              manager_id: answer.managerId,
            },
            (err, result) => {
              if (err) throw err;

              console.log("Your New employee is added");

              mainMenu();
            }
          );
        });
    }
  );
} //"INSERT INTO employees SET ?",

function updateEmployees() {} //"UPDATE employees SET role_id = ? WHERE roles_id = ?",
function viewEmployeesbyManager() {} //"SELECT * FROM employees WHERE manager_id"
function updateEmployeesManager() {}
function deleteDepartment() {}
function deleteRole() {}
function deleteEmployee() {}
