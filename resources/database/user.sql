INSERT INTO User (eml_user, cod_password, flg_active) VALUES ('teste@intelipost.com.br', 'teste123', 1);
INSERT INTO User_Details (id_user, nam_first, nam_last, enu_sex, flg_allow_emails, dat_birth, dat_creation) VALUES (1, 'Inteli', 'Post', 'M', 1, now(), now());

CREATE USER 'intelipost'@'localhost' IDENTIFIED BY '1nt3l1p0st';
GRANT ALL PRIVILEGES ON intelipost.* TO 'intelipost'@'localhost';
FLUSH PRIVILEGES;