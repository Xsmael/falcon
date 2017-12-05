

angular.module("transport", ['faye','ui.router', 'ui.toggle','ngBootbox',])

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
                .state('ticket', {
                    url: '/ticket',
                    controller: "TicketController",
                    templateUrl: 'templates/ticket.html'
                })
                .state('vehicle', {
                    url: '/vehicle',
                    controller: "VehicleController",
                    templateUrl: 'templates/vehicle.html'
                })
                .state('parcel', {
                    url: '/parcel',
                    controller: "ParcelController",
                    templateUrl: 'templates/parcel.html'
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


    .factory('FayeFactory', function($faye, $rootScope) {
            return $faye("http://localhost:8888/");
    })
    .service("VehicleService", function(FayeFactory,$rootScope) {
        FayeFactory.subscribe('/list/Vehicle', function(vehicles) {            
            $rootScope.vehicles=vehicles;
        });
        FayeFactory.publish('/list-req/Vehicle', {});       
        
        this.getVehicle=  function(id) {
            for( var i= 0 ; i<  $rootScope.vehicles.length; i++) { 
                var v= $rootScope.vehicles[i];
                if(v._id == id) {
                    return v;
                }
            }
        }
        
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
    $scope.isEditing= false;

    $scope.dialogOptions= {
        scope: $scope
    }


    $scope.edit= function(v) {
        $scope.toEdit= v;
        $scope.isEditing= true;
    }

    $scope.create= function(v) {
        FayeFactory.publish('/create/Vehicle', v);
        console.log("Creating...");    
        $scope.isEditing= false;    
    }
    $scope.update= function(v) {
        FayeFactory.publish('/update/Vehicle', v);   
        $scope.isEditing= false;    
    }
    $scope.delete= function(v) {
        FayeFactory.publish('/delete/Vehicle', v);        
        console.log("Deleting...");    
    }

    FayeFactory.subscribe('/list/Vehicle', function(objs) {
        $scope.vehicles= objs;
        console.info(objs);
    });
    
    FayeFactory.publish('/list-req/Vehicle', {});
    console.warn("VehicleController");

})

.controller("TicketController",function($scope, $rootScope, FayeFactory){
    $scope.tickets= [];
    $scope.isEditing= false;        

    $scope.dialogOptions= {
        scope: $scope
    }

    $scope.edit= function(o) {
        $scope.toEdit= o;
        $scope.isEditing= true;
    }

    $scope.create= function(o) {
        FayeFactory.publish('/create/Ticket', o);
        $scope.isEditing= false;        
    }
    $scope.update= function(o) {
        FayeFactory.publish('/update/Ticket', o);     
        $scope.isEditing= false;        
    }
    $scope.delete= function(o) {
        FayeFactory.publish('/delete/Ticket', o);        
    }

    FayeFactory.subscribe('/list/Ticket', function(objs) {
        $scope.tickets= objs;
        console.log(objs);
    });
    
    FayeFactory.publish('/list-req/Ticket', {});
    console.warn("TicketController");
})

.controller("ParcelController",function($scope, $rootScope, FayeFactory){
    $scope.parcels= [];

    $scope.dialogOptions= {
        scope: $scope
    }

    $scope.create= function(o) {
        FayeFactory.publish('/create/Parcel', o);    
    }
    $scope.update= function(o) {
        FayeFactory.publish('/update/Parcel', o);        
    }
    $scope.delete= function(o) {
        FayeFactory.publish('/delete/Parcel', o);        
    }

    FayeFactory.subscribe('/list/Parcel', function(objs) {
        $scope.parcels= objs;
        console.log(objs);
    });
    
    FayeFactory.publish('/list-req/Parcel', {});
    console.warn("ParcelController");
})

.controller("TripController",function($scope, $rootScope, FayeFactory,VehicleService,$interval){
    $scope.trips= [];
    $scope.vehicles= [];
    $scope.vehicles= VehicleService.vehicles;
    $scope.isEditing= false; 

    $scope.edit= function(o) {
        $scope.toEdit= o;
        $scope.isEditing= true;
    }

    $scope.dialogOptions= {
        scope: $scope
    }

    $scope.create= function(o) {
        FayeFactory.publish('/create/Trip', o); 
        $scope.isEditing= false; 
        console.log(o);   
    }

    $scope.update= function(o) {
        FayeFactory.publish('/update/Trip', o);   
        $scope.isEditing= false;        
    }

    $scope.delete= function(o) {
        FayeFactory.publish('/delete/Trip', o);        
    }

    FayeFactory.subscribe('/list/Trip', function(objs) {
        $scope.trips= objs;
        console.log(objs);
    });


    FayeFactory.publish('/list-req/Trip', {});
    
    $scope.printVehicle= function(id) {
        var v= VehicleService.getVehicle(id);
        console.log(v);
        return v.brand+'['+v.numberplate+']';
    }
    $scope.getSelectedDays= function(days) {
        var selectedDays= Object.keys(days);      
        return selectedDays;
    }

    console.warn("TripController");
})

.controller("SettingsController",function($scope, $rootScope){

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
