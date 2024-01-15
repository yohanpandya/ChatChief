const express = require('express');
const app = express();
const profile = require('./profile')

app.use('/profile',profile)


const port = process.env.PORT||8000;
app.listen(port,()=>{
    console.log(`Server is running at ${port}`)
});
