const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const filesDownloaded=sequelize.define('FilesDownloaded',{
    fileUrl:{
        type:Sequelize.TEXT,
        allowNull:false
    }
})

module.exports=filesDownloaded;