/* Schema for SQL database/table. We haven't discussed this type of file yet */
DROP DATABASE IF EXISTS employee_mng_DB;

/* Create database */
CREATE DATABASE employee_mng_DB;
USE employee_mng_DB;

/* Create table departments with a primary key that auto-increments */
CREATE TABLE departments
(
        id INT NOT NULL
        AUTO_INCREMENT,
    name VARCHAR
        (30) NOT NULL,
    
    PRIMARY KEY
        (id)    
);

        /* Create table roles with a primary key that auto-increments */
        CREATE TABLE roles
        (
                id INT NOT NULL
                AUTO_INCREMENT,
    title VARCHAR
                (30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY
                (id)
);

                /* Create table employees with a primary key that auto-increments */
                CREATE TABLE employees
                (
                        id INT NOT NULL
                        AUTO_INCREMENT,
    first_name VARCHAR
                        (30) NOT NULL,
    last_name VARCHAR
                        (30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY
                        (id)
);