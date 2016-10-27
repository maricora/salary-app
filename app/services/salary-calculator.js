angular.module('myApp')
    .factory('salaryCalculator', ['employeeDataFormatter', function(employeeDataFormatter){ 
	 	
 	return{ 		
 		calculateSalaries: calculateSalaries()
 	}

 	function calculateSalaries(){ 
 		
 		return employeeDataFormatter.formatEmployeeData().then(function(data){

		    //Check we didn't get back an error of some sort
		    if (data.error!== undefined && data.error.length > 0){
		    	console.log('Error ' + data.error);
		    }else{
		    	//Now we have all the shifts, organized by employee and days  
		    	
		    	for (var i=0; i<data.length; i++){

		    		//Calculate salary for each employee and added to the correct properties
		    		var employeeSalary = calculateEmployeeSalary(data[i]);
		    		data[i].salary = employeeSalary.totalSalary;
		    		data[i].overtime = employeeSalary.totalOvertime;
		    		data[i].evening = employeeSalary.totalEvening;	
		    	}		    	
		    }

		    return data;

 		});
 	}

 	function calculateEmployeeSalary(employee){
		var employeeTotalRegular = 0;
		var employeeTotalOvertime = 0;
		var employeeTotalEvening = 0;
		
		for (var i=0; i<employee['days'].length; i++){
			
			var dailySalary = dailySalaryCalculations(employee['days'][i]['shifts']);
			employeeTotalRegular += dailySalary.regularSalary;
			employeeTotalOvertime += dailySalary.overtime;
			employeeTotalEvening += dailySalary.evening;
			
		}

		//Round to two decimals after all calculations are done

		return {
					'totalSalary': round(employeeTotalRegular + employeeTotalOvertime + employeeTotalEvening, 2),
					'totalOvertime': round(employeeTotalOvertime, 2),
					'totalEvening': round(employeeTotalEvening, 2)
				}

	}

	/* Salary calculation rules
	 * - Overtime has priority -> determine how many hours of work in a day
	 *						   -> first 2 overtime hours, overtime is +25%
	 *						   -> next 2 overtime hours, overtime is +50%
	 *						   -> after it, overtime is +100%
	 * - Evening hours between 18:00 and 06:00 (separate from overtime compensations)
	 * - Everything else is normal hourly wage
	 */
 	function dailySalaryCalculations(shifts){

 		//Given hourly wage
 		var hourlyWage = 3.75;

 		//Given evening compensation per hour
 		var hourlyEveningWage = 1.15;

 		var dayTotalTime = 0;
 		var regularSalary = 0;
 		var overtime = 0; //overtime compensation
 		var evening = 0; //evening compensation

 		//Go through the shift and calculate for each of them: total time, evening time compensations
 		for (var i=0; i<shifts.length; i++){
 			dayTotalTime += getShiftLength(shifts[i].start, shifts[i].end);

 			evening += getEveningWorkLength(shifts[i].start, shifts[i].end) * hourlyEveningWage;
 		}

 		if (dayTotalTime > 12){

 			overtime = (dayTotalTime - 12) * 2 * hourlyWage 
 							+ 2 * 1.5 * hourlyWage
 							+ 2 * 1.25 * hourlyWage;

 			regularSalary = 8 * hourlyWage;

 		}else if (dayTotalTime > 10){

 			overtime = (dayTotalTime - 10) * 1.5 * hourlyWage
 							+ 2 * 1.25 * hourlyWage;

 			regularSalary = 8 * hourlyWage;

 		}else if (dayTotalTime > 8){

 			overtime = (dayTotalTime - 8) * 1.25 * hourlyWage;

 			regularSalary = 8 * hourlyWage;

 		}else{
 			regularSalary = dayTotalTime * hourlyWage;
 		}
	 		
 		return {'regularSalary' : regularSalary, 'overtime': overtime, 'evening': evening};
 	}

 	/* Returns shift length in hours
 	 * Gets shift start and end time as 'hh:mm'
 	 * If the shift goes into the next day, the  end of the shift will be a lower
 	 * integer value than the start --> add a day (24*60mins)
 	 * Round to two decimal places before return 
 	 */
 	function getShiftLength(start, end){
 		
 		var startMin = timeStringToMins(start);
 		var endMin = timeStringToMins(end);

 		return round((endMin - startMin 
 					+ (endMin < startMin ? 24*60 : 0) ) /60, 2) ;
 	}

 	/* Returns evening work length
 	 * Evening work is between 18:00 and 06:00
 	 *
 	 */
 	function getEveningWorkLength(start, end){
 		//Evening work times to min
 		var startEveningMin = timeStringToMins('18:00');
 		var endEveningMin = timeStringToMins('6:00') + 24 * 60; 

 		//Shift times to min
 		var startMin = timeStringToMins(start);
 		var endMin = timeStringToMins(end);

 		//Check if shift starts and ends in the same day; add 24h if it does not
 		if (endMin < startMin){
 			endMin += 24 * 60;
 		}

 		var overlap = [];

 		overlap[0] = Math.max(startEveningMin, startMin);
		overlap[1] = Math.min(endEveningMin, endMin);

		if (overlap[0] > overlap[1]) {
			return 0;
		}

		//Round to two decimals
		return round((overlap[1] - overlap[0]) / 60, 2); 		
 	}


 	/* Returns the 'HH:mm' as time elapsed from the beginning of the day
 	 * Uses the beginning of the day as a reference: t (min) = parseInt(t[0]) * 60 + parseInt(t[1])
 	 */
 	function timeStringToMins(timeString){
 		var t = timeString.split(':');

 		return parseInt(t[0]) * 60 + parseInt(t[1]); 	
 	}

 	/* Round value to two decimal places
 	 * For currency calculations and time
 	 */
 	function round(value, decimals) {
  		return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
	}


 }]);