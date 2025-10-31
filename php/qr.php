<?php
include "conexionSQL.php";
session_start();

if (!isset($_SESSION["id_estudiante"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

$id = $_SESSION["id_estudiante"];
$sql = "SELECT id_reserva, exit_date, parking_number FROM inforeservas WHERE idEstudiante = ? ORDER BY exit_date DESC";
$stmt = $connection->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(["error" => "No encontrado"]);
}





?>