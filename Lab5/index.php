<?php

$db = new mysqli("localhost", "seba", " ", "baza");
$db->set_charset("utf8");

$products = $db->query("select * from produkty_ilosc");
$db->close();

session_start();
?>

<html>

<head>
    <title>Sklep tostowy</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.orange-deep_orange.min.css" />
    <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
    <style type="text/css">
        .mdl-data-table th {
            text-align: center;
            color: black;
        }

        .mdl-data-table td {
            text-align: center;
        }

        .mdl-data-table {
            width: 100%;
        }
        .finalize{
            width: 40%;
            margin-left: 30%;
            margin-top: 5%;
        }
    </style>
</head>

<body>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header class="mdl-layout__header">
            <div class="mdl-layout__header-row">
                <span class="mdl-layout-title">Witamy w sklepie tostowym!</span>
            </div>
        </header>
        <main class="mdl-layout__content">
            <div class="page-content">

                <div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
                    <div class="mdl-tabs__tab-bar">
                        <a href="#produkty-panel" class="mdl-tabs__tab is-active">Produkty <i class="material-icons">restaurant</i></a>
                        <a href="#koszyk-panel" class="mdl-tabs__tab">Koszyk <i class="material-icons">local_grocery_store</i></a>
                    </div>

                    <div class="mdl-tabs__panel is-active" id="produkty-panel">
                        <table class="mdl-data-table mdl-js-data-table mdl-data-table mdl-shadow--2dp" style="width=100%;">
                            <thead>
                                <tr>
                                    <th>Nazwa produktu</th>
                                    <th>Ilość</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($products as $product) : ?>

                                    <tr>
                                        <td class="mdl-list__item-primary-content">
                                            <?= $product['nazwa'] ?>
                                        </td>
                                        <td class="mdl-list__item-primary-content">
                                            <?= $product['ilosc'] ?>
                                        </td>
                                        <td>
                                            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onclick="location.href='./basket.php?action=add&product=<?= $product['nazwa'] ?>'">
                                                <i class="material-icons">add</i> Dodaj do koszyka
                                            </button>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>

                    <div class="mdl-tabs__panel" id="koszyk-panel">
                        <table class="mdl-data-table mdl-js-data-table mdl-data-table mdl-shadow--2dp" style="width=100%;">
                            <thead>
                                <tr>
                                    <th>Nazwa produktu</th>
                                    <th>Ilość</th>
                                    <th> <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onclick="location.href='./basket.php?action=empty'">
                                            <i class="material-icons">delete</i> Wyczyść koszyk
                                        </button></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($_SESSION as $nazwa => $ilosc) : ?>
                                    <tr>
                                        <td class="mdl-list__item-primary-content">
                                            <?= $nazwa ?>
                                        </td>
                                        <td class="mdl-list__item-primary-content">
                                            <?= $ilosc ?>
                                        </td>
                                        <td>
                                            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onclick="location.href='./basket.php?action=remove&product=<?= $nazwa ?>'">
                                                <i class="material-icons">clear</i> Usuń z koszyka
                                            </button>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect finalize" onclick="location.href='./finalize.php'">
                            <i class="material-icons">attach_money</i> Finalizuj swój zakup
                        </button>

                    </div>
                </div>

            </div>
        </main>
    </div>

</body>

</html>