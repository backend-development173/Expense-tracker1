document.getElementsByClassName('btn')[0].addEventListener('click',(e)=>{
    e.preventDefault()
    const email=document.getElementById('exampleInputEmail1').value
    console.log(email)
    axios.post('http://localhost:3000/password/forgotpassword',{emailObj:email}).then(res=>{
        localStorage.setItem('forgetoekn',res.data.requestId);
        alert(`http://localhost:3000/password/resetpassword/${res.data.requestId}`)
        window.location.href='../login.html';
    }).catch(err=>console.log(err));
        
})
