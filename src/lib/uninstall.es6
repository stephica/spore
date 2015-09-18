var fs              = require('fs-extra');
var deasync         = require('deasync');
var async           = require('async');
var colors          = require('colors');
var path            = require('path');
var _               = require('underscore');

var uninstall = function( config ) {
  
  // check if package is installed
  config.pkg.assertDependency( config.package_name );
  
  config.pkg.removeDep( config.package_name );
  
  config.pkg.saveJson();
  
  if( config.cli )
    console.log(`Package "${config.package_name}" successful removed."`.green);

}
module.exports = uninstall;
