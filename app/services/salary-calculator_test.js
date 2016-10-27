describe('salaryCalculator factory', function () {

  beforeEach(module('myApp'));

  // Setup the mock service in an anonymous module
  beforeEach(module(function ($provide) {
    $provide.value('employeeDataFormatter.formatEmployeeData', 
        [
          {'id': 1,
           'name': 'Person Name',
           'salary': 0,
           'overtime': 0,
           'evening': 0,
           'days': [
                      {
                        'date': '3.3.2014', 
                        'shifts' : [
                                    {'start': '12:00', 'end':'14:00'},
                                    {'start': '17:00', 'end':'23:15'}
                                  ]
                      }

                  ]
          }
        ]
    );
  }));
  
  it('can get an instance of factory', inject(function(salaryCalculator) {
    expect(salaryCalculator).toBeDefined();    
  }));

});