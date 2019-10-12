import isEmail from "./validator/isEmail.js";
import isURL from "./validator/isURL.js";
import isMACAddress from "./validator/isMACAddress.js";
import isIP from "./validator/isIP.js";
import isIPRange from "./validator/isIPRange.js";
import isFQDN from "./validator/isFQDN.js";
import isBoolean from "./validator/isBoolean.js";
import isAlpha from "./validator/isAlpha.js";
import isAlphanumeric from "./validator/isAlphanumeric.js";
import isNumeric from "./validator/isNumeric.js";
import isPort from "./validator/isPort.js";
import isLowercase from "./validator/isLowercase.js";
import isUppercase from "./validator/isUppercase.js";
import isAscii from "./validator/isAscii.js";
import isFullWidth from "./validator/isFullWidth.js";
import isHalfWidth from "./validator/isHalfWidth.js";
import isVariableWidth from "./validator/isVariableWidth.js";
import isMultibyte from "./validator/isMultibyte.js";
import isSurrogatePair from "./validator/isSurrogatePair.js";
import isInt from "./validator/isInt.js";
import isFloat from "./validator/isFloat.js";
import isDecimal from "./validator/isDecimal.js";
import isHexadecimal from "./validator/isHexadecimal.js";
import isDivisibleBy from "./validator/isDivisibleBy.js";
import isHexColor from "./validator/isHexColor.js";
import isISRC from "./validator/isISRC.js";
import isMD5 from "./validator/isMD5.js";
import isHash from "./validator/isHash.js";
import isJWT from "./validator/isJWT.js";
import isJSON from "./validator/isJSON.js";
import isEmpty from "./validator/isEmpty.js";
import isLength from "./validator/isLength.js";
import isByteLength from "./validator/isByteLength.js";
import isUUID from "./validator/isUUID.js";
import isMongoId from "./validator/isMongoId.js";
import isAfter from "./validator/isAfter.js";
import isBefore from "./validator/isBefore.js";
import isIn from "./validator/isIn.js";
import isCreditCard from "./validator/isCreditCard.js";
import isIdentityCard from "./validator/isIdentityCard.js";
import isISIN from "./validator/isISIN.js";
import isISBN from "./validator/isISBN.js";
import isISSN from "./validator/isISSN.js";
import isMobilePhone from "./validator/isMobilePhone.js";
import isPostalCode from "./validator/isPostalCode.js";
import isCurrency from "./validator/isCurrency.js";
import isISO8601 from "./validator/isISO8601.js";
import isRFC3339 from "./validator/isRFC3339.js";
import isISO31661Alpha2 from "./validator/isISO31661Alpha2.js";
import isISO31661Alpha3 from "./validator/isISO31661Alpha3.js";
import isBase64 from "./validator/isBase64.js";
import isDataURI from "./validator/isDataURI.js";
import isMagnetURI from "./validator/isMagnetURI.js";
import isMimeType from "./validator/isMimeType.js";
import isLatLong from "./validator/isLatLong.js";

let validator = {};
let rules = {
    email: {
        handler: function (value) {
            return isEmail(value);
        },
        errorMessage: "Invalid email"
    },
    number: {
        handler: function (value) {
            return !isEmpty(value) && isNumeric(value);
        },
        errorMessage: "Invalid number"
    },
    notEmpty: {
        handler: function (value) {
            if (value == null) return false;
            return !isEmpty(value);
        },
        errorMessage: "This field can not be empty"
    },
    noWhiteSpace: {
        handler: function (value) {},
        errorMessage: "No whitespace allowed"
    },
    noSpecialChar: {
        handler: function (value) {},
        errorMessage: "No special character allowed"
    }
};

validator.addRule = function (key, handler, message) {
    rules[key] = {
        handler: handler,
        errorMessage: message
    };
};

validator.removeRule = function (key) {
    delete rules[key];
};

validator.getRule = function (key) {
    return rules[key];
};

export { validator };