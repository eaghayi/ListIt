/*global listit, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
listIt.controller('listItCtrl', function listItCtrl($scope, $filter, $location, $firebaseArray, $firebaseAuth) {

    $scope.authObj = $firebaseAuth();
    // Bind the places to the firebase provider.
    $scope.places = '';
    $scope.newPlace = '';
    $scope.editedPlace = null;

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
        var newPlace = $scope.newPlace.trim();
        if (!newPlace.length) {
            return;
        }
        $scope.places.$add({
            title: newPlace,
            completed: false
        });
        $scope.newPlace = '';
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
