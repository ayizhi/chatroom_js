angular.module('chatroomApp').controller('LoginCtrl',function ($scope,$http,$location) {
    $scope.login = function(){
        console.log(123123123123123123)
        console.log($scope);
        console.log($scope.email);
        var email = $scope.email;
        $http({
            url: '/api/login',
            method: 'POST',
            data:{
                email: email
            }
        }).success(function (user) {
            console.log('login',user)
            $scope.$emit('login',user);
            $location.path('/');
        }).error(function (data) {
            $location.path('/login')
        })
    }
})