var app= angular.module('Biclocale.controllers', []);
var url="http://192.168.1.8:8081/";

app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
});

app.controller('PlaylistsCtrl', function($http,$scope,$state) {
  $scope.lists=[];
  $scope.laune={};
  $scope.currentPage=-1;
  $scope.size=3;
  $scope.nombreP=0;
  $scope.chargerActualites=function(page){
   $http.get(url+"getArticles?page="+$scope.currentPage+"&size="+$scope.size)
   .success(function(data){
    $scope.nombreP=data.totalPages;
     data.content.forEach(function(act){
      $scope.lists.push(act);
    });
    $scope.$broadcast('scroll.infiniteScrollComplete');
   })
   .error(function(erre){
  console.log(erre);
  });
   };
$scope.alaUne=function(){
 $http.get(url+"getArticlesAlaune").success(function(data){
  $scope.laune=data.content;
})
.error(function(erre){
  console.log(erre);
  });
};

$scope.loadMore=function(){ 
   if($scope.currentPage<=$scope.nombreP){
        ++$scope.currentPage;
     // alert($scope.currentPage);
    $scope.chargerActualites($scope.currentPage);
   }  
         
  };
//$scope.loadMore();
$scope.alaUne();
$scope.getDetail=function(id){
    $state.go("app.single",{idAct:id});
       };

$scope.getDetailAlaune=function(id){
    $state.go("app.slider",{idslider:id});
       };
});

app.controller('PlaylistCtrl', function($http,$scope,$stateParams,$cordovaSocialSharing){
  $scope.idActualite=$stateParams.idAct; 
  $scope.actualite={}; 
  $scope.textpartage="";
  $scope.url_ph="";

  $http.get("http://192.168.1.8:8081/getArticle/"+$scope.idActualite)
 .success(function(data){
  $scope.textpartage=data.texte;
  $scope.url_ph=data.url_photo;
  $scope.actualite=data;
  })
 .error(function(erre){
  console.log(erre)
  });
  
  $scope.shareAnywhere = function() {
      $cordovaSocialSharing.share($scope.textpartage, null, "http://192.168.1.8:8081"+$scope.url_ph+".png", null);
    };

});
app.controller('SliderCtrl',function($http,$scope,$stateParams,$cordovaSocialSharing){
  $scope.idActualiteAlaune=$stateParams.idslider; 
  $scope.actualiteAlaune={};
  $scope.textpartage="";
  $scope.url_ph="";
  $http.get("http://192.168.1.8:8081/getArticle/"+$scope.idActualiteAlaune)
  .success(function(data){
  $scope.textpartage=data.texte;
  $scope.url_ph=data.url_photo;
   $scope.actualiteAlaune=data;
  }).error(function(erre){
    console.log(erre)
  });
  $scope.shareAnywhere = function() {
      $cordovaSocialSharing.share($scope.textpartage, null, "http://192.168.1.8:8081"+$scope.url_ph+".png", null);
    }

});
app.controller('ContactCtrl',function($http,$scope,$stateParams,$cordovaSocialSharing){
 var onSuccess = function(result) {
  console.log("Share completed? " + result.completed); 
  console.log("Shared to app: " + result.app); 
}

var onError = function(msg) {
  console.log("Sharing failed with message: " + msg);
}

$scope.shareQuestion = function() {
      $cordovaSocialSharing.shareViaEmail('boby','Question', ['biclocale@gmail.com'],null,null,null,onSuccess,onError);
    }
$scope.shareBug = function() {
      $cordovaSocialSharing.shareViaEmail('boby','bug', ['biclocale@gmail.com'],null,null,null,onSuccess,onError);
    }
$scope.shareSuggestion = function() {
      $cordovaSocialSharing.shareViaEmail('boby','Suggestion', ['biclocale@gmail.com'],null,null,null,onSuccess,onError);
    }

});
app.factory('ALaUne',function(){
               var alanue=[];
                return{
                    list:function($http){
                        $http({
                  method:'GET',
                  url :url+"getArticlesAlaune" })
                        .then(function(data) {
                     alanue = data.data;
                                       console.log(alanue);
                                   });
                                   return alanue;
});
