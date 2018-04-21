'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Pydio Cell Rest API
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * OpenAPI spec version: 1.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * NOTE: This class is auto generated by the swagger code generator program.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * https://github.com/swagger-api/swagger-codegen.git
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Do not edit the class manually.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _ApiClient = require('../ApiClient');

var _ApiClient2 = _interopRequireDefault(_ApiClient);

var _InstallCheckResult = require('./InstallCheckResult');

var _InstallCheckResult2 = _interopRequireDefault(_InstallCheckResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* The InstallPerformCheckResponse model module.
* @module model/InstallPerformCheckResponse
* @version 1.0
*/
var InstallPerformCheckResponse = function () {
    /**
    * Constructs a new <code>InstallPerformCheckResponse</code>.
    * @alias module:model/InstallPerformCheckResponse
    * @class
    */

    function InstallPerformCheckResponse() {
        _classCallCheck(this, InstallPerformCheckResponse);

        this.Result = undefined;
    }

    /**
    * Constructs a <code>InstallPerformCheckResponse</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/InstallPerformCheckResponse} obj Optional instance to populate.
    * @return {module:model/InstallPerformCheckResponse} The populated <code>InstallPerformCheckResponse</code> instance.
    */


    _createClass(InstallPerformCheckResponse, null, [{
        key: 'constructFromObject',
        value: function constructFromObject(data, obj) {
            if (data) {
                obj = obj || new InstallPerformCheckResponse();

                if (data.hasOwnProperty('Result')) {
                    obj['Result'] = _InstallCheckResult2.default.constructFromObject(data['Result']);
                }
            }
            return obj;
        }

        /**
        * @member {module:model/InstallCheckResult} Result
        */

    }]);

    return InstallPerformCheckResponse;
}();

exports.default = InstallPerformCheckResponse;