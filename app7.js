//라우터 미들웨어 사용하기
var express = require('express');
var http = require('http');
var app = express(); // app은 익스프레스 서버객체 
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');

app.set('port',process.env.PORT ||3000); //포트 속성 설정
var server = http.createServer(app); //express를 이용해 서버객체만듬

app.use(static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false})); //포스트방식 처리.  // 남이 만들어놓은 외장모듈로 사용하는것. 실제로 next()가 포함되어잇음. 알아서 포스트정보 처리해서 req로 넘겨줌
app.use(bodyParser.json());

app.use((req,res, next)=>{
    console.log('첫번째 미들웨어 호출됨.');
    var userAgent = req.header('User-Agent');
    var paramName = req.body.name|| req.query.name; // get방식요청은 query, post방식은 body
    res.send('<h3>서버에서 응답:userAgent:'+userAgent+'<br></br>paramName:'+paramName+'</h3>');    

}); // user():미들웨어등록

server.listen(app.get('port'), function(){
        console.log('익스프레스로 웹 서버를 실행함:' + app.get('port'));
}); 

//지금까지는 미들웨어로써, 순서대로 거치는것을 테스트하였다. 다음시간 에서는 라우터에 대해서 배운다.
//요청에따라 특정 미들웨어로 건너뛰는? 기능이다.