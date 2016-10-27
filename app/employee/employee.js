'use strict';

/* Associated with viewing employee salary details */

angular.module('myApp.employee', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/employee/:employeeId', {
    templateUrl: 'employee/employee.html',
    controller: 'EmployeeCtrl'
  });
}])

.controller('EmployeeCtrl', ['salaryCalculator', '$scope', '$routeParams', 
	function(salaryCalculator, $scope, $routeParams) {	
		$scope.error = false;

		//Get JSON data from service
		salaryCalculator.calculateSalaries.then(function(value){
			if (value.error!== undefined && value.error.length > 0){
				$scope.error = true;
			}else{
				var employee = {};
				var employeeFound = false;

				//Get employee ID from URL
				var employeeId = $routeParams.employeeId;

				//Get the correct employee from the employee data
				for (var i=0; i<value.length; i++){
					if (value[i].id == employeeId){
						employee = value[i];
						employeeFound = true;
						break;
					}
				}

			    $scope.employee = employee; 
			    $scope.employeeFound = employeeFound;
			}
		});
}]);