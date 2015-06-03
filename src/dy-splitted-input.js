/* global angular */
!(function() {
  'use strict';

  angular
    .module('dySplittedInput', [])
    .directive('dySplittedInput', dySplittedInputDirective)
    .controller('DySplittedInputController', DySplittedInputController)
    .directive('dySplittedInputField', dySplittedInputFieldDirective);

  dySplittedInputDirective.$inject = [];

  function dySplittedInputDirective() {
    var MAX_LENGTH = 2;
    var NUMBER_OF_FIELDS = 4;

    return {
      require: 'ngModel',
      restrict: 'EA',
      controller: 'DySplittedInputController'
    };
  }

  function DySplittedInputController() {
    this.fields = [];
  }

  DySplittedInputController.$inject = [];

  DySplittedInputController.prototype.registerField = function (field) {
    this.fields.push(field);
  };

  DySplittedInputController.prototype.focusNextField = function (currentField, newValue) {
    var currentFieldIndex = this._getIndexOfField(currentField);
    var nextField = this.fields[currentFieldIndex + 1];

    if (nextField) {
      if (newValue) {
        nextField.val(newValue);
      }

      nextField[0].focus();

      if (!newValue) {
        nextField[0].select();
      }
    }
  };

  DySplittedInputController.prototype.focusPrevField = function (currentField) {
    var currentFieldIndex = this._getIndexOfField(currentField);
    var prevField = this.fields[currentFieldIndex - 1];

    if (prevField) {
      prevField[0].focus();
    }
  };

  DySplittedInputController.prototype._getIndexOfField = function (field) {
    var indexOfField = this.fields.indexOf(field);

    if (indexOfField === -1) {
      throw new Error('Field has not been registered for this splitted input');
    } else {
      return indexOfField;
    }
  };

  dySplittedInputFieldDirective.$inject = [];

  function dySplittedInputFieldDirective() {
    var BACKSPACE_KEYCODE = 8;
    var TAB_KEYCODE = 9;
    var SHIFT_KEYCODE = 16;

    return {
      require: '^^dySplittedInput',
      restrict: 'A',
      link: function ($scope, $element, $attr, ctrl) {
        ctrl.registerField($element);

        var prevVal;

        $element.on('keypress', function (e) {
          prevVal = $element.val() || '';

          window.setTimeout(function () {
              if ($element.val().length === +$attr.maxlength) {
                ctrl.focusNextField($element, prevVal.length === +$attr.maxlength ? String.fromCharCode(e.keyCode) : null);
              }
          }, 0);
        });

        $element.on('keydown', function (e) {
          if ($element.val().length === 0 && e.keyCode === BACKSPACE_KEYCODE) {
            ctrl.focusPrevField($element);
          }
        })
      }
    }
  }
}());
