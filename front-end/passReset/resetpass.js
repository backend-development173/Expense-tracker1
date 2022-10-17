document.getElementById('bnt').addEventListener("click", (e) => {
    e.preventDefault();
   
  
    let urlComplete = window.location.href;
    let id = urlComplete[urlComplete.length - 1];
    console.log(urlComplete +"tefubev")
    let newPassword = document.getElementById("newPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    if (newPassword === confirmPassword) {
      axios
        .post(`http://localhost:3000/password/updatePassword/${id}`, {
          password: newPassword,
        })
        .then((result) => {
          alert("Password Changed Successfully");
          window.location.href = "../login.html";
  
          console.log(result);
        })
        .catch((err) => console.log(err));
    }
  
    console.log(id);
  });