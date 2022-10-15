const express = require('express')

const cors=require('cors')
const app = express()
const path=require('path');
const bodyParser = require('body-parser');
const sequelize=require('./util/database')
const user=require('./models/user');
const expense=require('./models/expense')


const expenseRoutes=require('./routes/expense')
// const purchaseRoutes=require('./router/purchase');
// const forgotPasswordRoutes=require('./router/forgotPassword');

const dotenv = require('dotenv');
dotenv.config();
app.use(cors());

app.use(express.static(path.join(__dirname, '/public')))
app.use(express.json());

const userRoutes=require('./routes/auth')
app.use('/user',userRoutes)
app.use('/expense',expenseRoutes);
// app.use('/purchase',purchaseRoutes);
// app.use('/password',forgotPasswordRoutes)

 


expense.belongsTo(user,{constraints:true,onDelete:'CASCADE'});
user.hasMany(expense)


// user.hasMany(order);
// order.belongsTo(user)


// user.hasMany(ForgotPassword);
// ForgotPassword.belongsTo(user)

sequelize.sync()
.then(res=>app.listen(3000))
.catch(err=>console.log(err))

