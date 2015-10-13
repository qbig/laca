'use strict';

angular.module('starter.services', [])

.factory('LCCService', ['$q', '$http', 'ApiEndpoint', '$localForage', '$parse', function($q, $http, ApiEndpoint, $localForage, $parse) {

	var filterByUnique = function(arr, key, flag) {
	    var unique = [], tmp = [];
	    for (var i = 0; i < arr.length; i++) { 
	        if (arr[i][key] === "") continue;
	      
	        var current = arr[i][key];
	        if (tmp.indexOf(current) < 0) {
	          tmp.push(current);

	          if (flag) {
	          	unique.push({title: current});
	          }else{
	          	unique.push(current);
	          }
	        }
	    }
	    return unique;
	};

	var groupBy = function (collection, getter) {
        var result = {};
        var prop;

        angular.forEach( collection, function( elm ) {
          prop = getter(elm);

          if(!result[prop]) {
            result[prop] = [];
          }
          result[prop].push(elm);
        });
        return result;
    }

    var chunk = function (arr, n) {
	    if ( !arr.length ) {
	        return [];
	    }
	    return [ arr.slice( 0, n ) ].concat( chunk( arr.slice(n), n) );
	};

	////////////////////////////////////////////////////////////////////////////

	return {

		////////////////////////////////////////////////////////////////////////////
		filterBySubCategory: function(arr, cat) {

	        var t, tmp = [];
	        for (var i = arr.length-1; i > -1; i--) { 
	            
	            if (arr[i]["Main Cat"] === cat) {

	            	if (arr[i]["Sub-Cat 1"] === "") arr[i]["Sub-Cat 1"] = "Others";

	            	tmp.push({title: arr[i]["Item Description"], 
		                year: arr[i]["Vintage/Year"], 
		                price: arr[i]["Price/Btl"], 
		                volume: arr[i]["Volume"], 
		                subcat1: arr[i]["Sub-Cat 1"], 
		                subcat2: arr[i]["Sub-Cat 2"],
		                photo: "../img/icons/" + cat + ".jpg" 
		            });
	            }
	        }

	        //test
	        //var t = groupBy(tmp, $parse("subcat1"));
	        //console.log(t);

	        //console.log(tmp);
	        //console.log(chunk(tmp, 6));

	        return chunk(tmp, 8);
	    },
		getAll: function() {
			var deferred = $q.defer();

			$http.get(ApiEndpoint.url + '/5e8b3d25')
			.success(function (data) {

				var m = filterByUnique(data.result, "Main Cat", true);
				
				$localForage.setItem('LCCCategories', JSON.stringify(m));
				$localForage.setItem('LCCData', JSON.stringify(data.result));

				deferred.resolve(m);
			})
			.error(function (e) {
				deferred.reject(e);
			});

			return deferred.promise;
		}
	};
}]);
