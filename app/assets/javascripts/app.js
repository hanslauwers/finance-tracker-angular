var app = angular.module('FinanceTrackerApp', [])
                 .factory('stocksService', ['$http', function($http){
                     var stockApi = {};
                     stockApi.searchStocks = function(symbol){
                        return $http.get('/search_stocks.json?stock=' + symbol);
                     }
                     stockApi.addStockToPortfolio = function(symbol){
                        return $http.post('/user_stocks.json?stock=' + symbol);
                     }
                     return stockApi;
                 }])
                 .factory('friendsService', ['$http', function($http){
                     var friendApi = {};
                     friendApi.searchFriends = function(search_param){
                         return $http.get('/search_friends.json?search_param=' + search_param);
                     }
                     
                     friendApi.addFriend = function(friend_id){
                         return $http.post('/add_friend.json?friend=' + friend_id);
                     }
                     return friendApi;
                 }])
                 .controller('stocksController', ['$scope', 'stocksService', function($scope, stocksService){
                    $scope.stock = {};
                    
                    $scope.lookup = function(){
                        if( $scope.ticker != 'undefined' && $scope.ticker != ''){
                            stocksService.searchStocks($scope.ticker)
                                .then(
                                    function(response){
                                        $scope.stock.error = null;
                                        $scope.stock.message = null;
                                        $scope.stock.symbol = response.data.ticker;
                                        $scope.stock.name = response.data.name;
                                        $scope.stock.last_price = response.data.last_price;
                                        $scope.stock.can_be_added = response.data.can_be_added;
                                    }, 
                                    function(response){
                                        $scope.stock = {};
                                        $scope.stock.message = null;
                                        $scope.stock.error = response.data.response;
                                    })
                        }
                        else {
                            $scope.stock = {}
                        }
                    }
                    
                    $scope.add = function() {
                        if($scope.stock != undefined && $scope.stock.symbol != ''){
                            stocksService.addStockToPortfolio($scope.stock.symbol)
                                .then(
                                    function(response){
                                        $scope.stock.error = null;
                                        $scope.stock.message = response.data.response;
                                        $scope.ticker = null;
                                        $scope.stock.name = null;
                                        $('#stock-list').load('my_portfolio.js');
                                    },
                                    function(response){
                                        $scope.stock = {};
                                        $scope.stock.error = response.data.response;
                                    });
                        }
                        else{
                            $scope.stock.error = 'Scope cannot be added';
                        }
                    }
                 }])
                 .controller('friendsController', ['$scope', 'friendsService', function($scope, friendsService){
                    $scope.friends = {};
                     
                    $scope.lookup = function(){
                        if( $scope.friend_search_param != 'undefined' && $scope.friend_search_param != ''){
                            friendsService.searchFriends($scope.friend_search_param)
                                .then(
                                    function(response){
                                        $scope.friends.error = null;
                                        $scope.friends.message = null;
                                        $scope.friends.list = response.data;
                                    }, 
                                    function(response){
                                        $scope.friends = {};
                                        $scope.friends.message = null;
                                        $scope.friends.error = response.data.response;
                                    });
                         }
                         else{
                            $scope.friends = {};
                         }
                     }
                     
                    $scope.add = function(friend_id){
                        
                        $scope.friends = {};
                        
                        if( friend_id != 'undefined' && friend_id != ''){
                            friendsService.addFriend(friend_id)
                                .then(
                                    function(response){
                                        $scope.friends.error = null;
                                        $scope.friends.message = response.data.response;
                                        $scope.friend_search_param = null;
                                        $('#friends-list').load('my_friends.js');
                                    },
                                    function(response){
                                        $scope.friends.error = response.data.response;
                                    })
                        }
                        else{
                            $scope.friends.error = 'Friend cannot be added';
                        }
                            
                     }
                 }])