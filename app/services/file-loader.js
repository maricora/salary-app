/* Parses CVS file and return data in a JSON format
 * In case of errors when parsing, they can be found under 'errors' in the 
 * returned data
 * Uses PapaParse parser
*/

angular.module('myApp')
    .factory('fileLoader', ['$http', function($http){	

	 	return{
	 		parseFile: parseFile
	 	}

	 	function parseFile(){
	    	//File could be passed from elsewhere, so this can be reused for different files
	    	var Url = "./salaries/HourList201403.csv";
	    	
			return $http.get(Url)
				.then(passData)
				.catch(parsingDataFailed);

			function passData(response){
				return csvParser(response.data.trim());			
			}

			function parsingDataFailed(error){
				console.log('Failed to retrieve data from file ' + error);
			}	    	
	    	
	    }

	    /* Parses CSV data to JSON using PapaParser
		 * Receives content of CVS file as text
		 * Returns JSON result keyed in by field name
	     */
	    function csvParser(csv){		
			
			return Papa.parse(csv.trim(), {header: true});	
		}
}]);