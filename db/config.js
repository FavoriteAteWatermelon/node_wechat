
const config = require('../config')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 地址
const DB_URL =`mongodb://${config.db_host}:${config.db_port}/`
// 表名

const MODEL_USER = 'wxUser'





// 用户配置表
const USER_SCHEMA = mongoose.model(MODEL_USER, new Schema ({
  username:{
    type: String,
    required: true
  },
  tel: {
    type: String,
    require: true
  },
  password: {
    type: String,
    default: ''
  },
  imgUrl: {
    type: String,
    default: ''
  },
  wxId: {
    type: String,
    default: ''
  },
  createDate: {
    type: Date,
    default: Date.now()
  },
})) 




// 数据库默认配置
// 取消消息提示
const CONNECT_CONFIG = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

// 导出分类
exports.config = {
  DB_URL,
  MODEL_USER,
  USER_SCHEMA,
}
