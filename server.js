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
  const departments = [];
  const departmentsName = [];
  //sql query
  const query = `SELECT roles.id AS id, roles.title AS title, roles.salary AS salary, departments.name AS department, departments.id AS department_id FROM roles INNER JOIN departments ON roles.department_id = departments.id`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    for (let i = 0; i < res.length; i++) {
      departments.push({
        id: res[i].department_id,
        name: res[i].department,
      });
      departmentsName.push({
        name: `${res[i].department}`,
        value: `${res[i].department}`,
      });
    }

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
        // {
        //   name: "department_id",
        //   type: "input",
        //   message: "What is the department id for this role?",
        // },
        {
          name: "roleDept",
          type: "rawlist",
          message: "Select department for the role:",
          choices: departmentsName,
        },
      ])
      .then((answer) => {
        // let deptID = departments.find((obj) => obj.name === answer.roleDept)
        //   .id;
        //find an id of the role to be deleted
        const chosenDept = answer.roleDept;
        //console.log("Chosen Role here: " + chosenRole);
        let chosenDeptID;
        for (let i = 0; i < departments.length; i++) {
          if (departments[i].name === chosenDept) {
            chosenDeptID = departments[i].id;
            break;
          }
        }
        connection.query(
          "INSERT INTO roles SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: chosenDeptID,
            // department_id: deptID,
          },
          function (err, res) {
            if (err) throw err;
            console.table(res.affectedRows);
            console.log(
              `You have added the role ${answer.title} to the ${chosenDept}`
            );
            mainMenu();
          }
        );
      });
  });
}

function addDepartment() {
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    console.table(res);
    let deptArray = [];
    deptArray.push(res[0].name);
    inquirer
      .prompt([
        {
          name: "id",
          type: "input",
          message: "What is the id of the department you would like to create?",
        },
        {
          name: "name",
          type: "input",
          message:
            "What is the name of the department you would like to create?",
        },
      ])
      .then(function (answer) {
        console.log(`You have added the dept ${answer.dept}`);
        connection.query(
          "INSERT INTO departments SET ?",
          {
            id: answer.id,
            name: answer.name,
          },
          function (err, res) {
            if (err) throw err;
            console.table(res.affectedRows);
            mainMenu();
          }
        );
      });
  });
}

function viewAllEmployees() {
  connection.query("SELECT * FROM employees", function (err, res) {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
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
function deleteDepartment() {
  const query = `
    SELECT id, name FROM departments;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    //extract department names to array
    const departments = [];
    const departmentsNames = [];
    for (let i = 0; i < res.length; i++) {
      departments.push({
        id: res[i].id,
        name: res[i].name,
      });
      departmentsNames.push(res[i].name);
    }
    //prompt for department to delete
    inquirer
      .prompt({
        type: "rawlist",
        name: "departmentsPromptChoice",
        message: "Select Department to Delete:",
        choices: departmentsNames,
      })
      .then((answer) => {
        //find department's id based on the chosen department's name
        const chosenDepartment = answer.departmentsPromptChoice;
        let chosenDepartmentId;
        for (let i = 0; i < departments.length; i++) {
          if (departments[i].name === chosenDepartment) {
            chosenDepartmentId = departments[i].id;
            break;
          }
        }
        //delete the chosen department
        const query = "DELETE FROM departments WHERE ?";
        connection.query(query, { id: chosenDepartmentId }, (err, res) => {
          if (err) throw err;
          console.log(`Department ${chosenDepartment} is deleted`);
          mainMenu();
        });
      });
  });
}
function deleteRole() {
  // const query = `
  //   SELECT id, title FROM roles;`;
  const query = `
    SELECT roles.id AS id, roles.title AS title, departments.name AS department FROM roles INNER JOIN departments ON roles.department_id = departments.id;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    //extract roles ids and titles to array roles, just titles to array rolesNames
    const roles = [];
    const rolesNames = [];
    for (let i = 0; i < res.length; i++) {
      roles.push({
        id: res[i].id,
        title: res[i].title,
      });

      rolesNames.push({
        name: `${res[i].title} in the ${res[i].department} Department`,
        value: `${res[i].title}`,
      });
      // rolesNames.push(`${res[i].title} in the ${res[i].department} Department`);
      //console.log(rolesNames[i]);
    }
    //prompt for role to be removed
    inquirer
      .prompt({
        type: "rawlist",
        name: "rolesPromptChoice",
        message: "Select Role to Delete:",
        choices: rolesNames,
      })
      .then((answer) => {
        //find an id of the role to be deleted
        const chosenRole = answer.rolesPromptChoice;
        //console.log("Chosen Role here: " + chosenRole);
        let chosenRoleID;
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].title === chosenRole) {
            chosenRoleID = roles[i].id;
            break;
          }
        }
        // console.log(
        //   `Chosen Role: ${chosenRole}, ChosenRoleID: ${chosenRoleID}`
        // );

        //get rid of the role
        const query = "DELETE FROM roles WHERE ?";
        connection.query(query, { id: chosenRoleID }, (err, res) => {
          if (err) throw err;
          console.log(`Role ${chosenRole} is DELETED`);
          mainMenu();
        });
      });
  });
}

function deleteEmployee() {
  // const query = `
  //   SELECT id, concat(employees.first_name, " ", employees.last_name) AS employee_full_name
  //   FROM employees ;`;
  const query = ` 
    SELECT employees.id AS id, concat(employees.first_name, " ", employees.last_name) AS employee_full_name, roles.title AS title FROM employees INNER JOIN roles ON employees.role_id = roles.id;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    //extract employee names and ids
    let employees = [];
    let employeesNames = [];
    for (let i = 0; i < res.length; i++) {
      employees.push({
        id: res[i].id,
        fullName: res[i].employee_full_name,
      });
      // employeesNames.push(res[i].employee_full_name);
      employeesNames.push({
        name: `${res[i].employee_full_name} ---> ${res[i].title}`,
        value: `${res[i].employee_full_name}`,
      });
    }
    //prompt for employee to delete
    inquirer
      .prompt({
        type: "rawlist",
        name: "employeePromptChoice",
        message: "Select employee to delete:",
        choices: employeesNames,
      })
      .then((answer) => {
        //find employee's id based on the chosen employee's name
        const chosenEmployee = answer.employeePromptChoice;
        let chosenEmployeeID;
        for (let i = 0; i < employees.length; i++) {
          if (employees[i].fullName === chosenEmployee) {
            chosenEmployeeID = employees[i].id;
            // console.log(
            //   `Chosen Employee ${chosenEmployee} with id ${chosenEmployeeID}`
            // );
            break;
          }
        }
        //get rid of chosen employee
        const query = "DELETE FROM employees WHERE ?";
        connection.query(query, { id: chosenEmployeeID }, (err, res) => {
          if (err) throw err;
          console.log(
            `Employee ${chosenEmployee} with id = ${chosenEmployeeID} is deleted`
          );

          mainMenu();
        });
      });
  });
}
