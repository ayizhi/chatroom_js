angular.module('chatroomApp').controller('LoginCtrl',function ($scope,$http,$location) {
    console.log('======')
    $scope.login = function(){
        var email = $scope.email;
        console.log(email)
        $http({
            url: '/api/login',
            method: 'post',
            data:{
                email: email
            }
        }).success(function (user) {
            // console.log('login',user)
            $scope.$emit('login',user);
            $location.path('/');
        }).error(function (data) {
            $location.path('/login')
        })
    }
})