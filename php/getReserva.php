<?php
include "conexionSQL.php";
session_start();

if (!isset($_SESSION["id_estudiante"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

// Puedes obtener el id_reserva por GET o POST, aquí ejemplo por GET:
$id_reserva = isset($_GET["id_reserva"]) ? intval($_GET["id_reserva"]) : 1;

$sql = "SELECT infoReservas.*, estudiante.*
        FROM infoReservas
        INNER JOIN estudiante ON infoReservas.idEstudiante = estudiante.id_estudiante
        WHERE infoReservas.id_reserva = ?";
$stmt = $connection->prepare($sql);
$stmt->bind_param("i", $id_reserva);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(["error" => "No encontrado"]);
}
?>