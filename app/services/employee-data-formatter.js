/* The data is read in shift format. Not the most convenient for the application purpose
 * Turn it into something easy to display and easy to calculate salaries per employee from
 * E.g.
  [
          {'id': 1, 
           'name': 'Person Name',
           'salary': 0, <- Total salary for the month
           'overtime': 0, <- Overtime compensations
           'evening': 0, <- Evening work compensations
           'days': [
                      {
                        'date': '3.3.2014', 
                        'shifts' : [
                                    {'start': '12:00', 'end':'14:00'},
                                    {'start': '17:00', 'end':'23:15'}, ...
                                   ]
                      }, ...

                  ]
          }, ...
        ]
 */

angular.module('myApp')
    .factory('employeeDataFormatter', ['fileLoader', function(fileLoader){ 
	 	
 	return{
 		formatEmployeeData: formatEmployeeData
 	}

 	function formatEmployeeData(){ 		

 		return fileLoader.parseFile()
 			.then(function(data){
 				//Data from parser has format {errors : ..., data : ..., ...}

 				//Check for errors in parsed data
 				if (data.errors.length > 0){
		    		return {'error': data.errors};
		    	}
		    	else{ 
		    		var salaryData = data.data;

		    		/* Data is now in shift format... not very convenient for displaying it
					 * Grouping: - first level, by employee
					 *  		 - second level, by work day
		    		 */

		    		var employeeData = [];

		    		for (var i = 0; i < salaryData.length; i++){
		    		 	var shift = salaryData[i];
	    			 	
		    		 	var employeeKey = findIndexInData(employeeData, 'id', shift['Person ID']);

		    		 	//If employee does not exist, create
		    		 	if (employeeKey === -1){
		    		 		//Push returns new array length -> substract -1 for last key
		    		 		employeeKey = employeeData.push(
		    			 				{
		    			 					'id': shift['Person ID'],
		    			 					'name': shift['Person Name'],
		    			 					'salary': 0,
		    			 					'overtime': 0,
		    			 					'evening': 0,
		    			 					'days': []
		    			 				}
		    			 			) - 1;
		    			}
							    			 			    			 							
						//Track position in 'days' array to add shift times
						var dateKey = findIndexInData(employeeData[employeeKey]['days'], 'date', shift['Date']);

						//If date does not exist, create
						if (dateKey === -1){
							//Push returns new array length 
							dateKey = employeeData[employeeKey]['days'].push(
											{
												'date': shift['Date'], 
												'shifts' : []
											}
										) - 1;
						}

						employeeData[employeeKey]['days'][dateKey]['shifts'].push(
											{
												'start': shift['Start'],
												'end': shift['End']
											}
										);
		    			}

		    			//Sort ascendingly by employee id (integer value)
		    			employeeData.sort(function(a, b) {
						    return parseInt(a.id) - parseInt(b.id);
						});

		    			return employeeData;
		    		}

		    		//In case nothing has been returned yet
		    		return {'error': 'No data'};

 				});
 	}

 	/* Finds whether a property-value pair exists in the data
 	 * Returns index
 	 */
 	function findIndexInData(data, property, value) {
	    var result = -1;
	    data.some(function (item, i) {
	        if (item[property] === value) {
	            result = i;
	            return true;
	        }
	    });
	    return result;
	}

 }]);