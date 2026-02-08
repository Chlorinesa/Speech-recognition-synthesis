<?php
require 'config.php';    
require 'db_connection.php';
require 'validate_session.php';

$userId = validateSession();
if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
    exit;
}

$query = "
    SELECT action, details, created_at 
    FROM user_history 
    WHERE user_id = $1 
    ORDER BY created_at DESC 
    LIMIT 50
";
$result = pg_query_params($conn, $query, [$userId]);

if ($result) {
    $history = pg_fetch_all($result) ?: [];
    echo json_encode([
        'success' => true,
        'history' => $history
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка загрузки истории']);
}
?>