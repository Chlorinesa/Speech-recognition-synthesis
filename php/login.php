<?php
require 'config.php';
require 'db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Не хватает данных']);
    exit;
}

$email = trim($data['email']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Неверный формат email']);
    exit;
}

if (empty($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Введите пароль']);
    exit;
}

$query = "SELECT id, email, password_hash, created_at FROM users WHERE email = $1";
$result = pg_query_params($conn, $query, [$email]);

if (!$result) {
    error_log("Database error: " . pg_last_error($conn));
    echo json_encode(['success' => false, 'message' => 'Ошибка базы данных']);
    exit;
}

if (pg_num_rows($result) === 0) {
    echo json_encode(['success' => false, 'message' => 'Пользователь с таким email не найден']);
    exit;
}

$user = pg_fetch_assoc($result);

if (password_verify($data['password'], $user['password_hash'])) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'created_at' => $user['created_at']
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Неверный пароль']);
}
?>