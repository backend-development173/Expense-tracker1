const Sequelize  = require('sequelize');

const sequelize  = require('../util/database');

const Order = sequelize.define('order',{
orderId:{
    type:Sequelize.STRING
},

paymentId:Sequelize.STRING

})


module.exports=Order;