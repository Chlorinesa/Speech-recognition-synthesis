<?php
require 'config.php';   
require 'db_connection.php';
require 'validate_session.php';

$userId = validateSession();
if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'Не авторизован']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$action = $data['action'] ?? '';
$details = $data['details'] ?? '';

if (empty($action)) {
    echo json_encode(['success' => false, 'message' => 'Не указано действие']);
    exit;
}

$query = "
    INSERT INTO user_history (user_id, action, details) 
    VALUES ($1, $2, $3)
";
$result = pg_query_params($conn, $query, [$userId, $action, substr($details, 0, 255)]);

if ($result) {
    echo json_encode(['success' => true, 'message' => 'Запись истории добавлена']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка записи истории']);
}
?>