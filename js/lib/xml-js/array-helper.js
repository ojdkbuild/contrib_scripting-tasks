define(function(localRequire, exports, module) { var requireOrig = require; require = localRequire;
module.exports = {

  isArray: function(value) {
    if (Array.isArray) {
      return Array.isArray(value);
    }
    // fallback for older browsers like  IE 8
    return Object.prototype.toString.call( value ) === '[object Array]';
  }

};

require = requireOrig;});
