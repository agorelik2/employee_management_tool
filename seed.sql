-- Populate departments TABLE first
INSERT INTO departments
    (name, department_id)
VALUES
    ('Sales', 2),
    ('Engineering', 3),
    ('Accounting', 4),
    ('Finance', 5),
    ('Legal', 6);

SET FOREIGN_KEY_CHECKS
= 0;

-- Populate roles TABLE
INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('Sales Lead', 150000, 2),
    ('Salesperson', 56000, 2),
    ('Lead Engineer', 186000, 3),
    ('Software Engineer', 125000, 3),
    ('Account Manager', 90000, 4),
    ('Accountant', 48000, 4),
    ('Financial Manager', 130000, 5),
    ('Financial Analyst', 58000, 5),
    ('Legal Team Lead', 200000, 6),
    ('Lawyer', 170000, 6);

--Populate employees table
insert into employees
    (first_name, last_name, role_id, manager_id)
values
    ("Alex", "Smith", 1, null );

insert into employees
    (first_name, last_name, role_id, manager_id)
values
    ("Jeff", "Chen", 1, 101);

insert into employees
    (first_name, last_name, role_id, manager_id)
values
    ("James", "Brynn", 2, null);

insert into employees
    (first_name, last_name, role_id, manager_id)
values
    ("Alina", "Gorelik", 2, 320);

insert into employees
    (first_name, last_name, role_id, manager_id)
values
    ("John", "Doe", 3, null);




