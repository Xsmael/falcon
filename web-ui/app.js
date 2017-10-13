

angular.module("transport", ['faye','ui.router','ngBootbox',])

   .config( function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('home', {
                    url: '/',
                    controller: 'HomeController',
                    templateUrl: 'templates/home.html'
                })
                // .state('dash', {
                //     url: '/dash',
                //     controller: 'DashController',
                //     templateUrl: 'templates/dash.html'
                // })

                .state('users', {
                    url: '/users',
                    controller: "UserController",
                    templateUrl: 'templates/users.html'
                })
                .state('trip', {
                    url: '/trip',
                    controller: "TripController",
                    templateUrl: 'templates/trip.html'
                })
                .state('vehicle', {
                    url: '/vehicle',
                    controller: "VehicleController",
                    templateUrl: 'templates/vehicle.html'
                })
                .state('parcel', {
                    url: '/parcel',
                    controller: "ParcelController",
                    templateUrl: 'templates/history.html'
                })
                .state('settings', {
                    url: '/settings',
                    controller: "SettingsController",
                    templateUrl: 'templates/settings.html'
                })
            ;
            $urlRouterProvider.otherwise('/');

        })
        
        /*
        .config(function(NotificationProvider) {
            NotificationProvider.setOptions({
                delay: 5000,
                startTop: 20,
                startRight: 10,
                verticalSpacing: 20,
                horizontalSpacing: 20,
                positionX: 'right',
                positionY: 'bottom'
            });
        })*/
        .filter('fromMap', function() {
            return function(input) {
                var out = {};
                input.forEach((v, k) => out[k] = v);
                return out;
            };
        })

    .factory('FayeFactory', function($faye, $rootScope) {
            return $faye("http://localhost:8888/");
    })
      
    .service('SoundNotif', function () {
        this.play= function(which) {
            var primary = new Audio('sounds/primary.mp3');
            var info = new Audio('sounds/info.mp3');
            var success = new Audio('sounds/success.mp3');
            var warning = new Audio('sounds/warning.mp3');
            var danger = new Audio('sounds/danger.mp3');
            switch (which) {
                case 'critical':
                critical.play();
                break;
                case 'warning':
                warning.play();
                break;
                case 'error':
                error.play();
                break;
                case 'success':
                success.play();
                break;
                
            }
        };
    })
    
.controller("HomeController", function() {

})
.controller("VehicleController",function($scope, $rootScope, FayeFactory){
    $scope.vehicles= [];

    $scope.create= function(v) {
        FayeFactory.publish('/create/Vehicle', v);    
    }
    $scope.update= function(v) {
        FayeFactory.publish('/update/Vehicle', v);        
    }
    $scope.delete= function(v) {
        FayeFactory.publish('/delete/Vehicle', v);        
    }

    FayeFactory.subscribe('/list/Vehicle', function(objs) {
        $scope.vehicles= objs;
        console.log(objs);
    });
    
    FayeFactory.publish('/list-req/Vehicle', {});
    console.warn("VehicleController");

})

.controller("SettingsController",function($scope, $rootScope){

})

.controller("ParcelController",function($scope, $rootScope, FayeFactory){
    $scope.journal= [];
    $scope.showDownloadLink=false;

    FayeFactory.subscribe('/RealtimeJournal', function(j) {
        $scope.journal.push(j);
        console.log(j);
    });

    FayeFactory.subscribe('/XlsJournalReady', function(link) {
        if(link){
            $scope.showDownloadLink=true;
            $scope.link=link;
        }
    });
    

    $scope.generateJournal= function () {
        FayeFactory.publish('/XlsGenerateJounal',{})
    }

})


.controller("UserController",function($scope,FayeFactory){
    $scope.addingNewUser=false;
    $scope.watingForId= false;
    $scope.users= [];

    FayeFactory.subscribe('/CardSwiped', function (card) {
        if(card.card_id){
            $scope.watingForId= false;
            $scope.addingNewUser=true;
    
            $scope.card_id= card.card_id;
        }
    });

    FayeFactory.subscribe('/ListAcc', function (data) {
        $scope.users= data;    
    });
    FayeFactory.publish('/ListAccReq',{});
    

    $scope.newUser= function() { 
        $scope.watingForId=true;
        FayeFactory.publish('/CardIdReq',{});
    }
    $scope.save= function() {
        var obj= {
            name: $scope.name,
            phone: $scope.phone,
            email: $scope.email,
            card_id: $scope.card_id
        };
        $scope.users.push(obj);
        FayeFactory.publish('/NewAccReq',obj);
        
        $scope.firstname="";
        $scope.lastname="";
        $scope.phone="";
        $scope.email="";
        $scope.card_id="";
        $scope.addingNewUser=false;
    }
    
    $scope.clearAll= function() {
        $scope.users= [];
    }
    
    $scope.show= function() {
        alert($scope.username+" "+ $scope.age+" "+$scope.email);
    }

    $scope.deleteUser= function(user) {
        FayeFactory.publish('/DelAccReq',user);        
    }
})


;

/**
 * MISC
 * 
 */

function generateQuickGuid() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}
