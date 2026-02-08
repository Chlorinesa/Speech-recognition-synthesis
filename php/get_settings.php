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
    SELECT 
        voice, 
        rate, 
        pitch, 
        volume, 
        highlight_color, 
        highlight_text_color 
    FROM user_settings 
    WHERE user_id = $1
";
$result = pg_query_params($conn, $query, [$userId]);

if (pg_num_rows($result) > 0) {
    $settings = pg_fetch_assoc($result);
    echo json_encode([
        'success' => true,
        'settings' => [
            'voice' => $settings['voice'],
            'rate' => (float)$settings['rate'],
            'pitch' => (float)$settings['pitch'],
            'volume' => (float)$settings['volume'],
            'highlightColor' => $settings['highlight_color'],
            'highlightTextColor' => $settings['highlight_text_color']
        ]
    ]);
} else {
    // Возвращаем настройки по умолчанию
    echo json_encode([
        'success' => true,
        'settings' => [
            'voice' => 'default',
            'rate' => 1.0,
            'pitch' => 1.0,
            'volume' => 1.0,
            'highlightColor' => '#e69fd9',
            'highlightTextColor' => '#ffffff'
        ]
    ]);
}
?>