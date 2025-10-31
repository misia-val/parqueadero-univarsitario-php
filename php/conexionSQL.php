<?php
$connection = mysqli_connect('127.0.0.1', 'root', 'root', 'uproject');

if(mysqli_connect_errno()){
    die('❌ Error al conectarse a la base de datos: ' . mysqli_connect_error());
}
?>
