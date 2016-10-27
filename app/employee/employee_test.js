'use strict';

describe('myApp.employee module', function() {
	  var $scope;
    var $q;
    var deferred;
    var employeeCtrl;

	  beforeEach(module('myApp'));

  	beforeEach(module('myApp.employee'));
  	
  	beforeEach(inject(function($controller, _$rootScope_, _$q_, salaryCalculator) {

    	$q = _$q_;
    	$scope = _$rootScope_.$new();

    	var user={id : 1};

    	// Create a mock instance of defer
    	deferred = _$q_.defer();
    
    	// Use a spy to return the deferred promise
    	
    	spyOn(salaryCalculator, 'calculateSalaries').and.returnValue(deferred.promise);
    			    
    	// Initiate the controller with the spy service instance
    	employeeCtrl = $controller('EmployeeCtrl', { 
      		$scope: $scope, 
      		salaryCalculator: salaryCalculator
    	});

  	}));

  	describe('employee controller', function(){

    	it('should be created successfully', function() {
      		expect(employeeCtrl).toBeDefined();
    	});
		
  	});
});