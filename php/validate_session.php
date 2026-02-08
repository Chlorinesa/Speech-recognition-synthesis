<?php

function validateSession() {
    if (isset($_SESSION['user_id']) && !empty($_SESSION['user_id'])) {
        return (int) $_SESSION['user_id'];
    }
    return false;
}
?>