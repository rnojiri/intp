CREATE DATABASE IF NOT EXISTS intelipost;

CREATE TABLE IF NOT EXISTS User (
	id_user SERIAL,
	eml_user VARCHAR(64) NOT NULL UNIQUE,
	cod_password VARCHAR(64) NOT NULL,
	flg_active BIT NOT NULL DEFAULT 1,
	PRIMARY KEY (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE UNIQUE INDEX index_eml_user ON User (eml_user);

CREATE TABLE IF NOT EXISTS User_Details (
	id_user BIGINT UNSIGNED NOT NULL,
	nam_first VARCHAR(64) NOT NULL,
	nam_last VARCHAR(128) NOT NULL,
	enu_sex ENUM ('M', 'F') NOT NULL,
	flg_allow_emails BIT NOT NULL DEFAULT 1,
	dat_birth DATE NOT NULL,
	dat_creation DATETIME NOT NULL,
	PRIMARY KEY (id_user),
	FOREIGN KEY (id_user) REFERENCES User (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
