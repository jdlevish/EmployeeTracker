Drop Database if exists employeeTracker	;

Create Database employeeTracker;

Use employeeTracker;

CREATE TABLE department (
  id int AUTO_INCREMENT NOT NULL,
  name varchar(30) NOT NULl,
  PRIMARY KEY(id)
  
);

CREATE TABLE role (
  id int AUTO_INCREMENT NOT NULL,
  title varchar(30) NOT NULL,
  salary decimal ,
  department_id int,
  PRIMARY KEY(id)
  
);

CREATE TABLE employee (
  id int AUTO_INCREMENT NOT NULL,
  first_name varchar(30) NOT NULl,
  last_name varchar(30) NOT NULl,
  department_id int,
  manager_id int,
  PRIMARY KEY(id)
  
);

