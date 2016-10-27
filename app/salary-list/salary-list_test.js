'use strict';

describe('myApp.salaryList module', function() {
	var $scope;
  var $q;
  var deferred;
  var salaryListCtrl;

	beforeEach(angular.mock.module("myApp"));
	beforeEach(angular.mock.module("myApp.salaryList"));

	beforeEach(inject(function($controller, _$rootScope_, _$q_, salaryCalculator) {
    	$q = _$q_;
    	$scope = _$rootScope_.$new();
      
    	// Create a mock instance of defer
    	deferred = _$q_.defer();
    
    	// Use a spy to return the deferred promise
    	spyOn(salaryCalculator, 'calculateSalaries').and.returnValue(deferred.promise);
    
    	// Initiate the controller with the spy service instance
    	salaryListCtrl = $controller('SalaryListCtrl', { 
      		$scope: $scope, 
      		salaryCalculator: salaryCalculator
    	});
  	}));

	describe('salaryList controller', function(){
  	
    	it('should be created successfully', function() {   
      		expect(salaryListCtrl).toBeDefined();
      });      
  });
});