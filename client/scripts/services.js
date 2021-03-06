'use strict';

angular.module('confusionApp')
//.constant("baseURL", "https://localhost:3443/")
.constant("baseURL", "http://0.0.0.0:3000/api/")
//.constant("baseURL", "http://vesa-server.eu-gb.mybluemix.net/api/")



.factory('bookingFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    return $resource(baseURL + "bookings/:id", null, {
            'update': {
                method: 'PUT'
            }
        });

}])

.factory('customerFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    
        return $resource(baseURL + "customers/:id?filter[include]=bookings", {id:"@Id"}, {
        });

}])

.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog){
    
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var authToken = undefined;
    var userId = '';
    

  function loadUserCredentials() {
    var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
    if (credentials.username != undefined) {
      useCredentials(credentials);
    }
  }
 
  function storeUserCredentials(credentials) {
    $localStorage.storeObject(TOKEN_KEY, credentials);
    useCredentials(credentials);
  }
 
  function useCredentials(credentials) {
    isAuthenticated = true;
    username = credentials.username;
    authToken = credentials.token;
    userId = credentials.userId;
    // Set the token as header for your requests!
   $http.defaults.headers.common['x-access-token'] = authToken;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    userId = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
  }
     
    authFac.login = function(loginData) {

        $resource(baseURL + "customers/login")
        .save(loginData,
           function(response) {
              storeUserCredentials({username:loginData.username, token: response.id, userId: response.userId});
              $rootScope.$broadcast('login:Successful');
           },
           function(response){
              isAuthenticated = false;

              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.error.message + '</p><p>' +
                    response.statusText + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>';
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
           }
        
        );

    };
    
    authFac.logout = function() {
        $resource(baseURL + "customers/logout").save({access_token: authToken}, function(response){});
        destroyUserCredentials();
    };
    
    authFac.register = function(registerData) {
        
        $resource(baseURL + "Customers")
        .save(registerData,
           function(response) {
              authFac.login({username:registerData.username, password:registerData.password});
            if (registerData.rememberMe) {
                $localStorage.storeObject('userinfo',
                    {username:registerData.username, password:registerData.password});
            }
           
              $rootScope.$broadcast('registration:Successful');
           },
           function(response){
              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Registration Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.error.message + 
                  '</p><p>' + response.statusText + '</p></div>';

                ngDialog.openConfirm({ template: message, plain: 'true'});

           }
        
        );
    };
    
    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };
    
    authFac.getUsername = function() {
        return username;  
    };
    
    authFac.getUserId = function() {
        return userId;  
    };
    
    loadUserCredentials();
    
    return authFac;
    
}])
;