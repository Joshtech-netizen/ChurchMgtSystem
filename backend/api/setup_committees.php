<?php
// Connect to DB
include_once 'config/Database.php';
$database = new Database();
$db = $database->getConnection();

// The password we want for everyone
$password_plain = "123456";
$hashed_password = password_hash($password_plain, PASSWORD_DEFAULT);

// List of users to create/update
$committees = [
    ['first' => 'Finance',    'last' => 'Chair',   'email' => 'finance@church.com',    'role' => 'finance'],
    ['first' => 'Youth',      'last' => 'Leader',  'email' => 'youth@church.com',      'role' => 'youth'],
    ['first' => 'Children',   'last' => 'Teacher', 'email' => 'children@church.com',   'role' => 'children'],
    ['first' => 'Building',   'last' => 'Chair',   'email' => 'building@church.com',   'role' => 'building'],
    ['first' => 'Evangelism', 'last' => 'Head',    'email' => 'evangelism@church.com', 'role' => 'evangelism']
];

echo "<h1>Setting up Committee Passwords</h1>";

foreach ($committees as $user) {
    try {
        // 1. Delete if exists (clean slate)
        $del = "DELETE FROM users WHERE email = :email";
        $stmt = $db->prepare($del);
        $stmt->bindParam(":email", $user['email']);
        $stmt->execute();

        // 2. Insert fresh
        $query = "INSERT INTO users (first_name, last_name, email, password, role) 
                  VALUES (:first, :last, :email, :pass, :role)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":first", $user['first']);
        $stmt->bindParam(":last", $user['last']);
        $stmt->bindParam(":email", $user['email']);
        $stmt->bindParam(":pass", $hashed_password);
        $stmt->bindParam(":role", $user['role']);

        if($stmt->execute()) {
            echo "<p style='color:green'>Created <strong>{$user['role']}</strong> portal ({$user['email']})</p>";
        } else {
            echo "<p style='color:red'>Failed to create {$user['email']}</p>";
        }

    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
}

echo "<h3>All passwords set to: <code>123456</code></h3>";
?>