document.getElementsByClassName('btn')[0].addEventListener('click',(e)=>{
    e.preventDefault()
    const email=document.getElementById('exampleInputEmail1').value
    console.log(email)
    axios.post('http://localhost:3000/password/forgotpassword',{email:email}).then(res=>{
        alert(`${res.data.message}`)
        window.location.href='../login.html';
    }).catch(err=>console.log(err));
        
})
