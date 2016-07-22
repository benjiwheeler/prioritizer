// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require turbolinks
//
// Bower:
// these are resolved thanks to bower-rails:
//
// javascript
//= require jquery/dist/jquery
//= require jquery-ui/jquery-ui
//= require jquery-ujs/src/rails
//= require lodash/lodash
//
// bootstrap
//= require bootstrap-sass-official
//
// third party
//= require seiyria-bootstrap-slider
//
// angular
//= require angular/angular
//= require angular-resource/angular-resource
//= require angular-sanitize/angular-sanitize
//= require angular-ui-router/release/angular-ui-router
//= require angular-ui-utils/ui-utils
//= require angular-rails-templates
//
// rails app files:
//= require_tree ../../../lib/assets/javascripts
//= require_tree ../../../vendor/assets/javascripts
//= require_tree .

// Instantiate a slider
$(function() {
  var mySlider = $("input.slider").bootstrapSlider();
  $("#days_imp").on("slide", function(slideEvt) {
    $("#daysImpSliderVal").text(slideEvt.value);
  });
});
