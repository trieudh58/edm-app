
angularBolt.service('rest', function ($http, $location, $routeParams) {

    return {

        baseUrl: 'http://localhost:2052/api/v1/',
        path: undefined,

        models: function () {
            return $http.get(this.baseUrl + this.path + location.search);
        },

        model: function () {
            return $http.get(this.baseUrl + this.path + "/" + $routeParams.id);
        },

        get: function () {
            return $http.get(this.baseUrl + this.path);
        },

        getWithParams: function (model) {
            return $http.get(this.baseUrl + this.path, {params: model});
        },

        postFile: function (model) {
            return $http.post(this.baseUrl + this.path, model, {headers: {'Content-Type': undefined}});
        },

        postModel: function (model) {
            return $http.post(this.baseUrl + this.path, model);
        },

        putModel: function (model) {
            return $http.put(this.baseUrl + this.path, model);
        },

        deleteModel: function (model) {
            return $http.delete(this.baseUrl + this.path, {params: model});
        },
        deleteForm: function (model) {
            return $http.delete(this.baseUrl + this.path, model);
        }
    };

});