<?php
session_start();

if (isset($_GET['action'])) {

    switch ($_GET['action']) {
        case 'add':
            if (isset($_SESSION[$_GET['product']]))
                $_SESSION[$_GET['product']] += 1;
            else
                $_SESSION[$_GET['product']] = 1;
            break;
        case 'remove':
            $_SESSION[$_GET['product']] -= 1;
            if ($_SESSION[$_GET['product']] == 0)
                unset($_SESSION[$_GET['product']]);
            break;
        default:
            session_unset();
            break;
    }
}
header("Location: .");
