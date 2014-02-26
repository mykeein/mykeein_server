'use strict';

/* Services */

var services = angular.module('keiin.services', ['ngResource']);

services.value('version', MConf.version);

services.value('domain', MConf.domain);

services.value('name', MConf.name);

services.factory('KeiinService', [ '$http', function(http) {
    var server = MConf.domain;
    return {
        sendRequest: function(username,cb) {
            http.post(server + '/requests/' + username)
            .success(
                function(data, status, headers, config) {
                    cb(data);
                })
            .error(
                function(data, status, headers, config) {
                    console.log("(sendRequest)ERROR: Could not get data. data:" + data + ",status:" + status);
                });
        },
        checkResponse: function(requestId,cb) {
            var body = { requestId:requestId };
            http.post(server + '/requests/response/check',body)
            .success(
                function(data, status, headers, config) {
                    cb(data);
                })
            .error(
                function(data, status, headers, config) {
                    console.log("ERROR(checkRequest): Could not get data. data:" + data + ",status:" + status);
                });
        }
    };
}]);