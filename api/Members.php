<?php
// church-system/api/members.php

// 1. ALLOW REACT TO ACCESS THIS (CORS HEADERS)
header("Access-Control-Allow-Origin: *"); // Allow any domain (dev mode)
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

// 2. SIMULATED DATABASE DATA (Replace this with real SQL later)
$members = [
    [
        "id" => 1,
        "name" => "Joseph Abassah",
        "role" => "Admin",
        "status" => "Active",
        "email" => "joseph@church.com"
    ],
    [
        "id" => 2,
        "name" => "Sarah Smith",
        "role" => "Member",
        "status" => "Active",
        "email" => "sarah@gmail.com"
    ],
    [
        "id" => 3,
        "name" => "John Doe",
        "role" => "Guest",
        "status" => "Inactive",
        "email" => "john@yahoo.com"
    ]
];

// 3. SEND DATA AS JSON
echo json_encode($members);

/* --- REAL DATABASE CONNECTION PATTERN (Use this later) ---
   
   $conn = new mysqli("localhost", "root", "", "church_db");
   $result = $conn->query("SELECT * FROM members");
   
   $data = array();
   while ($row = $result->fetch_assoc()) {
       $data[] = $row;
   }
   echo json_encode($data);
*/
?>