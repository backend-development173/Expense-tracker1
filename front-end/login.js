
document.getElementById('login-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const userMail=document.getElementById('email').value;
    const userPassword=document.getElementById('password').value;
    const obj={
        userMail,
        userPassword
    }

   axios.post('http://localhost:3000/user/login',obj).then(result=>{
       console.log(result);
       console.log(result.data.message)
      if(result.status==200){
        alert(`${result.data.message}`);
      }
  
      document.getElementById('email').value='';
      document.getElementById('password').value='';  
      localStorage.setItem('token',result.data.token)

      window.location.href='./expense.html'
      
   }).catch(err=>{
    console.log(err)
      if(err.response.status==401 || err.response.status==404){
        alert(`${err.response.data.message}`);
      }
       
   })
})

