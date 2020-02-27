//라우터 미들웨어 여러개 사용하기
var express = require('express');
var http = require('http');
var app = express(); // app은 익스프레스 서버객체 

app.set('port',process.env.PORT ||3000); //포트 속성 설정
var server = http.createServer(app); //express를 이용해 서버객체만듬

app.use((req,res, next)=>{ //user():미들웨어등록
    console.log('1번째 미들웨어 호출됨.');
    //응답을보내고싶지않다. 사용자만 확인한다.
    req.user = 'mike;'
     // 미들웨어를 떠나고, 다음미들웨어가 요청을받아 처리함
    next();
}); 

app.use((req,res,next)=>{   //req,res는 1번째 미들웨어에서 받는 req,res객체와 동일한객체임.
    console.log('두번째 미들웨어 호출됨.');

    
    // res.send('<h1>서버에서 응답한 결과입니다:'+req.user+'</h1>'); //writehead 안하고 바로 res.end로해도됨.
    // var person ={name:"소녀시대",age:20};
    // res.send(person);
    var person ={name:"소녀시대",age:20};
    var personStr= JSON.stringify(person);
    // res.send(personStr);
    res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
    res.write(personStr);
    res.end();

    //writeHead,res.end대신 send 쓴모습
});

server.listen(app.get('port'), function(){
        console.log('익스프레스로 웹 서버를 실행함:' + app.get('port'));
}); 

