<?php
$servername = "8080";
$username = "postgres";
$password = "200496";
$dbname = "REMINDER";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
echo "Conexión exitosa";
?>