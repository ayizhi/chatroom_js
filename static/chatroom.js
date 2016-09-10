angular.module('chatroomApp', []);


angular.module('chatroomApp').factory('socket',function($rootScope){
	var socket = io.connect('/');
	return {
		on: function(eventName,callback){
          socket.on(eventName,function(){
            var args = arguments;
            $rootScope.$apply(function(){
              callback.apply(socket,args)
            })
          })
		},
        emit: function(eventName,data,callback){
		  socket.emit(eventName,data,function(){
		    var args = arguments;
            $rootScope.$apply(function(){
              if(callback){
                callback.apply(socket,args)
              }
            })
          })
        }
	}
})

angular.module('chatroomApp').controller('RoomCtrl',function($scope,socket){
  $scope.messages = [];
  socket.emit('getAllMessages')
  socket.on('allMessages',function(messages){
    $scope.messages = messages;
  })
  socket.on('messageAdded',function(message){
    $scope.message.push(message);
  })
})

angular.module('chatroomApp').controller('MessageCreatorCtrl',function($scope,socket){
  $scope.newMessage = ''
  $scope.createMessage = function () {
    if($scope.newMessage == ''){
      return
    }
    socket.emit('createMessage',$scope.newMessage)
    $scope.newMessage = ''
  }
})