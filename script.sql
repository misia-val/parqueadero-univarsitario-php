-- DROP database if exists uproject;
-- CREATE DATABASE uproject;
-- USE uproject;

CREATE TABLE estudiante (
    id_estudiante int primary key auto_increment,
    nombre VARCHAR(100) NOT NULL,
    documento VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    carrera VARCHAR(100),
    rol VARCHAR(50)
);

CREATE TABLE vigilante (
    id_vigilante int primary key auto_increment,
    nombre VARCHAR(100) NOT NULL,
    documento VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    turno VARCHAR(50),
    rol VARCHAR(50)
);

CREATE TABLE infoReservas(
id_reserva int primary key auto_increment,
vehicle enum('moto','carro') not null,
entry_date timestamp null default null,
exit_date timestamp null default null,
observations varchar(5),
parking_number varchar(3),
is_inside bool,
registration_date timestamp default current_timestamp,
idEstudiante int,
foreign key (idEstudiante) references estudiante(id_estudiante)
);


INSERT INTO estudiante (nombre, documento, correo, contrasena, carrera, rol) VALUES
  ('Johan Sebastian Gonzalez', '1034779183', 'johan.gonzalez@uniminuto.edu.co', '123', 'Ingeniería de Sistemas', 'ESTUDIANTE')

INSERT INTO vigilante (nombre, documento, correo, contrasena, turno, rol) VALUES
('Valentina Saenz Castillo', '1034779184', 'valentina.saenz@uniminuto.edu.co', '123', 'Día', 'VIGILANTE')

INSERT INTO infoReservas (
  vehicle,
  entry_date,
  exit_date,
  observations,
  parking_number,
  is_inside,
  registration_date,
  idEstudiante
) VALUES (
  'moto',                -- tipo de vehículo ('moto' o 'carro')
  '2025-10-29 08:00:00', -- fecha y hora de entrada
  '2025-10-29 18:00:00', -- fecha y hora de salida
  'ninguna',             -- observaciones
  'A01',                 -- número de parqueadero
  true,                  -- está adentro
  CURRENT_TIMESTAMP,     -- fecha de registro
  1                      -- id del estudiante ligado
);

select * FROM estudiante;
select * from infoReservas;
DESC infoReservas;
ALTER TABLE infoReservas modify column vehicle enum('Moto','Carro') not null;

-- Consulta para obtener la información de la reserva con id 1 y el estudiante ligado
SELECT infoReservas.*, estudiante.*
FROM infoReservas
INNER JOIN estudiante ON infoReservas.idEstudiante = estudiante.id_estudiante
WHERE infoReservas.id_reserva = 1;

DELIMITER //
CREATE FUNCTION parkingLotsAvailables1(vehiculo varchar(5), horaEntrada time, horaSalida time)
RETURNS smallint
READS SQL DATA
BEGIN
    DECLARE total smallint;
    DECLARE resultado smallint;
    DECLARE numeroParqueaderos smallint;
    DECLARE entryTime time;
    DECLARE exitTime time;
    SET entryTime = cast(concat(curdate(),' ',horaEntrada)AS DATETIME);
    SET exitTime = cast(concat(curdate(),' ',horaSalida)AS DATETIME);
    SELECT COUNT(*) into total FROM inforeservas WHERE vehicle = vehiculo AND entry_date < exitTime AND exit_date > entryTime;
    IF vehiculo = 'moto'
        THEN set numeroParqueaderos = 1;
    ELSE
        set numeroParqueaderos = 3;
    END IF;
    SET resultado = numeroParqueaderos - total;
    IF resultado <=0
        THEN set resultado = 0;
    END IF;
    RETURN resultado;
END //
DELIMITER ;

DROP FUNCTION parkingLotsAvailables;
SELECT parkingLotsAvailables('CARRO', '08:00:00', '18:00:00');  