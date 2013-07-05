/**
 * Created with JetBrains PhpStorm.
 * User: srinivasan
 * Date: 2/7/13
 * Time: 10:03 PM
 * To change this template use File | Settings | File Templates.
 */
// before using, install CouchDB 1.3 on localhost, enable CORS, create a database named "projects"

angular.module('project', ['CouchDB']).
    config(function($routeProvider) {
        $routeProvider.
            when('/', {controller:ListCtrl, templateUrl:'list.html'}).
            when('/edit/:projectId', {controller:EditCtrl, templateUrl:'detail.html'}).
            when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).
            otherwise({redirectTo:'/'});
    });

function ListCtrl($scope, ProjectCouch) {
    alert( ProjectCouch.get({q:'_all_docs', include_docs: 'true', limit: 10}));
    $scope.projects = ProjectCouch.get({q:'_all_docs', include_docs: 'true', limit: 10});
}

function CreateCtrl($scope, $location, ProjectCouch) {
    $scope.save = function() {
        console.log($scope.project);
        ProjectCouch.save($scope.project, function(project) {
            $location.path('/edit/' + project.id);
        });
    }
}

function EditCtrl($scope, $location, $routeParams, ProjectCouch) {
    var self = this;

    ProjectCouch.get({q: $routeParams.projectId}, function(project) {
        self.original = project;
        $scope.project = new ProjectCouch(self.original);
    });

    $scope.isClean = function() {
        return angular.equals(self.original, $scope.project);
    }

    $scope.destroy = function() {
        self.original.destroy(function() {
            $location.path('/');
        });
    };

    $scope.save = function() {
        $scope.project.update(function() {
            console.log($scope.project);
            $location.path('/');
        });
    };
}

angular.module('CouchDB', ['ngResource']).
    factory('ProjectCouch', function($resource) {
        var ProjectCouch = $resource(':protocol//:server/:db/:q/:r/:s/:t',
            {protocol: 'http:', server: 'localhost/couchdb', db: 'angular'}, {update: {method:'PUT'}
            }
        );

        ProjectCouch.prototype.update = function(cb) {
            return ProjectCouch.update({q: this._id},
                this, cb);
        };

        ProjectCouch.prototype.destroy = function(cb) {
            return ProjectCouch.remove({q: this._id, rev: this._rev}, cb);
        };

        return ProjectCouch;
    });
