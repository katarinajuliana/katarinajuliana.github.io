angular.module('katarinaApp', ['akoenig.deckgrid'])
.controller('katarinaCtrl', function($scope, $http, $sce) {
  var fetchPosts = function() {
    var urlBase = 'http://api.tumblr.com/v2/blog/katarinaio.tumblr.com/posts?callback=JSON_CALLBACK&offset=';
    
  	$http.jsonp(urlBase + $scope.allPosts.length)
  	.success(function(response) {
  		var posts = response['response']['posts'];

  		angular.forEach(posts, function(post) {
  			post.body = $sce.trustAsHtml(post.caption);
  		  post.rank = 0.5 - Math.random();
      
        if (post.type == 'photo') {
          post.image = post['photos'][0]['alt_sizes'][1]['url'];
        } else if (post.type == 'video') {
          post.video = $sce.trustAsHtml(post['player'][2]['embed_code']);
        }
  		});

  		$scope.allPosts = $scope.allPosts.concat(posts);
      
      if ($scope.allPosts.length < response['response']['total_posts']) {
        fetchPosts();
      } else {
        $scope.updateFacet($scope.facet);
      }
  	});
  };

	$scope.facets = [
		{
  			'name' : 'Katarina Juliana Blagojevic',
  			'tag' : 'kjb',
  			'order' : 'rank',
  			'katarina' : true
  		},
  		{
  			'name' : 'Vintage Lifestyle Enthusiast',
  			'tag' : 'vintage',
  			'order' : '-date'
  		},
  		{
  			'name' : 'Software Engineer', 
  			'tag' : 'software',
  			'order': '-date'
  		},
  		{
  			'name' : 'Pitbull Mama',
  			'tag' : 'pitbull',
  			'order': '-date'
  		},
  		{
  			'name' : 'Tattoo Collector',
  			'tag' : 'tattoo',
  			'order': '-date'
  		}
  	];
    
  	$scope.facet = $scope.facets[0];
    $scope.allPosts = [];
    $scope.showingPosts = [];
    fetchPosts();
    
    $scope.updateFacet = function(facet) {
      $scope.facet = facet;
      
      $scope.showingPosts = $scope.allPosts.filter(function (post) {
        return facet.tag == 'kjb' || post.tags.indexOf(facet.tag) > -1;
      }).sort(function(post1, post2) {
        if (facet.order == 'rank') {
          return post1.rank - post2.rank;
        } else {
          return Date.parse(post2.date) - Date.parse(post1.date);
        }
      });
      
      document.getElementsByClassName('posts')[0].scrollTop = 0;
      document.getElementsByTagName('body')[0].scrollTop = 0;
    }
});
