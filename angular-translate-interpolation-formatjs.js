angular.module('pascalprecht.translate').constant(
    'TRANSLATE_FS_INTERPOLATION_CACHE', '$translateFormatJsInterpolation')
  .factory('$translateFormatJsInterpolation', [
    '$cacheFactory',
    'TRANSLATE_FS_INTERPOLATION_CACHE',
    function($cacheFactory, TRANSLATE_FS_INTERPOLATION_CACHE) {
      var DEFAULT_LOCALE = 'en';
      var $translateInterpolator = {},
        $cache = $cacheFactory.get(TRANSLATE_FS_INTERPOLATION_CACHE),
        _locale = DEFAULT_LOCALE;
      //
      $identifier = 'formatjs',
        $sanitizeValueStrategy = null,
        sanitizeValueStrategies = {
          escaped: function(params) {
            var result = {};
            for (var key in params) {
              if (Object.prototype.hasOwnProperty.call(params, key)) {
                result[key] = angular.element('<div></div>').text(params[
                  key]).html();
              }
            }
            return result;
          }
        };
      var sanitizeParams = function(params) {
        var result;
        if (angular.isFunction(sanitizeValueStrategies[
            $sanitizeValueStrategy])) {
          result = sanitizeValueStrategies[$sanitizeValueStrategy](params);
        } else {
          result = params;
        }
        return result;
      };
      if (!$cache) {
        $cache = $cacheFactory(TRANSLATE_FS_INTERPOLATION_CACHE);
      }
      $translateInterpolator.setLocale = function(locale) {
        var langId;
        if (locale.split("_").length == 2) {
          langId = locale.split("_")[0];
        } else if (locale.split("-").length == 2) {
          langId = locale.split("-")[0];
        } else {
          langId = locale;
        }

        _locale = langId;
      };
      $translateInterpolator.getInterpolationIdentifier = function() {
        return $identifier;
      };
      $translateInterpolator.useSanitizeValueStrategy = function(value) {
        $sanitizeValueStrategy = value;
        return this;
      };
      $translateInterpolator.interpolate = function(string,
        interpolateParams) {

        interpolateParams = interpolateParams || {};
        if ($sanitizeValueStrategy) {
          interpolateParams = sanitizeParams(interpolateParams);
        }
        var stringKey = string + angular.toJson(interpolateParams);
        var interpolatedText = $cache.get(stringKey);
        if (!interpolatedText) {
          var msg = new IntlMessageFormat(string, _locale);
          $cache.put("mf." + stringKey, msg);
          //TODO get from cache
          interpolatedText = msg.format(interpolateParams);
          $cache.put(stringKey, interpolatedText);
        }
        return interpolatedText;
      };
      return $translateInterpolator;
    }
  ]);
