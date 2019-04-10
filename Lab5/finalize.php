<?php
$db = new mysqli("localhost", "seba", " ", "baza");
$db->set_charset("utf8");
session_start();

$postTransactionState = array();

$db->begin_transaction();
$products = $db->query("select * from produkty_ilosc");

foreach ($products as $product) {
    if (isset($_SESSION[$product['nazwa']])) {
        $postTransactionState[$product['nazwa']] = $product['ilosc'] - $_SESSION[$product['nazwa']];
    }
}

$stmt = $db->prepare("UPDATE produkty_ilosc SET ilosc = ? WHERE nazwa = ?");
foreach ($postTransactionState as $nazwa => $ilosc) {
    $stmt->bind_param("is", $ilosc, $nazwa);
    $result = $stmt->execute();
}
$db->commit();
$db->close();
session_unset();
header("Location: ./goodbye.php");
