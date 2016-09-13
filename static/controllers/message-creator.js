
angular.module('chatroomApp').controller('MessageCreatorCtrl',function($scope,socket){
    $scope.newMessage = ''
    $scope.createMessage = function () {
        socket.emit('message.create',{
            message: $scope.newMessage,
            creator: $scope.me
        })
        $scope.newMessage = ''
    }
})

