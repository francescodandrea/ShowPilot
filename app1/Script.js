function Validate() {
    var password = document.getElementById("Rpassword").value;
    var confirmPassword = document.getElementById("Rconfirm_password").value;
    if (password != confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }
    return true;
}
function Change(val){
    if(val == "r"){
        document.getElementById("LoginForm").style.display = "none";
        document.getElementById("RegForm").style.display = "block";
    }else if(val == "l"){
        document.getElementById("LoginForm").style.display = "block";
        document.getElementById("RegForm").style.display = "none";
    }
}