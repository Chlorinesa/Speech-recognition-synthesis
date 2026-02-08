<?php
// чтение из .env файла
if (file_exists(__DIR__ . '/../.env')) {
    $env = parse_ini_file(__DIR__ . '/../.env');
    $host = $env['DB_HOST'] ?? "localhost";
    $dbname = $env['DB_NAME'] ?? "synthesis_db";
    $user = $env['DB_USER'] ?? "postgres";
    $password = $env['DB_PASSWORD'] ?? "";
} else {
    // значения по умолчанию если .env не найден
    $host = "localhost";
    $dbname = "synthesis_db";
    $user = "postgres";
    $password = "";
}

$conn = pg_connect("host=$host dbname=$dbname user=$user password=$password");
if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed']));
}
?>