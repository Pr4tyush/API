const express =  require("express");

const https = require("https");
const { url } = require("inspector");
const app = express();



app.get("/",function(req,res){
    const url = "https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=9c2a2a8a7ae485115337abfaa7d81b42"
    https.get(url,function(response){
        console.log(response.statusCode);

        response.on("data",function(data){
            const whetherData = JSON.parse(data)
            const temp = whetherData.main.temp
            const whetherDescription = whetherData.weather[0].description
            const icon = whetherData.weather[0].icon
            res.write("<h1>the temprature of London is :"+temp+" Ferhenhite</h1>");
            const imageUrl = "http://openweathermap.org/img/wn/"+icon+"@2x.png"
            res.send()
           
        })
    })
    
    
})



app.listen(3000,function(){
    console.log("Website is Currently Running On localHost:3000")
}
)