//라우터 미들웨어 사용하기
var express = require('express');
var http = require('http');
var app = express(); // app은 익스프레스 서버객체 

app.set('port',process.env.PORT ||3000); //포트 속성 설정
var server = http.createServer(app); //express를 이용해 서버객체만듬

app.use((req,res, next)=>{
    console.log('첫번째 미들웨어 호출됨.');
    var userAgent = req.header('User-Agent');
    var paramName = req.query.name; // get방식요청은 query, post방식은 body
    res.send('<h3>서버에서 응답:userAgent:'+userAgent+'<br></br>paramName:'+paramName+'</h3>');    

}); // user():미들웨어등록

server.listen(app.get('port'), function(){
        console.log('익스프레스로 웹 서버를 실행함:' + app.get('port'));
}); 

