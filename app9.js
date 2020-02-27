// 쿠키는 브러우저에, 세션은 웹서버에 저장됨/둘은 서로 맞물려있다.
//라우터 미들웨어 사용하기
var express = require('express');
var http = require('http');
var app = express(); // app은 익스프레스 서버객체 
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.set('port',process.env.PORT ||3000); //포트 속성 설정
var server = http.createServer(app); //express를 이용해 서버객체만듬

app.use(static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false})); //포스트방식 처리.  // 남이 만들어놓은 외장모듈로 사용하는것. 실제로 next()가 포함되어잇음. 알아서 포스트정보 처리해서 req로 넘겨줌
app.use(bodyParser.json());
app.use(cookieParser());

//라우터 적용하기s
var router = express.Router();

router.route('/process/setUserCookie').get(function(req,res){
//req 안에 cookie()를 제공한다. 쿠키정보를 남길수있다.
    console.log('/process/setUserCookie 라우팅 함수 호출됨.');
    res.cookie('user', {
        id:'mike',
        name:'소녀시대',
        authorized:true
    });
    res.redirect('/process/showCookie');
}); 

router.route('/process/showCookie').get(function(req,res){
    console.log('/process/showCookie');
    res.send(req.cookies);
});

router.route('/process/login').post(function(req,res){
    console.log('/process/login 라우팅함수에서 받음');
    
    var paramId = req.body.name || req.query.name;
    var paramPassword = req.body.password || req.query.password;

    res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
    res.write("<h1>서버에서 로그인 응답</h1>");
    res.write("<div><p>"+paramId+"</p></div>");
    res.write("<div><p>"+paramPassword+"</p></div>");
    res.end();
}); //요청패스지정  요청패스는 process/login 일때 처리하며, post방식을 처리한다.


app.use('/', router);

app.use((req,res, next)=>{
    console.log('첫번째 미들웨어 호출됨.');
    var userAgent = req.header('User-Agent');
    var paramName = req.body.name|| req.query.name; // get방식요청은 query, post방식은 body
    res.send('<h3>서버에서 응답:usserAgent:'+userAgent+'<br></br>paramName:'+paramName+'</h3>');    

}); // user():미들웨어등록

server.listen(app.get('port'), function(){
        console.log('익스프레스로 웹 서버를 실행함:' + app.get('port'));
}); 

//지금까지는 미들웨어로써, 순서대로 거치는것을 테스트하였다. 다음시간 에서는 라우터에 대해서 배운다.
//요청에따라 특정 미들웨어로 건너뛰는? 기능이다.