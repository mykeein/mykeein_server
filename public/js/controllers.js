'use strict';
/* Controllers */

var controllers = angular.module('mykeein.controllers', []);

controllers.controller('mykeein.controllers.app', ['$scope', '$translate', function(scope, $translate) {

    scope.ru = $translate.preferredLanguage()=='ru';
    scope.en = $translate.preferredLanguage()=='en';
    scope.he = $translate.preferredLanguage()=='he';

    scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
        scope.ru = langKey=='ru';
        scope.en = langKey=='en';
        scope.he = langKey=='he';
    };
}]);

controllers.controller('mykeein.controllers.main', ['$scope', '$location', function(scope, location) {
    scope.data = {};
    scope.data.inputEmail = "email";

    scope.sendRequest = function() {
        location.path("/"+scope.data.inputEmail);
    };
}]);
controllers.controller('mykeein.controllers.user', ['$scope',function(scope) {

}]);

controllers.controller('UserController', ['$scope', '$routeParams', 'MyKeeInService', function(scope, routeParams, MyKeeInService) {
    scope.keyValue = ['00','01','02','03','04','05','06','07','08','09','0a','0b','0c','0d','0e','0f'];
    scope.data = {};
    scope.data.countToClean = 15;
    scope.data.ansContent = '';
    scope.data.waitingLabelEmail = routeParams.email;
    scope.data.selections = ['decrypt', 'finishDecrypt', 'waiting', 'blocked', 'warned', 'notexist', 'notregistered'];
    scope.data.selection = scope.data.selections[2];
    scope.data.code = "";
    MyKeeInService.sendRequest(routeParams.email, function(ans) {
        scope.data.ans = ans;
        if(scope.data.ans.status=='success'){
            scope.data.selection = scope.data.selections[2];
            scope.waitTillResponse(scope.data.ans.data._id);
        }
        if(scope.data.ans.status=='block'){
            scope.data.selection = scope.data.selections[3];
        }
        if(scope.data.ans.status=='notexist'){
            scope.data.selection = scope.data.selections[5];
        }
        if(scope.data.ans.status=='notregistered'){
            scope.data.selection = scope.data.selections[6];
        }
    });

    scope.cleanAns = function($event) {
        console.log($event);
        scope.data.ansContent = 'NaN';
    };

    scope.waitTillResponse = function(requestId) {
        setTimeout(function(){
            MyKeeInService.checkResponse(requestId, function(ans) {
                if(ans.status!='wait'){
                    scope.data.ans = ans;
                    if(scope.data.ans.data.requestData.dataType=='response'){
                        scope.data.selection = scope.data.selections[0];
                    }else if(scope.data.ans.data.requestData.dataType=='block'){
                        scope.data.selection = scope.data.selections[3];
                    }else if(scope.data.ans.data.requestData.dataType=='warn'){
                        scope.data.selection = scope.data.selections[4];
                    }else{
                        scope.waitTillResponse(requestId);
                    }
                }else{
                    scope.waitTillResponse(requestId);
                }
            })},3000);
    };

    scope.decrypt = function() {
        //https://github.com/mpetersen/aes-example
        var iv = "F27D5C9927726BCEFE7510B1BDD3D137";
        var salt = "3FF2EC019C627B945225DEBAD71A01B6985FE84C95A70EB132882F88C0A59A55";
        var keySize = 128;
        var iterationCount = 1000;
        var passPhrase = scope.data.code;
        var cipherText = scope.data.ans.data.requestData.content;
        var aesUtil = new AesUtil(keySize, iterationCount)
        var decrypt = aesUtil.decrypt(salt, iv, passPhrase, cipherText);
        scope.data.ansContent = decrypt;
        scope.data.selection = scope.data.selections[1];
    };
}]);