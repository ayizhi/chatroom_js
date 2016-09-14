angular.module('chatroomApp', ['ngRoute']);

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

angular.module('chatroomApp').run(function($window,$rootScope,$http,$location){
    console.log('api/validate')
  $http({
    url: '/api/validate',
    method: 'Get',
  }).success(function(user){
    console.log(user)
    $rootScope.me = user;
    $location.path('/')
  }).error(function(data){
    $location.path('/login')
  });

  $rootScope.logout = function(){
      $http({
          url: '/ajax/logout',
          method: 'Get',
      }).success(function(){
          $rootScope.me = null;
          $location.path('/login');
      })
  }
  $rootScope.$on('login',function(evt,me){
      $rootScope.me = me;
  })
})




