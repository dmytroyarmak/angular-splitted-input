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

  DySplittedInputController.prototype.focusNextField = function (currentField) {
    this._focusOffsetField(currentField, +1);
  };

  DySplittedInputController.prototype.focusPrevField = function (currentField) {
    this._focusOffsetField(currentField, -1);
  };

  DySplittedInputController.prototype._focusOffsetField = function (currentField, offset) {
    var currentFieldIndex = this._getIndexOfField(currentField);
    var offsetField = this.fields[currentFieldIndex + offset];

    if (offsetField) {
      offsetField[0].focus();
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

        $element.on('keyup', function (e) {
          var length;

          if (e.which !== SHIFT_KEYCODE && e.which !== TAB_KEYCODE) {
            length = $element.val().length;

            if (length === +$attr.maxlength && e.which !== TAB_KEYCODE) {
              ctrl.focusNextField($element);
            } else if (length === 0 && e.which === BACKSPACE_KEYCODE) {
              ctrl.focusPrevField($element);
            }
          }
        })
      }
    }
  }
}());
