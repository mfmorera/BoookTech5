<?php
header("Content-Type: application/json");

$conexion = new mysqli("localhost", "root", "", "libros");


if ($conexion->connect_error) {
    echo json_encode(["success" => false, "error" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_libro']) || !isset($data['titulo'])) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

$id_libro = $data['id_libro'];
$titulo = $data['titulo'];

$sql = "INSERT INTO libros_guardados (id_libro, titulo) VALUES (?, ?)";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("is", $id_libro, $titulo);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
