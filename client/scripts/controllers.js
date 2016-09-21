'use strict';

angular.module('confusionApp')

.controller('PersonelController', ['$scope', function ($scope) {

    $scope.personel= [
        {
            image: "images/ThomasE.jpg",
            name: "Thomas 'I know' Evryting",
            designation: "CEO",
            description: "Administrator in charge of managing an organization and reports to the board of directors and is charged with maximizing the value of the entity."
        },
        {
            image: "images/JV_S.jpg",
            name: "JV 'Count the Money' Sopkeaper",
            designation: "CFO",
            description: "Primarily responsible for managing the financial risks of the corporation and also responsible for financial planning and record-keeping, as well as financial reporting to higher management."
        },
        {
            image: "images/Henri_B.jpg",
            name: "Henri 'I do' Baent",
            designation: "COO",
            description: "The second in command at the firm is responsible for the daily operation and routinely reports to the highest ranking executive."
        }
    ];
}])


.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', '$location', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, $location, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
        $location.path("app/");
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

.controller('BookingController', ['$scope', '$state', 'ngDialog', '$location', 'bookingFactory', 'customerFactory', 'AuthFactory', function ($scope,  $state, ngDialog, $location, bookingFactory, customerFactory, AuthFactory) {

    $scope.newbooking = '';    
    $scope.customer= '';
    $scope.showBooking = false;
    var CustomerId = AuthFactory.getUserId()
    if (CustomerId == "") { 
        $location.path("app/");
        var message = '\
                <div class="ngdialog-message">\
                <div><h3>Sign in first !</h3></div>' +
                  '<div><p>Booking enabled only for registered customers</p></div>';

        ngDialog.openConfirm({ template: message, plain: 'true'});
    };
                                  
    $scope.doBooking = function () {
        $scope.newbooking.customerId = CustomerId;
  
        bookingFactory.save($scope.newbooking);
        $state.go($state.current, {}, {reload: true});
    };
    
    $scope.customer= customerFactory.get({id: CustomerId})
            .$promise.then(
                function(response){
                    $scope.customer = response;
                    if(response.bookings.length !== 0)    
                        $scope.showBooking = true;
                },
                function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}])
;