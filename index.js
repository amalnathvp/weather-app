const http = require("http");
const fs = require('fs');
const requests = require("requests");

const homeFile = fs.readFileSync('index.html', 'utf-8');

const replaceVal = (tempVal, orgVal)=>{
    let temperature = tempVal.replace("{%tempVal%}", orgVal.main.temp);
     temperature = temperature.replace("{%location%}", orgVal.name);
     temperature = temperature.replace("{%country%}", orgVal.sys.country);
     temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
     return temperature;
}

const server = http.createServer((req,res)=>{
    if(req.url == "/"){
        requests(
            "https://api.openweathermap.org/data/2.5/weather?q=kalpatta&appid=40c5d09e4c3008c87958d2a38e7e5127&units=metric" 

        )
        .on("data", function(chunk){
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            // console.log(arrData[0].main.temp);
            const realTimeDate = arrData.map((val) => replaceVal(homeFile, val)).join("");
            res.write(realTimeDate); 
            
        })
        .on("end", function (err){
            if(err) return console.log("connection close due to errors", err);
            res.end();
            // console.log("end");
        })
    }
});

server.listen(8000,"127.0.0.1");