const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
//const updateEmployees = require("./updateEmployees");
//const crud = require("./crud");

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
          "Update Employee's Role",
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

        case "Update Employee's Role":
          //crud.updateEmployees();
          updateEmployeesRoles();
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

//-----------------------------------------------
// *** View All Employees ***
//-----------------------------------------------
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

//-----------------------------------------------
// *** View All Departments ***
//-----------------------------------------------
function viewDepartments() {
  connection.query("SELECT * FROM departments", (err, result) => {
    if (err) throw err;

    console.table(result);

    mainMenu();
  });
}

//-----------------------------------------------
// *** View All Roles ***
//-----------------------------------------------
function viewRoles() {
  connection.query(
    "SELECT roles.id, roles.title, roles.salary, departments.name AS department, departments.id AS department_id FROM roles INNER JOIN departments ON roles.department_id = departments.id",
    (err, result) => {
      if (err) throw err;

      console.table(result);

      mainMenu();
    }
  );
}

//-----------------------------------------------
// *** Add New Role ***
//-----------------------------------------------
function addRole() {
  //sql query
  const queryroles = `SELECT DISTINCT roles.id AS id, roles.title AS title, roles.salary AS salary, departments.name AS department, departments.id AS department_id FROM roles INNER JOIN departments ON roles.department_id = departments.id`;
  connection.query(queryroles, (err_r, res_r) => {
    if (err_r) throw err_r;
    console.log(`Below are all the existing roles:`);
    console.table(res_r);
  });

  const departments = [];
  const departmentsName = [];
  const query = `SELECT id, name FROM departments`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    //console.table(res);
    for (let i = 0; i < res.length; i++) {
      departments.push({
        id: res[i].id,
        name: res[i].name,
      });
      departmentsName.push({
        name: `${res[i].name}`,
        value: `${res[i].name}`,
      });
    }

    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message:
            "What is the Title of the NEW Role you would like to create?",
          validate: async function confirmStringInput(input) {
            var alphaExp = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
            if (
              input.trim() != "" &&
              input.trim().length <= 30 &&
              input.match(alphaExp)
            ) {
              return true;
            }
            return "Invalid input. Please limit your input to 30 characters or less and ONLY USE LETTERS.";
          },
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for this role?",
          validate: (input) => {
            if (!input.match(/^[0-9]+$/)) {
              return "Please enter a number";
            }
            return true;
          },
        },
        {
          name: "roleDept",
          type: "rawlist",
          message: "Select Department for the New Role:",
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
            console.log(
              `You have successfully added the new role of ${answer.title} to the ${chosenDept}`
            );
            console.table(res.affectedRows);

            //Display Updated Roles
            //setTimeout(viewRoles, 500);

            mainMenu();
          }
        );
      });
  });
}

