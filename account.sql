USE Intern;

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
  updated_at TIMESTAMP NULL,
  updated_by bigint,
  deleted_at TIMESTAMP NULL,
  deleted_by bigint NULL,
  PRIMARY KEY (id)
);

CREATE TABLE account_token(
	id bigint primary key Auto_increment,
	account_id bigint,
	token_key varchar(255),
	is_active tinyint,
	created_at TIMESTAMP NOTNULL default CURRENT_TIMESTAMP,
	created_by bigint,
	updated_at TIMESTAMP NULL,
	updated_by bigint,
	deleted_at TIMESTAMP NULL,
	deleted_by bigint
	);

create table chat_sessions(
	id bigint primary key Auto_increment,
	customer_id bigint,
	assigned_id bigint,
	status varchar(255),
	category varchar(255),
	is_resolved bigint,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by bigint,
	updated_at TIMESTAMP NULL,
	updated_by bigint,
	deleted_at TIMESTAMP null,
	deleted_by bigint
	)
	
create table messages (
	id bigint primary key Auto_increment,
	chat_session_id bigint,
	account_id bigint,
	message TEXT,
	created_at TIMESTAMP not NULL default CURRENT_TIMESTAMP,
	created_by bigint,
	deleted_at TIMESTAMP null,
	deleted_by bigint)
	
create table history_messages (
	id bigint primary key Auto_increment,
	message_id bigint,
	message TEXT,
	chat_session_id bigint,
	account_id bigint,

	created_at TIMESTAMP not NULL default CURRENT_TIMESTAMP,
	created_by bigint,
	deleted_at TIMESTAMP null,
	deleted_by bigint)
	
create table categories (
	id bigint primary key auto_increment,
	category_name varchar(255)
	)
	