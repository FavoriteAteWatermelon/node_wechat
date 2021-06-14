const express = require('express')
const router = express.Router()
const {db} = require('../db/index')
const {cryptoPWD,createId} = require('../utils/encrypt')
const {generateToken, validateToken} = require('../utils/token')
const multer = require('multer')
const fs = require('fs')
const host_address = 'http://123.207.42.169:3030/upload/'
// const host_address = 'http://123.207.42.169:3000/upload/'
// const host_address = 'http://localhost:3000/upload/'
var upload = multer({
  dest: './public/uploads'
})

// 增加一個用戶
router.post('/user/add', async (req, res) =>{
  let createTime = Date.now()
  // console.log(req.body)
  // username, country, tel, password, imgUrl, wxId, createTime
  let {username, tel, password, imgUrl} = req.body
  let wxId = 'wx_' + createId().substring(0,16)
  let state = await db.user.userRegister(username, tel, cryptoPWD(password), imgUrl, wxId, createTime)
  console.log(state)
  if (state) {
    res.send('ok') 
  } else {
    res.send('') 
  }
})

// 所有用户信息
router.get('/user/info',  async (req, res) =>{
  let data = await db.user.getAllUserInfo()
  res.send(data)
})

// 刪除用戶
router.post('/user/delete',  async (req, res) =>{
    validateToken(req.headers.authorization).then((data) => {
     if (data.name === 'root') {
        let {_id,username} = req.body
        // console.log(_id)
        db.user.deleteItem(_id, username).then(data => {
          res.send(data)
        })
     } else {
       return ''
     }
  })
})



// 用户登陆
router.post('/user/login', async (req, res) =>{
  let {username, password} = req.body
  let newToken = generateToken(username)
  // console.log(newToken)
  let data = await db.user.findUser(username, cryptoPWD(password))
  // console.log(data)
  if (data){
    let newdata = await db.user.userUpdate(username,newToken)
    if (newdata === 'ok') {
      return res.send(Object.assign({},data,{token: newToken}))

    } else if (newdata === 'no_ok') {
      res.send('no_ok')
    }else {
      res.send('error')
    }
  }else {
    res.send(data)
  }

})










// 处理文件上传
router.post('/image/upload',upload.single('image') ,(req,res) => {
  console.log(req)
  let now_date = Date.now()
  fs.rename(req.file.path, "public/upload/" + req.file.filename+ now_date+'.png', function(err) {
    if (err) {
       res.send({
         state: 'error'
       })
        throw err;
    }else {
      res.send({
        state: 'ok',
        url: req.file.filename+ now_date+'.png'
      })
    }
})
})





// define the about route
router.get('/about', function (req, res) {
  res.send('About birds')
})

// router.all('*', (req, res) => {
//   res.send("對不起你")
// })

module.exports = router