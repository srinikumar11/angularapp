/**
 * Created with JetBrains PhpStorm.
 * User: srini
 * Date: 01/07/13
 * Time: 1:00 PM
 * To change this template use File | Settings | File Templates.
 */
'use strict';

var App = angular.module('PaginationApp', ['services.SharedServices']);

App.controller('MainCtrl', ['$scope', '$filter', 'TypekitService', function ($scope, $filter, Typekit) {
    $scope.loadData = function () {
        var url = 'https://typekit.com/api/v1/json/libraries/full?page=' + $scope.page + '&per_page=' + $scope.per_page + '&callback=JSON_CALLBACK';
        Typekit.getTypekits(url).then(function (response) {
            $scope.more = response.data.library.families.length === $scope.per_page;
            $scope.families = $scope.families.concat(response.data.library.families);
            $scope.status_bar = "Showing " + ($scope.families.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.families.length) + " of " + $filter('number')(response.data.library.pagination.count) + " entries";

        });
    }

    $scope.show_more = function () {
        $scope.page += 1;
        $scope.loadData();
    }

    $scope.has_more = function () {
        return $scope.more;
    }

    $scope.per_page = 10;
    $scope.page = 1;
    $scope.families = [];
    $scope.more = true;
    $scope.status_bar = "";
    $scope.loadData();
}]);


App.factory('TypekitService', ['$http', function ($http) {
    return {
        getTypekits: function (url) {
            return $http.jsonp(url);
        }
    }
}]);

/** Ajax Spinner **/
angular.module('services.SharedServices', []).config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('myHttpInterceptor');
    var spinnerFunction = function (data, headersGetter) {
        $("#loading").show();
        return data;
    };
    $httpProvider.defaults.transformRequest.push(spinnerFunction);
}).factory('myHttpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
                $("#loading").hide();
                return response;
            }, function (response) {
                $("#loading").hide();
                return $q.reject(response);
            });
        };
    });

/** Ajax Spinner **/