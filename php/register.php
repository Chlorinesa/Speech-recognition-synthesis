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

$password = $data['password'];
if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Пароль должен содержать не менее 6 символов']);
    exit;
}

$checkQuery = "SELECT id FROM users WHERE email = $1";
$checkResult = pg_query_params($conn, $checkQuery, [$email]);

if (!$checkResult) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка базы данных']);
    exit;
}

if (pg_num_rows($checkResult) > 0) {
    echo json_encode(['success' => false, 'message' => 'Пользователь с таким email уже существует']);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);

$insertQuery = "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at";
$insertResult = pg_query_params($conn, $insertQuery, [$email, $hash]);

if (!$insertResult) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка создания пользователя']);
    exit;
}
$user = pg_fetch_assoc($insertResult);

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
?>