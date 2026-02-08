<?php
require 'config.php';

session_unset();
session_destroy();

echo json_encode(['success' => true, 'message' => 'Вы вышли из системы']);
?>