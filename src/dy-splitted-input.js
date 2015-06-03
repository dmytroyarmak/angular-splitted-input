/* global angular */
!(function() {
  'use strict';

  angular
    .module('dySplittedInput', [])
    .directive('dySplittedInput', dySplittedInputDirective);

  dySplittedInputDirective.$inject = [];

  function dySplittedInputDirective() {
    return {
      restrict: 'EA',
      link: function () {
        console.log('dySplittedInput linked!');
      }
    };
  }
}());
