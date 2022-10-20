const expenseList=document.getElementById('expense-list');
const mainContent=document.getElementById('main-content')


function notifyUser(message){
    const notificationContainer = document.getElementById('container');
    const notification = document.createElement('div');
    notification.classList.add('toast');
    notification.innerHTML = `<h4 style = 'color:black'>${message}</h4>`;
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
let limit;
const getExpense=document.getElementById('getexpense')
getExpense.addEventListener('click',()=>{
    limit='all';
    displayExpenses(limit)
})
const dailyBtn=document.getElementById('daily')
dailyBtn.addEventListener('click',()=>{
    limit='daily'
    displayExpenses(limit)
})
const weeklyBtn=document.getElementById('weekly')
weeklyBtn.addEventListener('click',()=>{
    limit='weekly'
    displayExpenses(limit)
})
const monthlyBtn=document.getElementById('monthly')
monthlyBtn.addEventListener('click',()=>{
    limit='monthly';
    displayExpenses(limit)
})
//displaying expense
function displayExpenses(limit,page=1,rows=localStorage.getItem('rows')){
    const token = localStorage.getItem('token')
    const displayContainer=document.getElementById('displayContainer')
    displayContainer.innerHTML=''
    axios.get(`http://localhost:3000/expense/getExpenses?limit=${limit}&page=${page}&rows=${rows}`,{headers:{'authorization':token}})
    .then(response=>{
        console.log(response.data.expenses)
        const table=document.createElement('table')
        table.setAttribute('class','styled-table')
        const thead=document.createElement('thead')
        const tbody=document.createElement('tbody')
        const tfoot=document.createElement('tfoot')
        let total=0;
        thead.innerHTML=`
            <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th></th>
            </tr>
        `
        response.data.expenses.forEach(expense=>{
            const row=document.createElement('tr')
            row.setAttribute('id',`e${expense.id}`)
            row.innerHTML=`
                <td>${expense.createdAt.substring(0,10)}</td>
                <td>${expense.amount}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td><button id="dltbtn" style="color:red;border-radius:5px;padding:3px;" onclick='deleteExpense(${expense.id})'>Delete</button></td>
            `
            total+=parseInt(`${expense.amount}`)
            tbody.appendChild(row);
        })
        tfoot.innerHTML=`
                <tr>
                <td>Total</td>
                <td>${total}</td>
                <td></td>
                <td></td>
                <td></td>
                </tr>
            `
        table.appendChild(thead)
        table.appendChild(tbody)
        table.appendChild(tfoot)
        displayContainer.appendChild(table)
        pagination(response)

    })
    .catch(err=>{
        console.log(err)
    })
}


function  deleteExpense(id){
    axios.delete(`http://localhost:3000/expense/deleteExpense/${id}`).then(res=>{
        const expenseId= `e${id}`;
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

function pagination(response){
    const container=document.getElementById('pagination')
    const rows=parseInt(localStorage.getItem('rows'));
    container.innerHTML=`
    <form> 
    <label for="rows">Rows Per Page:</label>
    <select name="rowsPerPage" id="rows" style="width:60px;padding:0px" value="50">
          <option disabled selected value> ${localStorage.getItem('rows')}</option>
          <option value=5>5</option>
          <option value=10>10</option>
          <option value=25>25</option>
          <option value=50>50</option>
   </select>
   <button type="click" id="rowsPerPage">Submit</button>
   </form>
   <br>
    <span>
         <button id="firstPage" onclick="displayExpenses(${limit},${1},${rows})">1</button>
         <button id="previousPage" onclick="displayExpenses(${limit},${response.data.previousPage},${rows})">${response.data.previousPage}</button>
         <button id="currentPage" onclick="displayExpenses(${limit},${response.data.currentPage},${rows})" class="active">${response.data.currentPage}</button>
         <button id="nextPage" onclick="displayExpenses(${limit},${response.data.nextPage},${rows})">${response.data.nextPage}</button>
         <button id="lastPage" onclick="displayExpenses(${limit},${response.data.lastPage},${rows})">${response.data.lastPage}</button>
    </span>
    `
    const firstPage=document.getElementById(`firstPage`);
    const currentPage=document.getElementById(`currentPage`);
    const previousPage=document.getElementById(`previousPage`);
    const nextPage=document.getElementById(`nextPage`);
    const lastPage=document.getElementById(`lastPage`);
    if(parseInt(currentPage.innerText)==1)
    firstPage.style.display='none'
    if(parseInt(previousPage.innerText)<1 || parseInt(previousPage.innerText)==firstPage.innerText)
    previousPage.style.display='none'
    if(parseInt(nextPage.innerText)>parseInt(lastPage.innerText))
    nextPage.style.display='none'
    if(parseInt(currentPage.innerText)==parseInt(lastPage.innerText) || parseInt(nextPage.innerText)==parseInt(lastPage.innerText) )
    lastPage.style.display='none'

    //when rows per page clicked
    //dynamic pagination
    const rowsPerPageBtn=document.getElementById('rowsPerPage')
    rowsPerPageBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    localStorage.setItem('rows',document.getElementById('rows').value)
    displayExpenses()

})

}