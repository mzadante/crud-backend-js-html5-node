CREATE DATABASE IF NOT EXISTS `empresa` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `empresa`;
CREATE TABLE empleado (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) DEFAULT NULL,
  `salario` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
 );

DESCRIBE empleado;

INSERT INTO empleado (nombre, salario) VALUES ('Juan', '1000'); 