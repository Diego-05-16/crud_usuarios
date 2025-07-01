<?php
$servername = "localhost"; 
$username = "root";        
$password = "";            
$dbname = "crud_usuarios"; //OJO ---> Cambiar nombre si existe falla

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión: " . $conn->connect_error]));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
       
        $sql = "SELECT * FROM usuarios";
        $result = $conn->query($sql);
        $usuarios = [];

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $usuarios[] = $row;
            }
        }
        echo json_encode(["success" => true, "data" => $usuarios]);
        break;

    case 'POST':
       
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['nombre']) || !isset($data['apellido']) || !isset($data['email'])) {
            echo json_encode(["success" => false, "message" => "Datos incompletos"]);
            $conn->close();
            exit();
        }

        if (isset($data['id'])) {
            $id = $conn->real_escape_string($data['id']);
            $nombre = $conn->real_escape_string($data['nombre']);
            $apellido = $conn->real_escape_string($data['apellido']);
            $direccion = $conn->real_escape_string($data['direccion']);
            $email = $conn->real_escape_string($data['email']);
            $contrasena = $conn->real_escape_string($data['contrasena']);
            $fechaActualizacion = $conn->real_escape_string($data['fechaActualizacion']);

            $sql = "UPDATE usuarios SET nombre='$nombre', apellido='$apellido', direccion='$direccion', email='$email', contrasena='$contrasena', fechaActualizacion='$fechaActualizacion' WHERE id=$id";

            if ($conn->query($sql) === TRUE) {
                echo json_encode(["success" => true, "message" => "Usuario actualizado correctamente."]);
            } else {
                echo json_encode(["success" => false, "message" => "Error al actualizar usuario: " . $conn->error]);
            }

        } else {
            $nombre = $conn->real_escape_string($data['nombre']);
            $apellido = $conn->real_escape_string($data['apellido']);
            $direccion = $conn->real_escape_string($data['direccion']);
            $email = $conn->real_escape_string($data['email']);
            $contrasena = $conn->real_escape_string($data['contrasena']);
            $fechaCreacion = $conn->real_escape_string($data['fechaCreacion']);
            $fechaActualizacion = $conn->real_escape_string($data['fechaActualizacion']);

            $sql = "INSERT INTO usuarios (nombre, apellido, direccion, email, contrasena, fechaCreacion, fechaActualizacion)
                    VALUES ('$nombre', '$apellido', '$direccion', '$email', '$contrasena', '$fechaCreacion', '$fechaActualizacion')";

            if ($conn->query($sql) === TRUE) {
                $last_id = $conn->insert_id;
                echo json_encode(["success" => true, "message" => "Nuevo usuario creado correctamente.", "id" => $last_id]);
            } else {
                echo json_encode(["success" => false, "message" => "Error al crear usuario: " . $conn->error]);
            }
        }
        break;

    case 'DELETE':
      
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if ($id > 0) {
            $sql = "DELETE FROM usuarios WHERE id=$id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["success" => true, "message" => "Usuario eliminado correctamente."]);
            } else {
                echo json_encode(["success" => false, "message" => "Error al eliminar usuario: " . $conn->error]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "ID de usuario no proporcionado."]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Método no permitido."]);
        break;
}

$conn->close();
?>