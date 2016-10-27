describe('employeeDataFormatter factory', function () {
  
  beforeEach(module('myApp'));

  //Setup the mock service in an anonymous module
  beforeEach(module(function ($provide) {
    $provide.value('fileLoader.parseFile', 
        {'data': 'some data'}
    );
  }));
  
  it('can get an instance of factory', inject(function(employeeDataFormatter) {
    expect(employeeDataFormatter).toBeDefined();    
  }));

});