//-----------------------------------------------
// *** Add New Department ***
//-----------------------------------------------
function addDepartment() {
  connection.query("SELECT id, name AS department FROM departments", function (
    err,
    res
  ) {
    if (err) throw err;
    console.table(`Below is the list of existing departments:`);
    console.table(res);

    inquirer
      .prompt([
        {
          name: "name",
          type: "input",
          message:
            "What is the name of the department you would like to create?",

          validate: async function confirmStringInput(input) {
            var alphaExp = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
            if (
              input.trim() != "" &&
              input.trim().length <= 30 &&
              input.match(alphaExp)
            ) {
              return true;
            }
            return "Invalid input. Please limit your input to 30 characters or less and ONLY USE LETTERS.";
          },
        },
      ])
      .then(function (answer) {
        connection.query(
          "INSERT INTO departments SET ?",
          {
            name: answer.name,
          },
          function (err, res) {
            if (err) throw err;
            console.table(res.affectedRows);
            console.log(`You have added the dept ${answer.name}`);
            //Display Updated Departments
            //setTimeout(viewDepartments, 500);

            mainMenu();
          }
        );
      });
  });
}
//-----------------------------------------------
// *** Add New Employee ***//
//-----------------------------------------------
function addEmployee() {
  //initialize newEmployee object
  const newEmployee = {
    firstName: "",
    lastName: "",
    roleID: 0,
    managerID: 0,
  };
  //new employee name prompt
  inquirer
    .prompt([
      {
        name: "firstName",
        message: "Enter Employee's First Name: ",
        validate: async (input) => {
          if (!input.match(/^[A-Z][A-Z ]{0,}/i)) {
            return "Sorry, the employee's first name must contain at least 1 character and must only contain letters and spaces!";
          }
          return true;
        },
      },
      {
        name: "lastName",
        message: "Enter Employee's Last Name: ",
        validate: async (input) => {
          if (!input.match(/^[A-Z][A-Z ]{0,}/i)) {
            return "Sorry, the employee's last name must contain at least 1 character and must only contain letters and spaces!";
          }
          return true;
        },
      },
    ])
    .then((answers) => {
      //set newEmployee name
      newEmployee.firstName = answers.firstName;
      newEmployee.lastName = answers.lastName;
      //sql query for roles
      const query = `SELECT roles.title, roles.id FROM roles;`;
      connection.query(query, (err, res) => {
        if (err) throw err;
        //extract role names and ids to arrays
        const roles = [];
        const rolesNames = [];
        for (let i = 0; i < res.length; i++) {
          roles.push({
            id: res[i].id,
            title: res[i].title,
          });
          rolesNames.push(res[i].title);
        }
        //prompt for role selection
        inquirer
          .prompt({
            type: "list",
            name: "rolePromptChoice",
            message: "Select New Employee's Role:",
            choices: rolesNames,
          })
          .then((answer) => {
            //get id of chosen role
            const chosenRole = answer.rolePromptChoice;
            let chosenRoleID;
            for (let i = 0; i < roles.length; i++) {
              if (roles[i].title === chosenRole) {
                chosenRoleID = roles[i].id;
              }
            }
            //console.log(`chosen role is ${chosenRole}`);
            //console.log(`chosen role id is ${chosenRoleID}`);

            //set newEmployee role ID
            newEmployee.roleID = chosenRoleID;

            //sql query for managers
            const query = `
                      SELECT DISTINCT concat(manager.first_name, " ", manager.last_name) AS full_name, manager.id
                      FROM employees 
                      LEFT JOIN employees AS manager ON manager.id = employees.manager_id
                      WHERE employees.manager_id IS NOT NULL`;

            connection.query(query, (err, res) => {
              if (err) throw err;
              //extract manager names and ids to arrays
              const managers = [];
              const managersNames = [];
              for (let i = 0; i < res.length; i++) {
                if (res[i].full_name) managersNames.push(res[i].full_name);
                managers.push({
                  id: res[i].id,
                  fullName: res[i].full_name,
                });
                console.log(`Managers Names ${managersNames[i]}`);
              }

              //prompt for manager selection
              inquirer
                .prompt({
                  type: "list",
                  name: "managerPromptChoice",
                  message: "Select Manager:",
                  choices: managersNames,
                })
                .then((answer) => {
                  //get id of chosen manager
                  const chosenManager = answer.managerPromptChoice;
                  let chosenManagerID;
                  for (let i = 0; i < managers.length; i++) {
                    if (managers[i].fullName === chosenManager) {
                      chosenManagerID = managers[i].id;
                      break;
                    }
                  }
                  //console.log(`Chosen Manager:  ${chosenManager}`);
                  //console.log(`Chosen Manager ID:  ${chosenManagerID}`);

                  //set newEmployee manager ID
                  newEmployee.managerID = chosenManagerID;
                  //add employee insert sql query
                  const query = "INSERT INTO employees SET ?";
                  connection.query(
                    query,
                    {
                      first_name: newEmployee.firstName,
                      last_name: newEmployee.lastName,
                      role_id: newEmployee.roleID || 0,
                      manager_id: newEmployee.managerID || 0,
                    },
                    (err, res) => {
                      if (err) throw err;
                      console.log(
                        `New Employee ${newEmployee.firstName} ${newEmployee.lastName} is Added`
                      );
                      //show updated employee table
                      //setTimeout(viewEmployees, 500);

                      mainMenu();
                    }
                  );
                });
            });
          });
      });
    });
}

