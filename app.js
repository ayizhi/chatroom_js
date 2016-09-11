var express = require('express');
var app = express();
var path = require('path');
var process = require('process');
var port = process.env.PORT || 3000
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


app.use(express.static(path.join(__dirname,'/static')))

app.use(function(req,res){
	res.sendFile(path.join(__dirname,'./static/index.html'))
})

var server = app.listen(port,function(){
	console.log('chatroom is on port ' + port );
})
var io = require('socket.io').listen(server);
var messages = [];

io.sockets.on('connection',function(socket){
	socket.on('getAllMessages',function(){
		console.log(messages,'===============')
		socket.emit('allMessages',messages)
	})
	socket.on('createMessage',function(message){
		messages.push(message);
		console.log(message,'+++++++++++++++++')
		io.sockets.emit('messageAdded',message);
	})

})

