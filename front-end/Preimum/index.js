const expenseList=document.getElementById('expense-list');
const mainContent=document.getElementById('main-content')



document.getElementsByClassName('btn')[1].addEventListener('click',(e)=>{
    e.preventDefault()
    const description=document.getElementById('inputDescription').value;
    const category=document.getElementById('inputCategory').value;
    const amount=document.getElementById('inputPrice').value;

    const obj={
        description,
        category,
        amount
    }
    console.log(obj)
    const token=localStorage.getItem('token')
    axios.post('http://localhost:3000/expense/AddExpense',obj,{headers:{"Authorization":token}}).then(result=>{
        console.log('user added')
        console.log(result.amount +"line20")
        if(result.status==200)
        alert(`${result.data.message}`);
        const obj1=result.data.obj;
        console.log(obj1 + "line24")
        showExpenseinUI(obj)
        
        
        
    }).catch(err=>{
        if(err.response.status==401){
            alert(`${err.response.data.message}`);
        }

    });
})


window.addEventListener('DOMContentLoaded',()=>{
    const token=localStorage.getItem('token')
   
    // axios.get('http://localhost:3000/expense/getExpense?page=1&limit=2',{headers:{"Authorization":token}}).then(data=>{
      
        // console.log(data);
        // var temp=data.data.expense;
        // if(data.data.isPremiumUser==true){
            mainContent.classList.add('dark-theme');
            document.getElementById('leader-board').classList.remove('hidden')
            
            axios.get('http://localhost:3000/expense/getAllExpense',{headers:{"Authorization":token}}).then(data=>{
        
                
                let userList=data.data;
                userList.sort(function(a,b){
                    return a.totalExpense-b.totalExpense
                })
                userList.forEach(ele=>{
                    showExpenseinUI(ele);
                    showUserinLeaderBoard(ele);
                })
                // document.getElementById('downloadBtn').classList.remove('hidden');
                // document.getElementById('downloadBtn').style.display="block";

            }).catch(err=>console.log(err))
            
        
        // userList.forEach(ele=>{
        //     showExpenseinUI(ele);
        // })
        // addPagination(data);
       
    // }).catch(err=>console.log(err))
})




function showExpenseinUI(obj){
        var description=obj.description;
        var price=obj.amount;
        var category=obj.category;
        var id=obj.id
        
        
        var temp=document.createElement('div');
        temp.setAttribute('class',"d-flex justify-content-between border-bottom border-dark p-2");
        temp.setAttribute('id',`expense-${id}`)
        temp.innerHTML=`<div class="p-2">${description}</div>
        <div class="p-2">${category}</div>
        <div class="p-2">${price}</div>
        <button type="button" class="btn btn-danger" onclick='deleteExpense(${id})'>Remove</button>`;
        
        console.log(expenseList)
        expenseList.appendChild(temp);
       

}

function deleteExpense(id){
    
     axios.delete(`http://localhost:3000/expense/deleteExpense/${id}`).then(result=>{
         removeExpenseinUI(id)
     }).catch(err=>console.log(err))
}

function removeExpenseinUI(id){
    const expenseId=`expense-${id}`;
    document.getElementById(expenseId).remove();

}

document.getElementById('btn-premium').addEventListener('click',async function(e){
    console.log('clicked');
    const token=localStorage.getItem('token');
    console.log('89')
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    console.log('92')
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "name": "Test Company",
     "order_id": response.data.order.id, // For one time payment
     "theme": {
      "color": "#3399cc"
     },
     // This handler function will handle the success payment
     "handler": function (response) {
         console.log(response);
         axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} }).then(() => {
             alert('You are a Premium User Now');
             window.location.href='../login/login.html';
         }).catch(() => {
             alert('Something went wrong. Try Again!!!')
         })
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
  alert(response.error.code);
  alert(response.error.description);
  alert(response.error.source);
  alert(response.error.step);
  alert(response.error.reason);
  alert(response.error.metadata.order_id);
  alert(response.error.metadata.payment_id);
 });
})


function showUserinLeaderBoard(obj){
  
    let tbodyTable=document.getElementById('tbody-table');
    var leaderBoardtemp=document.createElement('tr');
    leaderBoardtemp.innerHTML=`<th scope="row">${obj.id}</th>
                <td>${obj.name}</td>
                <td>${obj.totalExpense} 
                <button type="button" class="btn btn-primary show-expense" onclick='showExpense(${obj.id})'>Show Expense</button>
                </td>`;
    tbodyTable.appendChild(leaderBoardtemp);
}

function showExpense(id){
    document.getElementById('expense-board').classList.remove('hidden')
    document.getElementById('expense-board').innerHTML=''
    document.getElementById('expense-board').innerHTML='<h1>Expense Board</h1>'
    axios.get(`http://localhost:3000/expense/showExpense/${id}`).then(data=>{
        let obj=data.data.data;
        obj.forEach(ele=>{
            showExpenseRow(ele)
        })
        
    }).catch(err=>console.log(err))
}

function showExpenseRow(obj){
    let tempDiv=document.createElement('div');
        tempDiv.setAttribute('class','d-flex justify-content-between border-bottom border-dark p-2');
        tempDiv.innerHTML=`
        <div class="p-2">${obj.description}</div>
        <div class="p-2">${obj.category}</div>
        <div class="p-2">${obj.money}</div>
         </div>`
    document.getElementById('expense-board').appendChild(tempDiv)

}


function downloadReport(){
    const token = localStorage.getItem("token");
    axios.get("http://localhost:3000/expense/downloadexpense",{ headers: {"Authorization" : token}}).then(data=>{
        if(data.status==200){
            var a=document.createElement('a');
            a.href=data.data.fileUrl;
            a.download=`myexpense.txt`;
            a.click();
        }
    }).catch(err=>{
        console.log(err)
    });
}


document.getElementById("limitM").addEventListener('change',()=>{
    let currentPAge=localStorage.getItem("currentPage");
    expenseList.innerHTML='';
    paginationFunc(currentPAge);
    
});

// logout
const logout  = document.getElementById('logout').addEventListener('click',(e)=>{
    localStorage.removeItem('token');
    window.location.href = "/front-end/login.html"
})
