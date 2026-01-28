<?php
session_start();
require __DIR__ . "/db/config.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  header("Location: try-for-free.html");
  exit;
}

$full_name = trim($_POST["full_name"] ?? "");
$email = trim($_POST["email"] ?? "");
$store_name = trim($_POST["store_name"] ?? "");
$password = $_POST["password"] ?? "";

if ($full_name === "" || $email === "" || $store_name === "" || $password === "") {
  header("Location: try-for-free.html");
  exit;
}

$password_hash = password_hash($password, PASSWORD_DEFAULT);

try {
  $stmt = $pdo->prepare("INSERT INTO users (full_name, email, store_name, password_hash) VALUES (?, ?, ?, ?)");
  $stmt->execute([$full_name, $email, $store_name, $password_hash]);
} catch (PDOException $e) {
  header("Location: try-for-free.html");
  exit;
}

$_SESSION["user_id"] = $pdo->lastInsertId();
$_SESSION["user_name"] = $full_name;

header("Location: index .html");
exit;
