<?php
include("db.php");

if(isset($_POST['username']) && isset($_POST['password'])){
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (username, password) VALUES ('$username', '$password')";
    if($conn->query($sql)){
        echo "Registration Successful! <a href='../login.html'>Login Here</a>";
    } else {
        echo "Error: " . $conn->error;
    }
}
?>