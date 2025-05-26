<?php
header('Content-Type: application/json');

// Conexión a la base de datos correcta
$conexion = new mysqli("localhost", "root", "", "libros");

if ($conexion->connect_error) {
    echo json_encode(["error" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}

// Obtener parámetro de búsqueda (si existe)
$busqueda = $_GET['q'] ?? '';

// Consulta preparada
$sql = "SELECT * FROM libros WHERE titulo LIKE ?";
$stmt = $conexion->prepare($sql);
$param = "%" . $busqueda . "%";
$stmt->bind_param("s", $param);
$stmt->execute();

$resultado = $stmt->get_result();
$libros = [];

while ($fila = $resultado->fetch_assoc()) {
    $libros[] = $fila;
}

echo json_encode($libros);

$stmt->close();
$conexion->close();
?>
