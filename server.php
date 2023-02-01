<?php
// php нативно не умеет работать с форматом данных JSON
// Но поработать с ними есть возможность (строка 5)
// На php получаем JSON-данные
$_POST = json_decode(file_get_contents("php://input"), true);
echo var_dump($_POST);