//---------------------------------------------
//*** Update Employee Roles ***
//---------------------------------------------
function updateEmployeesRoles() {
  const updatedEmployee = {
    id: 0,
    roleID: 0,
  };
  //sql query for Employees
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
        name: `${res[i].employee_full_name},  Current Role: ${res[i].title}`,
        value: `${res[i].employee_full_name}`,
      });
    }

    //prompt for employee to update
    inquirer
      .prompt({
        type: "list",
        name: "employeePromptChoice",
        message: "Select Employee to Update:",
        choices: employeesNames,
      })
      .then((answer) => {
        //get id of chosen employee
        const chosenEmployee = answer.employeePromptChoice;
        let chosenEmployeeID;
        for (let i = 0; i < employees.length; i++) {
          if (employees[i].fullName === chosenEmployee) {
            chosenEmployeeID = employees[i].id;
            break;
          }
        }
        //save updatedEmployee id
        updatedEmployee.id = chosenEmployeeID;

        //sql query for roles
        const query = `SELECT roles.title, roles.id FROM roles;`;
        connection.query(query, (err, res) => {
          if (err) throw err;
          //extract role names and ids to arrays
          const roles = [];
          const rolesNames = [];
          for (let i = 0; i < res.length; i++) {
            roles.push({
              id: res[i].id,
              title: res[i].title,
            });
            rolesNames.push(res[i].title);
          }
          //prompt for role selection
          inquirer
            .prompt({
              type: "list",
              name: "rolePromptChoice",
              message: "Select New Role:",
              choices: rolesNames,
            })
            .then((answer) => {
              //get id of chosen role
              const chosenRole = answer.rolePromptChoice;
              let chosenRoleID;
              for (let i = 0; i < roles.length; i++) {
                if (roles[i].title === chosenRole) {
                  chosenRoleID = roles[i].id;
                }
              }

              //save updatedEmployee role ID
              updatedEmployee.roleID = chosenRoleID;

              //sql query to update role
              const query = `UPDATE employees SET ? WHERE ?`;
              connection.query(
                query,
                [
                  {
                    role_id: updatedEmployee.roleID,
                  },
                  {
                    id: updatedEmployee.id,
                  },
                ],
                (err, res) => {
                  if (err) throw err;
                  console.log(
                    `${chosenEmployee}'s role is updated to ${chosenRole}`
                  );
                  //show updated employee table
                  //setTimeout(viewEmployees, 500);

                  mainMenu();
                }
              );
            });
        });
      });
  });
} //"UPDATE employees SET role_id = ? WHERE roles_id = ?",
function viewEmployeesbyManager() {
  //sql query for managers
  const query = `
  SELECT DISTINCT concat(manager.first_name, " ", manager.last_name) AS full_name, manager.id
  FROM employees 
  LEFT JOIN employees AS manager ON manager.id = employees.manager_id
  WHERE employees.manager_id IS NOT NULL`;

  connection.query(query, (err, res) => {
    if (err) throw err;
    //extract manager names and ids to arrays
    const managers = [];
    const managersNames = [];
    for (let i = 0; i < res.length; i++) {
      managersNames.push(res[i].full_name);
      managers.push({
        id: res[i].id,
        fullName: res[i].full_name,
      });
      console.log(`${res[i].full_name}`);
    }
    //prompt for manager selection
    inquirer
      .prompt({
        type: "list",
        name: "managerPromptChoice",
        message: "Select Manager:",
        choices: managersNames,
      })
      .then((answer) => {
        //get id of chosen manager
        const chosenManager = answer.managerPromptChoice;
        let chosenManagerID;
        for (let i = 0; i < managers.length; i++) {
          if (managers[i].fullName === chosenManager) {
            chosenManagerID = managers[i].id;
            break;
          }
        }
        //sql query to update manager
        const query = `SELECT * FROM employees WHERE ?`;
        connection.query(
          query,
          [
            {
              manager_id: chosenManagerID,
            },
          ],
          (err, res) => {
            if (err) throw err;
            console.table(res);

            mainMenu();
          }
        );
      });
  });
} //"SELECT * FROM employees WHERE manager_id"

