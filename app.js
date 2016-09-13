var express = require('express');
var app = express();
var path = require('path');
var process = require('process');
var port = process.env.PORT || 3000;
//process对象提供一系列属性，用于返回系统信息。
// process.pid：当前进程的进程号。
// process.version：Node的版本，比如v0.10.18。
// process.platform：当前系统平台，比如Linux。
// process.title：默认值为“node”，可以自定义该值。
// process.argv：当前进程的命令行参数数组。
// process.env：指向当前shell的环境变量，比如process.env.HOME。
// process.execPath：运行当前进程的可执行文件的绝对路径。
// process.stdout：指向标准输出。
// process.stdin：指向标准输入。
// process.stderr：指向标准错误。

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Controller = require('./controllers');
var signedCookieParser = cookieParser('technode');
var MongoStore = require('connect-mongo')(session);

var sessionStore = new MongoStore({
	url: 'mongodb://localhost:27017/chatroom'

})




app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(cookieParser());
app.use(session({
	secret:'chatroom',
	resave: true,
	saveUninitialized: false,
	cookie: {
		maxAge: 60*1000*60,
	},
	store: sessionStore
}))
app.use(express.static(path.join(__dirname,'/static')))
app.use(function(req,res){
	res.sendFile(path.join(__dirname,'./static/index.html'))
})

var server = app.listen(port,function(){
	console.log('chatroom is on port ' + port );
})
var io = require('socket.io').listen(server);
io.set('authorization',function(handshakeData,accept){
	signedCookieParser(handshakeData,{},function (err) {
		if(err){
			accept(err,false)
		}else{
			sessionStore.get(handshakeData.signedCookies['connect.sid'],function(err,session){
				if(err){
					accept(err.message,false);
				}else{
					handshakeData.session = session;
					if(session._userId){
						accept(null,true);
					}else{
						accept('No login')
					}
				}
			})
		}
	})
})


var messages = [];

io.sockets.on('connection',function(socket){
	socket.on('getAllMessages',function(){
		socket.emit('allMessages',messages)
	})
	socket.on('createMessage',function(message){
		messages.push(message);
		io.sockets.emit('messageAdded',message);
	})

})


app.get('/api/validate',function(req,res){
	var _userId = req.session._userId;
	if(_userId){
		Controller.User.findUserById(_userId,function(err,user){
			if(err){
				res.json(401,{
					msg: err
				})
			}else {
				res.json(user);
			}
		})
	}else{
		res.json(401,null);
	}
})

app.post('/api/login',function (req,res) {
	var email = req.body.email;
	if(email){
		Controller.User.findByEmailOrCreate(email,function(err,user){
			if(err){
				res.json(500,{
					msg: err
				})
			}else{
				req.session._userId = user._id;
				res.json(user);
			}
		})
	}else{
		res.json(403)
	}
})

app.get('/api/logout',function(req,res){
	req.session._userId = null;
	res.json(401);
})
