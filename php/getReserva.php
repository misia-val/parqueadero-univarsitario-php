<?php
header("Content-Type: application/json");
include "conexionSQL.php";
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id_reserva = $_POST["id_reservas"] ?? "";

    if (empty($id_reserva)) {
        echo json_encode(["error" => "ID vacío"]);
        exit;
    }

    $sql = "SELECT 
                infoReservas.id_reserva,
                infoReservas.entry_date,
                infoReservas.exit_date,
                infoReservas.placa,
                infoReservas.vehicle,
                infoReservas.observations,
                estudiante.nombre
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

    $stmt->close();
    $connection->close();
} else {
    echo json_encode(["error" => "Método inválido"]);
}
?>
