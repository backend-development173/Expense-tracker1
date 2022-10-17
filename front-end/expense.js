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
    let amount=document.getElementById('amount').value;
    let description=document.getElementById('description').value;
    let category=document.getElementById('category').value;
    const obj={
        description,
        category,
      amount
    }
    amount = " ";
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
    window.location.href = "../front-end/login.html"
})


const premiumBtn = document.getElementById("premium");
const payBtn=document.getElementById('pay')
const close = document.getElementById("close");
const container = document.getElementById("popup-container");
const amount=49900
let orderId;

premiumBtn.addEventListener("click", () => {
    console.log("clickedpre")
    const token=localStorage.getItem('token')
    container.classList.add("active");
    axios.post('http://localhost:3000/premium/create/order',{amount:amount},{headers:{"Authorization":token}})   
    .then(response=>{
        orderId=response.data.order.id;
        payBtn.style="display:block"
    })
    .catch(err=>{
        console.log(err)
    })
});


close.addEventListener("click", () => {
    container.classList.remove("active");
    payBtn.style="display:none"
});

let paymentId;
let signature;
payBtn.addEventListener('click',(e)=>{
    container.classList.remove("active");
    payBtn.style="display:none"
    var options = {
        "key": "rzp_test_lpC2F9qqmivBNb", // Enter the Key ID generated from the Dashboard
        "amount": `${amount}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Expense Tracker",
        "description": "Premium",
        //"image": "https://example.com/your_logo",
        "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            paymentId=response.razorpay_payment_id;
            signature=response.razorpay_signature;
            alert(`Payment successful: your order ID: ${response.razorpay_order_id} and payment ID:${response.razorpay_payment_id}`);
            window.location.href="./Preimum/index.html"
            const token = localStorage.getItem('token');
            axios.post('http://localhost:3000/transaction/detail',{orderId:orderId,paymentId:paymentId},{headers:{"Authorization":token}})
            .then()
            .catch(err=>{
                console.log(err)
            })
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response){
            alert(response.error.description);
    });
    rzp1.open();
    e.preventDefault();

})

//dark theme icon
const toggle = document.getElementById("toggle");

toggle.addEventListener("change", (e) => {
    document.body.classList.toggle("dark", e.target.checked);
});