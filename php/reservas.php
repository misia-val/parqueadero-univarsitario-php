<?php
header('Content-Type: application/json');
require ('conexionSQL.php');
date_default_timezone_set('America/Bogota');
$input = json_decode(file_get_contents("php://input"), true);
session_start();
if (!isset($_SESSION["id_estudiante"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

$id = $_SESSION["id_estudiante"];

//Muestra en el frontend en la parte superior el numero de cupos disponibles
if(isset($input['type']) && isset($input['entryTime']) && isset($input['exitTime'])){
    $type = $input['type'];
    $entryTime = str_replace(' ', '',$input['entryTime']);
    $exitTime = str_replace(' ', '', $input['exitTime']);

    //opción1
    $parqueaderosDisponibles1 = mysqli_query($connection, "SELECT parkingLotsAvailables1('$type', '$entryTime', '$exitTime') AS cupos");
    $row1 = mysqli_fetch_assoc($parqueaderosDisponibles1);
    $totalCupos1 = $row1['cupos'];
    //opción2
        // $cupos1 = mysqli_prepare($connection, "SELECT parkingLotsAvailables1(?,?,?) AS cupos");
        // mysqli_stmt_bind_param($cupos1, "sss", $type, $entryTime, $exitTime);
        // mysqli_stmt_execute($cupos1);
        // mysqli_stmt_bind_result($cupos1, $totalCupos1);
        // mysqli_stmt_fetch($cupos1);
        // mysqli_stmt_close($cupos1);
    $response = [
        'vehiculo' => $type,
        // 'entry Time' => $entryTime,
        // 'exit Time' => $exitTime,
        'cuposDisponibles1' => $totalCupos1
    ];
    echo json_encode($response);

    
}else if(isset($input['typee']) && isset($input['entryTimee']) && isset($input['exitTimee'])){
    //Sugiere el numero de parqueaderos disponibles y la hora en la que los cupos estaran disponibles
    $type = $input['typee'];
    $entryTime = str_replace(' ', '',$input['entryTimee']);
    $exitTime = str_replace(' ', '', $input['exitTimee']);

    $mysp = mysqli_query($connection, "CALL sugerirDisponibilidad('$type', '$entryTime', '$exitTime')");
    $result = mysqli_fetch_assoc($mysp);

    $cupos = $result['cupos'];
    $horaCupos = $result['sugerida'];

    $response=[
        'cupos'=>$cupos,
        'horaCupos'=>$horaCupos
    ];

    echo json_encode($response);
}else if(isset($input['placa']) && isset($input['vehiculo']) && isset($input['ingreso']) && isset($input['salida']) && isset($input['observations'])){
    //Inserta los datos, asigna un numero random y el numero del parqueadero al estudiante
    $placa = $input['placa'];
    $vehiculo = $input['vehiculo'];
    $ingreso = $input['ingreso'];
    $salida = $input['salida'];
    $observations = $input['observations'];
    $estudiante = $id;
    //elimina los espacios de la hora
    $ingreso = str_replace(' ', '', $ingreso);
    $salida = str_replace(' ', '', $salida);
    $valueIngreso = getdate()['year'].'-'.getdate()['mon'].'-'.getdate()['mday'].' '.$ingreso;
    $valueSalida = getdate()['year'].'-'.getdate()['mon'].'-'.getdate()['mday'].' '.$salida;

    // if ($vehiculo !== '------' && $ingreso !== '--:--' && $salida !== '--:--'){
    //     mysqli_query($connection, "INSERT INTO inforeservas (vehicle, entry_date, exit_date, observations, idEstudiante) VALUES ('$vehiculo','$valueIngreso','$valueSalida','$observations',$estudiante)");
    // }
    // Ejecutar el procedimiento almacenado
    $sp = mysqli_query($connection, "CALL asignarParqueadero('$vehiculo', '$ingreso', '$salida')");
    if ($sp && $result = mysqli_fetch_assoc($sp)) {
        $parkingNumber = $result['parking_number']; // o 'numero_parqueadero' según el alias en tu SP
        mysqli_free_result($sp);
        mysqli_next_result($connection);
        if ($parkingNumber !== null) {
            
            if ($placa !== '' && $vehiculo !== '' && $ingreso !== '' && $salida !== ''){
                mysqli_query($connection, "INSERT INTO inforeservas (placa, vehicle, entry_date, exit_date, observations,parking_number, idEstudiante) VALUES ('$placa','$vehiculo','$valueIngreso','$valueSalida','$observations','$parkingNumber',$estudiante)");
            }
            // Ya tienes el número de parqueadero disponible
            // Puedes usarlo para insertar la reserva, mostrarlo al usuario, etc.
            // echo "Parqueadero asignado: " . $parkingNumber;
            }else {
                echo "No hay parqueaderos disponibles para ese rango.";
            }
        }else{
            echo "Error al ejecutar el procedimiento: " . mysqli_error($connection);
        }
        mysqli_close($connection);
        $randomNumner = rand(10, 99);
        $response=[
            'vehiculo'=>$vehiculo,
            'ingreso'=>$ingreso,
            'salida'=>$salida,
            'observaciones'=>$observations,
            'randomNumber'=> $randomNumner,
            'parkingNumber'=> $parkingNumber
        ];
        echo json_encode($response);
    }else{
        echo json_encode(['error'=>'Ruta no especificada']);
    }
exit;

// if (!$input || !isset($input['type'])) {
//     $response=[
//         'error'=>'Tipo no especificado'
//     ];
//     echo json_encode($response);
//     exit;
// }

// $type = $input['type'];
//   //opción1
//   $parqueaderosDisponibles = mysqli_query($connection, "SELECT parkingLotsAvailabless('$type') AS cupos");
//   $row = mysqli_fetch_assoc($parqueaderosDisponibles);
//   $totalCupos = $row['cupos'];
//   //opción2
//     // $cupos = mysqli_prepare($connection, "SELECT parkingLotsAvailabless(?) AS cupos");
//     // mysqli_stmt_bind_param($cupos, "s", $type);
//     // mysqli_stmt_execute($cupos);
//     // mysqli_stmt_bind_result($cupos, $totalCupos);
//     // mysqli_stmt_fetch($cupos);
//     // mysqli_stmt_close($cupos);
//   $response = [
//     'cuposDisponibles' => $totalCupos,
//     'tipo' => $type
//   ];