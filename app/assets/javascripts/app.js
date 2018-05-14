var app = angular.module('FinanceTrackerApp', [])
                 .factory('stocksService', ['$http', function($http){
                     var stockApi = {};
                     stockApi.searchStocks = function(symbol){
                        return $http.get('/search_stocks.json?stock=' + symbol);
                     }
                     return stockApi;
                 }])
                 .controller('stocksController', ['$scope', 'stocksService', function($scope, stocksService){
                    $scope.stock = {};
                    
                    $scope.lookup = function(){
                        if( $scope.ticker != 'undefined' && $scope.ticker != ''){
                            stocksService.searchStocks($scope.ticker)
                                .then(
                                    function(response){
                                        $scope.stock.error = null;
                                        $scope.stock.symbol = response.data.ticker;
                                        $scope.stock.name = response.data.name;
                                        $scope.stock.last_price = response.data.last_price;
                                        $scope.stock.can_be_added = response.data.can_be_added;
                                    }, 
                                    function(response){
                                        $scope.stock = {};
                                        $scope.stock.error = response.data.response;
                                    })
                        }
                        else {
                            $scope.stock = {}
                        }
                    }
                 }]);