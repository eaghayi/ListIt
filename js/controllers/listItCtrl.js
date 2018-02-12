/*global listit, angular, Firebase */
'use strict';
/*trying to see if emafd geting latest version*/
/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
listIt.controller('listItCtrl', function listItCtrl($scope, $filter, $location, $firebaseArray){
	var url = 'https://listit-23117.firebaseio.com';
	var ref = new Firebase(url);
    // Bind the places to the firebase provider.
    $scope.places = $firebaseArray(ref);
    $scope.newPlace = '';
    $scope.editedPlace = null;

    /* commenting out authentication
    $scope.signUp = function(){
         $scope.authObj.$createUser({
             email: $scope.email,
             password: $scope.password

         }).then(function (userData) {
             console.log(userData.uid)
         }, function (error) {
             console.log(error)
         })
    };

    $scope.signIn = function() {
            $scope.authObj.$signInWithEmailAndPassword($scope.email,$scope.password
			).then(function (userData) {
            console.log(userData.uid)
        }, function (error) {
            console.log(error)
        })
    };
    */
    $scope.$watch('places', function () {
        var total = 0;
        var remaining = 0;
        $scope.places.forEach(function (place) {
            // Skip invalid entries so they don't break the entire app.
            if (!place || !place.title) {
                return;
            }

            total++;
            if (place.completed === false) {
                remaining++;
            }
        });
        $scope.totalCount = total;
        $scope.remainingCount = remaining;
        $scope.completedCount = total - remaining;
        $scope.allChecked = remaining === 0;
    }, true);

    $scope.addPlace = function () {
        var title = $scope.title.trim();
        var placeType = $scope.placeType.trim();
		var price = $scope.price;
		var address = $scope.address.trim();
		var dateVisited = new Date($scope.dateVisited);
		var emailContact = $scope.emailContact;
		var telephone = $scope.phone;
		var notes = $scope.notes.trim();
        $scope.places.$add({
            title: title,
			placeType: placeType,
			address: address,
			price: price,
			dateVisited: dateVisited,
			emailContact: emailContact,
			telephone: telephone,
			notes: notes
        });
        //$scope.newPlace = '';
    };

    $scope.editPlace = function (place) {
        $scope.editedPlace = place;
        $scope.originalPlace = angular.extend({}, $scope.editedPlace);
    };

    $scope.doneEditing = function (place) {
        $scope.editedPlace = null;
        var title = place.title.trim();
        if (title) {
             $scope.places.$save(place);
        } else {
            $scope.removePlace(place);
        }
    };

    $scope.revertEditing = function (place) {
        place.title = $scope.originalPlace.title;
        $scope.doneEditing(place);
    };

    $scope.removePlace = function (place) {
        $scope.places.$remove(place);
    };


    $scope.clearCompletedPlaces = function () {
        $scope.places.forEach(function (place) {
            if (places.completed) {
                $scope.removePlace(place);
            }
        });
    };

    $scope.markAll = function (allCompleted) {
        $scope.places.forEach(function (place) {
            place.completed = allCompleted;
            $scope.places.$save(place);
        });
    };

    if ($location.path() === '') {
        $location.path('/');
    }
    $scope.location = $location
});
