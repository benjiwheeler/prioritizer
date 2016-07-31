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
//= require select2
// disabled
// DON'T require turbolinks
//= require mousetrap
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

var ready = function() {

  // ***********************
  //        SLIDER
  // ***********************

  var minSlideDelay = 7;
  var maxSlideDelay = 50;
  var slideDelayDecay = .01;
  // make sliders fancy using jqueryui's slider() method:
  var setSliderVal = function(element, newVal) {
    var roundedVal = Math.round(newVal * 19.0 / 18.0);
    var sliderId = $(element).attr('id');
    $(element).slider("value", newVal);
    $( "#" + sliderId + "_amount_hidden" ).val(roundedVal);
    $( "#" + sliderId + "_amount_shown" ).html(roundedVal);
  };
  var slide = function(element, delay) {
    if ($(element).data("sliding") == true) {
      var curVal = $(element).slider("value");
      var stepSize = .1;//$(element).slider("option", "step");
      var maxVal = $(element).slider("option", "max");
      var minVal = $(element).slider("option", "min");
      var curDir = $(element).data("curDir");
      if (typeof curDir == 'undefined') {
        curDir = 1
      }
      curVal += curDir * stepSize
      if (curVal > maxVal) {
        curVal -= stepSize * 2;
        curDir = -1;
        $(element).data("curDir", -1);
      }
      if (curVal < minVal) {
        curVal += stepSize * 2;
        curDir = 1;
        $(element).data("curDir", 1);
      }
      setSliderVal(element, curVal);
      delay = delay * (1 + slideDelayDecay);
      if (delay > maxSlideDelay) { delay = maxSlideDelay; }
      setTimeout(function() {
        slide(element, delay);
      }, delay);
    }
  };
  var startSliding = function(element) {
    $(element).data("sliding", true);
    slide(element, minSlideDelay);
  };
  var stopSliding = function(element) {
    $(element).data("sliding", false);
  };

  // individual sliders
  $( "#days_imp_slider" ).slider({
    value:3, min: 1, max: 10, step: .1,
    create: function( event, ui ) { // set initial value
      setSliderVal(this, 3);
    },
    slide: function( event, ui ) { // called on mouse move
      setSliderVal(this, ui.value);
    }
  }).focusin(function() { startSliding(this); })
  .focusout(function() { stopSliding(this); });

  $( "#weeks_imp_slider" ).slider({
    value:3, min: 1, max: 10, step: .1,
    create: function( event, ui ) { // set initial value
      setSliderVal(this, 3);
    },
    slide: function( event, ui ) { // called on mouse move
      setSliderVal(this, ui.value);
    }
  }).focusin(function() { startSliding(this); })
  .focusout(function() { stopSliding(this); });

  $( "#ever_imp_slider" ).slider({
    value:3, min: 1, max: 10, step: .1,
    create: function( event, ui ) { // set initial value
      setSliderVal(this, 3);
    },
    slide: function( event, ui ) { // called on mouse move
      setSliderVal(this, ui.value);
    }
  }).focusin(function() { startSliding(this); })
  .focusout(function() { stopSliding(this); });

  // ***********************
  //        TAGS
  // ***********************

  // apply select2 to any tag_select form elements
  var tagSelect = $("select.tag_select").select2({
    tags: true, // able to create new tags by typing them
    placeholder: "Tags",
    tokenSeparators: [',', ' '] // respond to these keystrokes
  });

  // attempt to fix tag reordering issue; seehttps://github.com/angular-ui/angular-ui-OLDREPO/issues/406
  // note that this does NOT work with tokenSeparator keystrokes... only return/mouseclicks
  // maybe this doesn't do anything at all?
  $("select.tag_select").on("select2:select", function (event) {
    var element = event.params.data.element;
    var $element = $(element);
    $element.detach();
    $(this).append($element);
    $(this).trigger("change");
  });


  // ***********************
  //     CHILD TASKS
  // ***********************

  var generateNewChildFieldsHtml = function() {
    var holder = $("#rails_data_holder");
    var templateObjIdStr = holder.data('new-child-object-id');
    var newChildFieldsHtmlTemplate = holder.data('new-child-fields-html');
    // for sorting
    var time = new Date().getTime();
    var regexp = new RegExp(templateObjIdStr, 'g');
    return newChildFieldsHtmlTemplate.replace(regexp, time)
  };

  $("form").on('click', '.add_child', function(event) {
    $("ul#task_children_list").append(generateNewChildFieldsHtml());
    event.preventDefault();
  });

  $("ul#task_children_list").sortable({
    axis: 'y',
    // have just a part be the handle
//    handle: '.handle',
    update: function() {
      $.post($(this).data('update-url'), $(this).sortable('serialize'))
    }
  });
  $( "#task_children_list" ).disableSelection();

  $("form").on('keypress', 'input.subtask_name', function(event) {
    if (event.keyCode == 13) {
      var myLiElement = $(this).closest("li");
      myLiElement.after(generateNewChildFieldsHtml());
      var nextLiElement = myLiElement.next();
      nextLiElement.find("input.subtask_name").focus();
      return false;
    }
  });

  // ***********************
  //        SHORTCUTS
  // ***********************

  // mousetrap shortcuts
  var goToSplit = function() {
    var split_url = $("a#split_link").attr('href');
    window.location.href = split_url;
  };
  Mousetrap.bind('-', goToSplit);


  // ***********************
  //      VISIBLE TOGGLES
  // ***********************

  // toggle subtask list visibility
  $('#task_children_list_toggle').click(function() {
    $('ul#task_children_list').slideToggle();
    $('#task_children_list_toggle_on').toggle();
    $('#task_children_list_toggle_off').toggle();
  });

  var createFormSectionToggle = function(attribute) {
    $('#form_' + attribute + '_toggle_section').click(function() {
      $('#form_' + attribute).slideToggle();
      $('#form_' + attribute + '_toggle_on').toggle();
      $('#form_' + attribute + '_toggle_off').toggle();
    });
  }
  createFormSectionToggle('notes');
  createFormSectionToggle('due');

  // ***********************
  //       FOCUS
  // ***********************

  // focus on first place for input
  $('.initial-focus').first().focus();

};

$(document).ready(ready);

// have it rerun when turbolinks fires
//$(document).on('turbolinks:load', ready);
