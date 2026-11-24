-- ============================================================
-- Bulk load de datos seed desde archivos .csv
-- Base de datos: mi_base (MariaDB)
-- Los .csv deben estar en la carpeta ./seed relativa a la BD
-- Ejecutar: mariadb -u user -p mi_base < seed/load_data.sql
-- ============================================================


SET FOREIGN_KEY_CHECKS = 0;

-- 01. Users (PK: id_user)
LOAD DATA LOCAL INFILE '/home/fede/work/cecit/cecit-backend/seed/01_users.csv'
INTO TABLE Users
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id_user, name, last_name, dni);

-- 02. Accounts (FK: id_user -> Users.id_user)
LOAD DATA LOCAL INFILE '/home/fede/work/cecit/cecit-backend/seed/02_accounts.csv'
INTO TABLE `Accounts`
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id_user, email, password, role, @active)
SET active = IF(@active = '1', TRUE, FALSE);


-- 03. BenefitTypes (PK autoincremental: id_type)
LOAD DATA LOCAL INFILE '/home/fede/work/cecit/cecit-backend/seed/03_benefit_types.csv'
INTO TABLE `BenefitTypes`
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id_type, name, @active)
SET active = IF(@active = '1', TRUE, FALSE);

-- 04. Categories (PK autoincremental: id_category)
LOAD DATA LOCAL INFILE '/home/fede/work/cecit/cecit-backend/seed/04_categories.csv'
INTO TABLE `Categories`
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id_category, name, icon_url, @active)
SET active = IF(@active = '1', TRUE, FALSE);

-- 05. PaymentMethods (PK autoincremental: id_payment_method)
LOAD DATA LOCAL INFILE '/home/fede/work/cecit/cecit-backend/seed/05_payment_methods.csv'
INTO TABLE `PaymentMethods`
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id_payment_method, name, @active)
SET active = IF(@active = '1', TRUE, FALSE);

-- 06. Partners (PK: id_partner, FK: id_owner -> Users.id_user)
LOAD DATA LOCAL INFILE '/home/fede/work/cecit/cecit-backend/seed/06_partners.csv'
INTO TABLE `Partners`
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id_partner, name, logo, id_owner, @active)
SET active = IF(@active = '1', TRUE, FALSE);


-- 07. Directions (PK: id_partner, FK: id_partner -> Partners.id_partner)
LOAD DATA LOCAL INFILE '/home/fede/work/cecit/cecit-backend/seed/07_directions.csv'
INTO TABLE `Directions`
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id_partner, direction);



-- 08. Benefits (FK: id_admin -> Accounts.id_user, id_partner -> Partners.id_partner, id_type -> BenefitTypes.id_type)
LOAD DATA LOCAL INFILE '/home/fede/work/cecit/cecit-backend/seed/08_benefits.csv'
INTO TABLE `Benefits`
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id_benefit, id_admin, id_partner, date_entered, start_date, end_date, image, title, description, status, id_type, max_coupons, coupons, max_per_user);



-- 09. Vouchers (PK: token, FK: id_user -> Users.id_user, id_benefit -> Benefits.id_benefit)
LOAD DATA LOCAL INFILE '/home/fede/work/cecit/cecit-backend/seed/09_vouchers.csv'
INTO TABLE `Vouchers`
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n'
IGNORE 1 LINES
(token, id_user, id_benefit, application_date, @delivery_date, limit_date, status)
SET delivery_date = NULLIF(@delivery_date, '');


-- 10. PaymentMethods_Benefits (PK compuesta, FK a PaymentMethods y Benefits)
LOAD DATA LOCAL INFILE '/home/fede/work/cecit/cecit-backend/seed/11_payment_methods_benefits.csv'
INTO TABLE `PaymentMethods_Benefits`
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id_payment_method, id_benefit);

-- 11. Partners_Admins (PK compuesta, FK a Accounts y Partners)
LOAD DATA LOCAL INFILE '/home/fede/work/cecit/cecit-backend/seed/12_partners_admins.csv'
INTO TABLE `Partners_Admins`
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id_account, id_partner);

-- 13. Partners_Categories (PK compuesta, FK a Partners y Categories)
LOAD DATA LOCAL INFILE '/home/fede/work/cecit/cecit-backend/seed/13_partners_categories.csv'
INTO TABLE `Partners_Categories`
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id_partner, id_category);

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Bulk load completado correctamente' AS mensaje;
