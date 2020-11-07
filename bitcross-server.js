const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const cors = require('cors');
app.use(cors());
// default options
app.use(fileUpload());

app.use(express.static('public')) //开放静态资源, 恩，一步解决

const register = require("./api/register")
const login = require("./api/login")
const profile = require("./api/profile")
const sendEmailCode = require("./api/sendEmailCode")
const createPost = require("./api/createPost")
const getPostAll = require("./api/getPostAll")
const getPostOne = require("./api/getPostOne")
const addPostReply = require("./api/addPostReply")
const addPostReply_RE = require("./api/addPostReply_RE")
const favorPost = require("./api/favorPost")
const userImageUpload = require("./api/userImageUpload")

// half fake
const createInvitationCode = require("./api/createInvitationCode")

//fake test
const allUsers = require("./api/allUsers")
const allEmailCode = require("./api/allEmailCode")


// api
app.use("/api/register", register)
app.use("/api/login", login)
app.use("/api/profile", profile)
app.use("/api/sendEmailCode", sendEmailCode)
app.use("/api/createPost", createPost)
app.use("/api/getPostAll", getPostAll)
app.use("/api/getPostOne", getPostOne)
app.use("/api/addPostReply", addPostReply) 
app.use("/api/addPostReply_RE", addPostReply_RE) 
app.use("/api/favorPost", favorPost)
app.use("/api/userImageUpload", userImageUpload)
// half fake
app.use("/api/createInvitationCode", createInvitationCode)
// fake api
app.use("/api/allEmailCode", allEmailCode)



app.listen("30000", () => {
    console.log("http://localhost:30000");
})


