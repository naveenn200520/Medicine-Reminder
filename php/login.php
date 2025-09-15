<?php
include("db.php");
session_start();

if(isset($_POST['username']) && isset($_POST['password'])){
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE username='$username'";
    $result = $conn->query($sql);

    if($result->num_rows > 0){
        $row = $result->fetch_assoc();
        if(password_verify($password, $row['password'])){
            $_SESSION['username'] = $username;
            header("Location: ../index.html");
            exit();
        } else {
            echo "Invalid Password";
        }
    } else {
        echo "User not found!";
    }
}
?>