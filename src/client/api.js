'use strict';

// *****************************************************
// API
// *****************************************************

function ResultSet() {

    this.loaded = false;
    this.loading = true;
}

ResultSet.prototype.set = function(error, value) {

    this.loaded = true;
    this.loading = false;

    this.error = error;
    this.value = value;
};


module.factory('$RAW', ['$http', '$log', function($http, $log) {
    return {
        call: function(obj, fun, arg, callback) {
            var res = new ResultSet();
            $log.debug('$RPC', obj, fun, arg, res, res.error);
            $http.post('/api/' + obj + '/' + fun, arg)
                .success(function(value) {
                    res.set(null, value);
                    if(typeof callback === 'function') {
                        callback(null, res.value);
                    }
                })
                .error(function(value) {
                    res.set(value, null);
                    if(typeof callback === 'function') {
                        callback(res.error, null);
                    }
                });
            return res;
        }
    };
}]);
