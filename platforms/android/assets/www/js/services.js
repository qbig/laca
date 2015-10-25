'use strict';

angular.module('starter.services', [])

.service('CacheImages', function($q){
    return {
        checkCacheStatus : function(src){
            var deferred = $q.defer();
            ImgCache.isCached(src, function(path, success) {
                if (success) {
                    deferred.resolve(path);
                } else {
                    ImgCache.cacheFile(src, function() {
                        ImgCache.isCached(src, function(path, success) {
                            deferred.resolve(path);
                        }, deferred.reject);
                    }, deferred.reject);
                }
            }, deferred.reject);
            return deferred.promise;
        }
    };
})

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
    };

    var chunk = function (arr, n) {
    	if ( !arr.length ) {
	        return [];
	    }
	    return [ arr.slice( 0, n ) ].concat( chunk( arr.slice(n), n) );
    };

    var matchKey = function (objectToSearch, keyToFind) {
	    for (var k in objectToSearch) {
	        if ( k.toLowerCase().indexOf(keyToFind.toLowerCase()) !== -1) {
	            return objectToSearch[k];
	        }
	    }
	    return null;
	};

	////////////////////////////////////////////////////////////////////////////

	return {

		////////////////////////////////////////////////////////////////////////////
		chunkBy: function (arr, n) {
			return chunk(arr, n);
		},
		filterBySubCategory: function(arr, cat) {

	        var t, tmp = [];
	        for (var i = arr.length-1; i > -1; i--) { 
	            
	            if (arr[i]["Main Cat"] === cat) {

	            	if (arr[i]["Sub-Cat 1"] === "") arr[i]["Sub-Cat 1"] = "Others";

	            	tmp.push({title: arr[i]["Item Description"], 
		                year: arr[i]["Vintage/Year"], 
		                price: matchKey(arr[i], "price"), 
		                volume: arr[i]["Volume"], 
		                subcat1: arr[i]["Sub-Cat 1"], 
		                subcat2: arr[i]["Sub-Cat 2"],
		                photo: arr[i]["image"] 
		            });
	            }
	        }

	        //test
	        //var t = groupBy(tmp, $parse("subcat1"));
	        //console.log(t);

	        //console.log(tmp);
	        //console.log(chunk(tmp, 6)); chunk(tmp, 8);

	        return tmp;
	    },
		get: function(_CHILD) {
			var deferred = $q.defer();

			$http.get(ApiEndpoint.url + _CHILD)
			.success(function (data) {

				var m = filterByUnique(data.result, "Main Cat", true);

				$localForage.getItem('LCCCategories').then(function(localdata) {

					if (localdata === null) {
						$localForage.setItem('LCCCategories', JSON.stringify(m));
					}else{
						$localForage.setItem('LCCCategories', JSON.stringify( JSON.parse(localdata).concat(m)));
					}
				});

				$localForage.getItem('LCCData').then(function(localdata) {

					if (localdata === null) {
						$localForage.setItem('LCCData', JSON.stringify(data.result));
					}else{
						$localForage.setItem('LCCData', JSON.stringify(JSON.parse(localdata).concat(data.result)));
					}
				});

				deferred.resolve(m);
			})
			.error(function (e) {
				deferred.reject(e);
			});

			return deferred.promise;
		}
	};
}]);
