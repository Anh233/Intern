USE Intern;

drop table account;

CREATE TABLE account (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(30) NOT NULL,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(30) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  is_active TINYINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by bigint,
  deleted_at TIMESTAMP NULL,
  deleted_by VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE account_token(
	id bigint primary key,
	account_id bigint,
	token_key varchar(255),
	is_active tinyint,
	created_at datetime,
	created_by bigint,
	updated_at datetime,
	updated_by bigint,
	deleted_at datetime,
	deleted_by bigint
	);

SELECT * FROM Intern.account;
ALTER TABLE account_token MODIFY COLUMN id INT AUTO_INCREMENT;


INSERT INTO Account VALUES 
(01, 'n23', 'p1234', 'abc@gmail.com', '09123435', 22, 1, '1000-01-01 00:00:00', 001, '1000-01-01 00:00:00', 001, '1000-01-01 00:00:20', 001);

INSERT INTO Account VALUES 
(02, 'nnn', 'nnnq222', 'absc@gmail.com', '09123445', 22, 1, '1000-01-01 00:00:00', 001, '1000-01-01 00:00:00', 001, '1000-01-01 00:00:20', 001);

INSERT INTO Account VALUES 
(01, 'nnn', 'nnnq222', 'absc@gmail.com', '09123445', 22, 1, '1000-01-01 00:00:00', 001, '1000-01-01 00:00:00', 001, null , null);

SELECT * FROM Account;
select * from account_token;



DESCRIBE account;

drop table account_token;
	
SELECT * FROM Intern.account_token;

ALTER TABLE account_token 
ADD FOREIGN KEY (account_id) REFERENCES account(id);

INSERT INTO account_token VALUES 
(01, 01, 'p123s4', 1, '1000-01-01 00:00:00', 001, '1000-01-01 00:05:00', 002, '1000-01-01 00:07:20', 001);

SELECT * FROM account WHERE username = 'n23';
SELECT password FROM account WHERE username = 'nnn';

SELECT * FROM account WHERE username = 'hahahaha';