function updateEmployeesManager() {
  connection.query(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id LEFT JOIN employees manager on manager.id = employees.manager_id;",
    (err, result) => {
      if (err) throw err;
      console.log(`Below is the list of employees and their managers:`);
      console.table(result);
    }
  );

  //initialize updatedEmployee object
  const updatedEmployee = {
    id: 0,
    managerID: 0,
  };
  //sql query for Employees
  const query = `
    SELECT id, concat(employees.first_name, " ", employees.last_name) AS employee_full_name
    FROM employees ;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    //extract employee names and ids to arrays
    let employees = [];
    let employeesNames = [];
    for (let i = 0; i < res.length; i++) {
      employees.push({
        id: res[i].id,
        fullName: res[i].employee_full_name,
      });
      employeesNames.push(res[i].employee_full_name);
    }
    //prompt for employee to update
    inquirer
      .prompt({
        type: "list",
        name: "employeePromptChoice",
        message: "Select Employee to Update:",
        choices: employeesNames,
      })
      .then((answer) => {
        //get id of chosen employee
        const chosenEmployee = answer.employeePromptChoice;
        let chosenEmployeeID;
        for (let i = 0; i < employees.length; i++) {
          if (employees[i].fullName === chosenEmployee) {
            chosenEmployeeID = employees[i].id;
            break;
          }
        }
        //save updatedEmployee id
        updatedEmployee.id = chosenEmployeeID;

        console.log(`updated employee ID is ${chosenEmployeeID}`);
        //sql query for managers
        const query = `
            SELECT DISTINCT concat(manager.first_name, " ", manager.last_name) AS full_name, manager.id
            FROM employees
            LEFT JOIN employees AS manager ON manager.id = employees.manager_id`;
        //WHERE employees.manager_id IS NOT NULL`;

        connection.query(query, (err, res) => {
          if (err) throw err;
          //extract manager names and ids to arrays
          const managers = [];
          const managersNames = [];
          for (let i = 0; i < res.length; i++) {
            managersNames.push(res[i].full_name);
            managers.push({
              id: res[i].id,
              fullName: res[i].full_name,
            });
            console.log(`${res[i].full_name}`);
          }
          //prompt for manager selection
          inquirer
            .prompt({
              type: "list",
              name: "managerPromptChoice",
              message: "Select Manager:",
              choices: managersNames,
            })
            .then((answer) => {
              //get id of chosen manager
              const chosenManager = answer.managerPromptChoice;
              let chosenManagerID;
              for (let i = 0; i < managers.length; i++) {
                if (managers[i].fullName === chosenManager) {
                  chosenManagerID = managers[i].id;
                  break;
                }
              }
              //set newEmployee manager ID
              updatedEmployee.managerID = chosenManagerID;
              //sql query to update manager
              const query = `UPDATE employees SET ? WHERE ?`;
              connection.query(
                query,
                [
                  {
                    manager_id: updatedEmployee.managerID,
                  },
                  {
                    id: updatedEmployee.id,
                  },
                ],
                (err, res) => {
                  if (err) throw err;
                  console.log(
                    `${chosenEmployee}'s Manager is Updated to ${chosenManager}`
                  );

                  mainMenu();
                }
              );
            });
        });
      });
  });
}

//---------------------------------------------
//*** Delete Department ***
//---------------------------------------------
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
          //Display Updated Departments
          //setTimeout(viewDepartments, 500);

          mainMenu();
        });
      });
  });
}
//---------------------------------------------
//*** Delete Role ***
//---------------------------------------------
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
          console.log(`Role of ${chosenRole} is DELETED`);
          mainMenu();
        });
      });
  });
}
//---------------------------------------------
//*** Delete Employee ***
//---------------------------------------------
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

          //View Updated Employees Table
          //setTimeout(viewEmployees, 500);

          mainMenu();
        });
      });
  });
}
