'use strict';

/* Controllers */

var controllers = angular.module('mykeein.controllers', []);

controllers.controller('mykeein.controllers.app', ['$scope', function(scope) {
}]);

controllers.controller('mykeein.controllers.main', ['$scope', function(scope) {
    scope.data = {};
    scope.data.inputEmail = "email";
}]);

controllers.controller('mykeein.controllers.user', ['$scope', '$routeParams', 'MyKeeInService', function(scope, routeParams, MyKeeInService) {
    scope.keyValue = ['00','01','02','03','04','05','06','07','08','09','0a','0b','0c','0d','0e','0f'];
    scope.data = {};
    scope.data.ansContent = '';
    scope.data.waitingLabelEmail = routeParams.email;
    scope.data.selections = ['decrypt', 'finishDecrypt', 'waiting', 'blocked', 'warned', 'notexist', 'notregistered'];
    scope.data.selection = scope.data.selections[2];
    scope.data.code = "code";
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
                        scope.waitTillResponse(requestId);
                    }else{
                        scope.waitTillResponse(requestId);
                    }
                }else{
                    scope.waitTillResponse(requestId);
                }
            })},5000);
    };

    scope.decrypt = function() {
        var passPhrase = scope.data.code;
        var passPhraseFinish = scope.getBytes(passPhrase);
        var key = CryptoJS.enc.Hex.parse(passPhraseFinish);
        var iv  = CryptoJS.enc.Hex.parse('0f0e0d0c0b0a09080706050403020100');
        var message = scope.data.ans.data.requestData.content;
        var decrypted = CryptoJS.AES.decrypt(message, key, { iv: iv, padding: CryptoJS.pad.NoPadding, mode: CryptoJS.mode.CBC});
        var decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
        scope.data.ansContent = decryptedStr.replace(" ","");
        scope.data.selection = scope.data.selections[1];
    };
    
    scope.getBytes = function(key) {
        var index = 0;
        var keyData = '';
        var l = 0;
        var chStr = '00';
        for (var i = 0; i < key.length; i++) {
            index = parseInt(key.charAt(i));
            chStr = scope.keyValue[index];
            keyData += chStr;
            l = i;
        }
        var need = 16 - l;
        for (var i = 1; i < need; i++) {
            chStr = scope.keyValue[0];
            keyData += chStr;
        }
        return keyData;
    }
}]);