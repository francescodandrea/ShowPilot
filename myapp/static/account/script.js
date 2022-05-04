function verifylogin(){
    let email=document.querySelector("#email").value;
    let pass=document.querySelector("#password").value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       let response=JSON.parse(this.responseText);
       if(response.result){
        window.location.replace("/");
       }else{
        document.querySelector("#loginerr").innerHTML=response.message;
       }
      }
    };
    xhttp.open("POST", "auth?email="+email+"&pass="+pass, true);
    xhttp.send();
}