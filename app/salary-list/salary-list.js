'use strict';

/*Associated with the salary list view(main view)*/

angular.module('myApp.salaryList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/salary-list', {
    templateUrl: 'salary-list/salary-list.html',
    controller: 'SalaryListCtrl'
  });
}])

.controller('SalaryListCtrl', ['salaryCalculator', '$scope', function(salaryCalculator, $scope) {
	$scope.error = false;

	//Get JSON data from service
	salaryCalculator.calculateSalaries.then(function(value){
		if (value.error!== undefined && value.error.length > 0){
			$scope.error = true;
		}else{
			$scope.employeesData = value; 
		}

	    
	});

}]);