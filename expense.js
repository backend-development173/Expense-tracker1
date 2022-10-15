const expenseList=document.getElementById('expense-list');
const mainContent=document.getElementById('main-content')


function notifyUser(message){
    const notificationContainer = document.getElementById('container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}</h4>`;
    notificationContainer.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
        },2500)
}
       /// add expenses to database

    document.getElementById('expense').addEventListener('submit',(e)=>{
    e.preventDefault()
   
    const amount=document.getElementById('amount').value;
    const description=document.getElementById('description').value;
    const category=document.getElementById('category').value;
    const obj={
        description,
        category,
      amount
    }
    amount = '';
    description = " ";
    category = " ";
    console.log(obj)
    const token=localStorage.getItem('token')
    axios.post('http://localhost:3000/expense/AddExpense',obj,{headers:{"Authorization":token}}).then(result=>{
        console.log('user added')
        console.log(result)
        notifyUser(result.data.message)
      
     
        
        
        
    }).catch(err=>{
        if(err.response.status==403){
            alert(`${err.response.data.message}`);
        }

    });
})

///add expense and showing to front-end
const getExpense   = document.getElementById('getexpense')
window.addEventListener('DOMContentLoaded',()=>{
    getExpense.addEventListener('click',(e)=>{
        e.preventDefault();
        const token=localStorage.getItem('token')
        const displayContainer=document.getElementById('displayContainer')
        displayContainer.innerHTML=''
        axios.get('http://localhost:3000/expense/getExpense',{headers:{"Authorization":token}})
        .then(response=>{
            console.log(response)
            const ul=document.createElement('ul')
            response.data.expenses.forEach(expense=>{
                const li=document.createElement('li')
                li.setAttribute('id',`${expense.id}`)
                li.innerHTML=`
              
                    <span  style="margin-left:300px"> Amount-  ${expense.amount}</span>
                    <span   style="margin-left:100px">Category-  ${expense.category}</span>
                    <span   style="margin-left:100px ">Description-  ${expense.description}</span>
                    <span  style="margin-left:px"> <button id="dltbtn"  onclick='deleteExpense(${expense.id})' style="color:red;border-radius:5px;">Delete</button> </span>
                `
                ul.appendChild(li)
    
            })
            displayContainer.appendChild(ul)
      
            
        
        })
        .catch(err=>{
            console.log(err)
        })

    })
  
})

function  deleteExpense(id){
    axios.delete(`http://localhost:3000/expense/deleteExpense/${id}`).then(res=>{
        const expenseId= id;
        document.getElementById(expenseId).remove();
        notifyUser(res.data.message)
    
    })
    
}


// logout
const logout  = document.getElementById('logout').addEventListener('click',(e)=>{
    localStorage.removeItem('token');
    window.location.href = "./login-frontend/login.html"
})