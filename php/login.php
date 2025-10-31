<?php
include "conexionSQL.php";
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $correo = $_POST["usuario"];
    $contrasena = $_POST["password"];

    // Buscar en estudiante
    $sql = "SELECT id_estudiante, rol FROM estudiante WHERE correo = ? AND contrasena = ?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param("ss", $correo, $contrasena);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        if ($row["rol"] === "ESTUDIANTE") {
            $_SESSION["id_estudiante"] = $row["id_estudiante"];
            header("Location: ../pages/indexEstudiante.html");
            exit();
        }
    }

    // Buscar en vigilante
    $sql = "SELECT id_vigilante, rol FROM vigilante WHERE correo = ? AND contrasena = ?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param("ss", $correo, $contrasena);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        if ($row["rol"] === "VIGILANTE") {
            $_SESSION["id_vigilante"] = $row["id_vigilante"];
            header("Location: ../pages/indexVigilante.html");
            exit();
        }
    }

    header("Location: ../index.html?error=1");
    exit();
}
?>