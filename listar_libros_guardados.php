<?php
header('Content-Type: application/json');
$conexion = new mysqli("localhost", "root", "", "libros");

if ($conexion->connect_error) {
    echo json_encode(["error" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}

$sql = "SELECT * FROM libros_guardados";
$resultado = $conexion->query($sql);

$libros = [];

while ($fila = $resultado->fetch_assoc()) {
    $libros[] = $fila;
}

echo json_encode($libros);
$conexion->close();
?>
