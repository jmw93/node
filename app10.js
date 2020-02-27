// 쿠키는 브러우저에, 세션은 웹서버에 저장됨/둘은 서로 맞물려있다.
//라우터 미들웨어 사용하기
var express = require('express');
var http = require('http');
var app = express(); // app은 익스프레스 서버객체 
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var router = express.Router();
app.set('port',process.env.PORT ||3000); //포트 속성 설정
var server = http.createServer(app); //express를 이용해 서버객체만듬

app.use(static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false})); //포스트방식 처리.  // 남이 만들어놓은 외장모듈로 사용하는것. 실제로 next()가 포함되어잇음. 알아서 포스트정보 처리해서 req로 넘겨줌
app.use(bodyParser.json());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));
app.use(cookieParser());

router.route('/process/setUserCookie').get(function(req,res){

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
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    if(req.session.user){
        console.log('이미 로그인 되어있음');
        res.redirect('/product.html');
    }else{
        req.session.user = {
            id:paramId,
            name:'소녀시대',
            authorized:true
        };
        res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
        res.write("<h1>로그인 성공</h1>");
        res.write("<p>id : "+paramId+"</p>");
        res.write('<br><br><a href="/product.html">상품 페이지로 이동하기</a>');
        res.end();
    }
}); 
router.route('/process/logout').get(function(res,req){
    console.log('process/logout 라우팅 호출');
    if(req.session.user){
        console.log("로그아웃 합니다");
        //세션삭제
        req.session.destroy(function(err){
           if(err){
            console.log('세션 삭제 시 에러 발생');
            throw err;
            //return ; // 그냥 return 시 응답이 무한대기 예상됨.
            }
            console.log('세션 삭제 성공 로그인페이지이동');
            res.redirect('/public/login2.html');
        });

    }else{
        console.log('로그인 되어있지 않는데 바로접속하셔서 로그인페이지로 이동합니다');
        res.redirect('/public/login2.html');
    }
});
router.route('/process/product').get(function(req,res){
    console.log("/process/product 라우팅 함수 호출됨");
    if(req.session.user) {
        res.redirect('/product.html'); //상품
    }else{
        res.redirect('/login2.html') // 로그인
    }
});


app.use('/', router);

 


server.listen(app.get('port'), function(){
        console.log('익스프레스로 웹 서버를 실행함:' + app.get('port'));
}); 

//지금까지는 미들웨어로써, 순서대로 거치는것을 테스트하였다. 다음시간 에서는 라우터에 대해서 배운다.
//요청에따라 특정 미들웨어로 건너뛰는? 기능이다.

/*router.route('/process/setUserCookie').get(function(req,res){

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
 */