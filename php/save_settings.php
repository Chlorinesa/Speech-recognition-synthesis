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
$json = file_get_contents("php://input");
if(empty($json)){
    echo json_encode(['success' => false, 'message' => 'Gecnjq pfghjc']);
    exit;
}
$data = json_decode(file_get_contents("php://input"), true);

$settings = $data['settings'] ?? [];

// проверка существования настроек
$checkQuery = "SELECT id FROM user_settings WHERE user_id = $1";
$checkResult = pg_query_params($conn, $checkQuery, [$userId]);

if (pg_num_rows($checkResult) > 0) {
    // обновление существующих настроек
    $query = "
        UPDATE user_settings 
        SET 
            voice = $1, 
            rate = $2, 
            pitch = $3, 
            volume = $4, 
            highlight_color = $5, 
            highlight_text_color = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $7
    ";
    $params = [
        
        $settings['voice'] ?? 'default',
        $settings['rate'] ?? 1.0,
        $settings['pitch'] ?? 1.0,
        $settings['volume'] ?? 1.0,
        $settings['highlightColor'] ?? '#e69fd9',
        $settings['highlightTextColor'] ?? '#ffffff',
        $userId
        
    ];
} else {
    // создание новых настроек
    $query = "
        INSERT INTO user_settings 
        (user_id, voice, rate, pitch, volume, highlight_color, highlight_text_color) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    ";
    $params = [
        $userId,
        $settings['voice'] ?? 'default',
        $settings['rate'] ?? 1.0,
        $settings['pitch'] ?? 1.0,
        $settings['volume'] ?? 1.0,
        $settings['highlightColor'] ?? '#e69fd9',
        $settings['highlightTextColor'] ?? '#ffffff'
        
    ];
}



$result = pg_query_params($conn, $query, $params);

if ($result) {
    echo json_encode(['success' => true, 'message' => 'Настройки сохранены']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка сохранения настроек']);
}
?>