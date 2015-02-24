angular.module('pascalprecht.translate')
  .provider('$translatePesudoInterpolationInterceptor', function() {
    var interceptors = [];
    this.add = function(interceptor) {
      interceptors.push(interceptor);
    }
    this.apply = function(string) {
      interceptors.forEach(function(interceptor) {
        string = interceptor(string);
      })
      return string;
    }

    this.$get = function factory() {
      return this;
    }
  })
  //Sample usage
  .config(['$translatePesudoInterpolationInterceptorProvider', function(
    provider) {
    provider.add(
      function _changePesudoTranslation(string) {
        return string;
        // return 'xx' + string + 'あ漢';
      });
  }])
  .factory('$translatePesudoInterpolation', ['$cacheFactory',
    '$translatePesudoInterpolationInterceptor',
    function($cacheFactory, $translatePesudoInterpolationInterceptor) {
      var $translateInterpolator = {},
        $identifier = 'pseudo';
      $translateInterpolator.interpolate = function(string, interpolateParams) {
        console.log($translatePesudoInterpolationInterceptor.apply(string));
        return $translatePesudoInterpolationInterceptor.apply(string);
      };
      $translateInterpolator.setLocale = function(locale) {};
      $translateInterpolator.getInterpolationIdentifier = function() {
        return $identifier;
      };
      return $translateInterpolator;
    }
  ]);
