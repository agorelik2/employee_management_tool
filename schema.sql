/* Schema for SQL database/table. We haven't discussed this type of file yet */
DROP DATABASE IF EXISTS employee_mng_DB;

/* Create database */
CREATE DATABASE employee_mng_DB;
USE employee_mng_DB;

/* Create new table with a primary key that auto-increments, and a text field */
CREATE TABLE departments
(
        id INT NOT NULL
        AUTO_INCREMENT,
    name VARCHAR
        (30) NOT NULL,
    
    PRIMARY KEY
        (id)    
);

        CREATE TABLE roles
        (
                id INT NOT NULL
                AUTO_INCREMENT,
  title VARCHAR
                (30) NOT NULL,
  salary DECIMAL
                (10,2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY
                (id),
  FOREIGN KEY
                (department_id) REFERENCES departments
                (id)                
);

                CREATE TABLE employees
                (
                        id INT NOT NULL
                        AUTO_INCREMENT, 
    first_name VARCHAR
                        (30) NOT NULL, 
    last_name  VARCHAR
                        (30) NOT NULL, 
    role_id int not null,
    manager_id int null,
    PRIMARY KEY
                        (id),
    FOREIGN KEY
                        (role_id) REFERENCES roles
                        (id),
    FOREIGN KEY
                        (manager_id) REFERENCES roles
                        (id)
);