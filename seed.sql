-- Populate departments TABLE first
INSERT INTO departments
    (id, name)
VALUES
    (1, "Management"),
    (2, "Sales"),
    (3, "Engineering"),
    (4, "Accounting"),
    (5, "Finance"),
    (6, "Legal");

-- Populate roles TABLE
INSERT INTO roles
    (id, title, salary, department_id)
VALUES
    (1, "CEO", 120000, 1),
    (2, "Product Manager", 90000, 1),
    (3, 'Sales Lead', 150000, 2),
    (4, 'Salesperson', 56000, 2),
    (5, 'Lead Engineer', 186000, 3),
    (6, 'Software Engineer', 125000, 3),
    (7, 'Account Manager', 90000, 4),
    (8, 'Accountant', 48000, 4),
    (9, 'Financial Manager', 130000, 5),
    (10, 'Financial Analyst', 58000, 5),
    (11, 'Legal Team Lead', 200000, 6),
    (12, 'Lawyer', 170000, 6);

--Populate employees table
INSERT INTO employees
    (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, "John", "Boss", 1, 1),
    (2, "Joe", "Bodune", 2, 1),
    (3, "Kent", "Roof", 3, 2),
    (4, "Meg", "Plawn", 4, 3),
    (5, "Will", "Smith", 5, 1),
    (6, "Kaleb", "Young", 6, 5),
    (7, "Kate", "Flip", 7, 1),
    (8, "Magie", "Cosmo", 8 , 7),
    (9, "Michael", "Assets", 9, 1),
    (10, "Kim", "Cross", 12, 11),
    (11, "Alina", "Gorelik", 11, 1),
    (12, "Peter", "Lastoskie", 10, 9);