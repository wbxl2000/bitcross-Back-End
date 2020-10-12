const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const register = require("./api/register")
const login = require("./api/login")
const profile = require("./api/profile")
const sendEmailCode = require("./api/sendEmailCode")
const createPost = require("./api/createPost")
const addPostContent = require("./api/addPostContent")
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
app.use("/api/addPostContent", addPostContent)
// half fake
app.use("/api/createInvitationCode", createInvitationCode)
// fake api
app.use("/api/allEmailCode", allEmailCode)



app.listen("30000", () => {
    console.log("http://localhost:30000");
})


