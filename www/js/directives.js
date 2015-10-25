'use strict';

angular.module('starter.directives', ['ionic'])

.directive('bgImage', function () {
    return function (scope, element, attrs) {
	    element.css({
	        'background-image': 'url(' + attrs.contentImage + ')',
	        'background-size': 'cover',
	        'background-repeat': 'no-repeat',
	        'background-position': 'center center'
	    });

    };
})

.directive('cacheBackground', function() {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {  
        	if (ImgCache.ready) {
				ImgCache.isBackgroundCached(el, function(path, success) {
		            if (success) {
		                ImgCache.useCachedBackground(el);
		            } else { 
		                ImgCache.cacheBackground(el, function() {
		                    //ImgCache.useCachedBackground(el);
		                });
		            }
		        });
			}
        }
    };
})

// <img ng-cache ng-src="..." />
.directive('ngCache', function() {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
        	if (ImgCache.ready) {
	            attrs.$observe('ngSrc', function(src) {

	            	//src = src.replace(/\s/g, "-"); 

	                ImgCache.isCached(src, function(path, success) {
	                    if (success) {
	                        ImgCache.useCachedFile(el);
	                    } else {
	                        ImgCache.cacheFile(src, function() {
	                            //ImgCache.useCachedFile(el);
	                        });
	                    }
	                });
	            });
	        }
        }
    };
})

.directive('fadeBar', function($timeout, $ionicSideMenuDelegate) {
	return {
		restrict: 'E',
		template: '<div class="fade-bar"></div>',
		replace: true,
		link: function($scope, $element/*, $attr*/) {
			// Run in the next scope digest
			$timeout(function() {
				// Watch for changes to the openRatio which is a value between 0 and 1 that says how "open" the side menu is
				$scope.$watch(function() {
					return $ionicSideMenuDelegate.getOpenRatio();
				},
				function (ratio) {
					$element[0].style.opacity = Math.abs(ratio);
				});
			});
		}
	};
})

.directive('focusMe', function ($timeout) {
	return {
		link: function (scope, element/*, attrs*/) {
			$timeout(function () {
				element[0].focus();
			}, 150);
		}
	};
})

.directive('input', function($timeout) {
	return {
		restrict: 'E',
		scope: {
			'returnClose': '=',
			'onReturn': '&',
			'onFocus': '&',
			'onBlur': '&'
		},
		link: function (scope, element/*, attr*/) {
			element.bind('focus', function () {
				if (scope.onFocus) {
					$timeout(function() {
						scope.onFocus();
					});
				}
			});
			element.bind('blur', function () {
				if (scope.onBlur) {
					$timeout(function() {
						scope.onBlur();
					});
				}
			});
			element.bind('keydown', function (e) {
				if (e.which == 13) {
					if (scope.returnClose) element[0].blur();
					if (scope.onReturn) {
						$timeout(function() {
							scope.onReturn();
						});
					}
				}
			});
		}
	};
})

.directive('homeButton', function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/directives/home-button.html',
		//template: '<button class="button button-rounded" ng-click="goHome()"></button>'
	};
})

.filter('offset', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
})

.filter('characters', function () {
	return function (input, chars, breakOnWord) {
		if (isNaN(chars)) return input;
		if (chars <= 0) return '';
		if (input && input.length > chars) {
			input = input.substring(0, chars);

			if (!breakOnWord) {
				var lastspace = input.lastIndexOf(' ');
				//get last space
				if (lastspace !== -1) {
					input = input.substr(0, lastspace);
				}
			}else{
				while(input.charAt(input.length-1) === ' '){
					input = input.substr(0, input.length -1);
				}
			}
			return input + '…';
		}
		return input;
	};
})

.filter('splitcharacters', function() {
		return function (input, chars) {
				if (isNaN(chars)) return input;
				if (chars <= 0) return '';
				if (input && input.length > chars) {
						var prefix = input.substring(0, chars/2);
						var postfix = input.substring(input.length-chars/2, input.length);
						return prefix + '...' + postfix;
				}
				return input;
		};
})

.filter('words', function () {
		return function (input, words) {
				if (isNaN(words)) return input;
				if (words <= 0) return '';
				if (input) {
						var inputWords = input.split(/\s+/);
						if (inputWords.length > words) {
								input = inputWords.slice(0, words).join(' ') + '…';
						}
				}
				return input;
		};
});
