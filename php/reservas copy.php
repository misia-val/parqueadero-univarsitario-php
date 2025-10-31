<?php
header('Content-Type: application/json');
require('../connectionSQL/connectionSQL.php');
date_default_timezone_set('America/Bogota');
$input = json_decode(file_get_contents("php://input"), true);

if(isset($input['type']) && isset($input['entryTime']) && isset($input['exitTime'])){
    $type = $input['type'];
    $entryTime = str_replace(' ', '', $input['entryTime']);
    $exitTime = str_replace(' ', '', $input['exitTime']);

    $parqueaderosDisponibles1 = mysqli_query($connection, "SELECT parkingLotsAvailables1('$type', '$entryTime', '$exitTime') AS cupos");
    if ($parqueaderosDisponibles1) {
        $row1 = mysqli_fetch_assoc($parqueaderosDisponibles1);
        $totalCupos1 = $row1['cupos'];
        $response = [
            'vehiculo' => $type,
            'cuposDisponibles1' => $totalCupos1
        ];
        echo json_encode($response);
    } else {
        echo json_encode(['error' => 'Error en la consulta de cupos']);
    }
    exit;

} else if(isset($input['typee']) && isset($input['entryTimee']) && isset($input['exitTimee'])){
    $type = $input['typee'];
    $entryTime = str_replace(' ', '', $input['entryTimee']);
    $exitTime = str_replace(' ', '', $input['exitTimee']);

    $mysp = mysqli_query($connection, "CALL sugerirDisponibilidad('$type', '$entryTime', '$exitTime')");
    if ($mysp) {
        $result = mysqli_fetch_assoc($mysp);
        $cupos = $result['cupos'];
        $horaCupos = $result['sugerida'];
        $response = [
            'cupos' => $cupos,
            'horaCupos' => $horaCupos
        ];
        echo json_encode($response);
    } else {
        echo json_encode(['error' => 'Error en la consulta de sugerencia']);
    }
    exit;

} else if(isset($input['vehiculo']) && isset($input['ingreso']) && isset($input['salida']) && isset($input['observations']) && isset($input['estudiante'])){
    $vehiculo = $input['vehiculo'];
    $ingreso = str_replace(' ', '', $input['ingreso']);
    $salida = str_replace(' ', '', $input['salida']);
    $observations = $input['observations'];
    $estudiante = $input['estudiante'];
    $valueIngreso = date('Y-m-d') . ' ' . $ingreso;
    $valueSalida = date('Y-m-d') . ' ' . $salida;

    $parkingNumber = null;
    $sp = mysqli_query($connection, "CALL asignarParqueadero('$vehiculo', '$ingreso', '$salida')");
    if ($sp && $result = mysqli_fetch_assoc($sp)) {
        $parkingNumber = $result['parking_number'];
        mysqli_free_result($sp);
        mysqli_next_result($connection);

        if ($parkingNumber !== null) {
            $insert = mysqli_query($connection, "INSERT INTO inforeservas (vehicle, entry_date, exit_date, observations, parking_number, idEstudiante) VALUES ('$vehiculo','$valueIngreso','$valueSalida','$observations','$parkingNumber',$estudiante)");
            if (!$insert) {
                echo json_encode(['error' => 'Error al guardar la reserva']);
                exit;
            }
        } else {
            echo json_encode(['error' => 'No hay parqueaderos disponibles para ese rango']);
            exit;
        }
    } else {
        echo json_encode(['error' => 'Error al ejecutar el procedimiento de asignación']);
        exit;
    }

    mysqli_close($connection);
    $randomNumber = rand(10, 99);
    $response = [
        'vehiculo' => $vehiculo,
        'ingreso' => $ingreso,
        'salida' => $salida,
        'observaciones' => $observations,
        'randomNumber' => $randomNumber,
        'parkingNumber' => $parkingNumber
    ];
    echo json_encode($response);
    exit;

} else {
    echo json_encode(['error' => 'Ruta no especificada']);
    exit;
}
?>