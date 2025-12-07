<?php
// Connect to DB
include_once 'config/Database.php';
$database = new Database();
$db = $database->getConnection();

$first_name = "Admin";
$last_name = "User";
$email = "admin@church.com";
$password = "123456"; // The plain text password

// 1. Generate the secure hash using YOUR server's algorithm
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

try {
    // 2. Clear old user to avoid duplicates
    $delete = "DELETE FROM users WHERE email = :email";
    $stmt = $db->prepare($delete);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    // 3. Insert new user
    $query = "INSERT INTO users (first_name, last_name, email, password) 
              VALUES (:first, :last, :email, :pass)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":first", $first_name);
    $stmt->bindParam(":last", $last_name);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":pass", $hashed_password);

    if($stmt->execute()) {
        echo "<h1>Success!</h1>";
        echo "<p>User <strong>$email</strong> created.</p>";
        echo "<p>Password: <strong>$password</strong></p>";
        echo "<p>Hash stored: $hashed_password</p>";
    } else {
        echo "Failed to create user.";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>