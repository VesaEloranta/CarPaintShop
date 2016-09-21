'use strict';

angular.module('confusionApp', ['ui.router','ngResource','ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
        
            // route for the aboutus page
            .state('app.aboutus', {
                url:'aboutus',
                views: {
                    'content@': {
                        templateUrl : 'views/aboutus.html',                
                    }
                }
            })

            // route for the personel page
            .state('app.personel', {
                url: 'personel',
                views: {
                    'content@': {
                        templateUrl : 'views/personel.html',
                        controller  : 'PersonelController'
                    }
                }
            })
        
            // route for the dishdetail page
            .state('app.booking', {
                url: 'booking',
                views: {
                    'content@': {
                        templateUrl : 'views/booking.html',
                        controller  : 'BookingController'
                   }
                }
            });
    
        $urlRouterProvider.otherwise('/');
    })
;
