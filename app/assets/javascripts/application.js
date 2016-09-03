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
//= require jqueryui-touch-punch
//= require lodash/lodash
//
// bootstrap
//= require bootstrap-sass-official
//= require bootstrap-datepicker
//= require clockpicker
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

  var minSlideDelay = 10;
  var endSlideDelay = 35;
  var startSlideDelay = 40;
  var timeAtMinDelay = 2000;
  var slideDelaySpeedUpDecay = .03;
  var slideDelaySlowDownDecay = .005;
  var delayBeforeSliding = 0;
  // make sliders fancy using jqueryui's slider() method:
  var setSliderVal = function(element, newVal) {
    // this is fascinating math! you expect the middle to
    // be 5. but from 1.0-10.0, middle is really 5.5!
    // so must take FLOOR of numbers up through 5, but
    // that makes 5/9 of space taken up, only 4/9 left for
    // 6 through 10 -- 5 numbers. So must make each value
    // above 5 bigger.
    var roundedVal = newVal;
    if (newVal >= 6.0) {
      roundedVal -= 6.0;
      roundedVal *= 6.0/5.0; // better than 5/4 because
                             // this way 10 is smaller
      roundedVal += 6.0;
    }
    roundedVal = Math.floor(roundedVal);
//     var roundedVal = Math.round(newVal * 19.0 / 18.0 - .1);
    if (roundedVal < 1) { roundedVal = 1 }
    var sliderId = $(element).attr('id');
    $(element).slider("value", newVal);
    $( "#" + sliderId + "_amount_hidden" ).val(roundedVal);
    $( "#" + sliderId + "_amount_shown" ).html(roundedVal);
  };
  // $(selector).attr('data-name','value')
  var slide = function(element, delay) {
    console.log("in slide...");
    console.log("is dragging not true?");
    console.log($(element).attr("data-mousedragging") !== "true");
    console.log("is animating?");
    console.log($(element).attr("data-slideanimating") === "true");
    console.log("is slideable?");
    console.log($(element).attr("data-mousedragging") !== "true"
      && $(element).attr("data-slideanimating") === "true");

    if ($(element).attr("data-mousedragging") !== "true"
      && $(element).attr("data-slideanimating") === "true") {
      console.log("sliding!");
      var curVal = $(element).slider("value");
      var stepSize = .1;//$(element).slider("option", "step");
      var maxVal = $(element).slider("option", "max");
      var minVal = $(element).slider("option", "min");
      var curDir = $(element).attr("data-curdir");
      if (typeof curDir == 'undefined') {
        curDir = 1
      }
      curVal += curDir * stepSize
      if (curVal > maxVal) {
        curVal -= stepSize * 2;
        curDir = -1;
        $(element).attr("data-curdir", -1);
      }
      if (curVal < minVal) {
        curVal += stepSize * 2;
        curDir = 1;
        $(element).attr("data-curdir", 1);
      }
      setSliderVal(element, curVal);
      if ($(element).attr("data-speedphase") === "speedingUp") {
        delay = delay * (1 - slideDelaySpeedUpDecay);
        if (delay < minSlideDelay) {
          delay = minSlideDelay;
          setTimeout(function() {
            $(element).attr("data-speedphase", "slowingDown");
          }, timeAtMinDelay);
        }
      } else if ($(element).attr("data-speedphase") === "slowingDown") {
        delay = delay * (1 + slideDelaySlowDownDecay);
        if (delay > endSlideDelay) {
          delay = endSlideDelay;
          $(element).attr("data-speedphase", "endingSpeed");
        }
      } else { // speed not changing
      }
      setTimeout(function() {
        slide(element, delay);
      }, delay);
    }
  };
  var startSlidingIfAppropriate = function(element) {
    console.log("is appropriate?");
    if ($(element).attr("data-mousedragging") !== "true"
      && $(element).attr("data-slideanimating") !== "true") {
      console.log("yes appropriate.");
      setTimeout(function() {
        startSliding(element);
      }, delayBeforeSliding);
    } else {
      console.log("not appropriate.");
    }
  };
  var startSliding = function(element) {
    if ($(element).attr("data-mousedragging") !== "true"
      && $(element).attr("data-slideanimating") !== "true") {
      $(element).attr("data-speedphase", "speedingUp");
      $(element).attr("data-slideanimating", "true");
      console.log("calling slide...");
      slide(element, startSlideDelay);
    }
  };
  var stopSliding = function(element) {
    $(element).attr("data-slideAnimating", "false");
  };

  // individual sliders
  $( ".imp_slider" ).slider({
    value:3, min: 1, max: 10, step: .1,
    create: function( event, ui ) { // set initial value
      setSliderVal(this, 3);
    },
    slide: function( event, ui ) { // called on mouse move
      $(this).attr("data-mousedragging", "true")
      setSliderVal(this, ui.value);
    },
    stop: function( event, ui ) { // called on stopping mouse move
      $(this).attr("data-mousedragging", "false")
    }
  }).focusin(function() { startSlidingIfAppropriate(this); })
  .focusout(function() { stopSliding(this); })
  .mousedown(function() { stopSliding(this); });

  // ***********************
  //        TAGS
  // ***********************

  // apply select2 to any tag_select form elements
  $("select.tag_select").select2({
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
  //     DATE PICKER
  // ***********************

  $('input#due_date_input').datepicker({
    todayHighlight: true,
    startView: 0,
    maxViewMode: 2,
    daysOfWeekHighlighted: "0,6",
    autoclose: true
  });

  // ***********************
  //     COUNTDOWN
  // ***********************

// $('#countdown').countdown({
//   until: '+70',
//   compact: true,
//   format: "MS",
//   onTick: highlightLast5
// }).on('click', function() {

// });
// function highlightLast5(periods) {
//   if ($.countdown.periodsToSeconds(periods) === 59) {
//     $(this).addClass('highlight');
//   }
// }
// var minuteDeltas = [
//   // above 0 minutes, add 5 minutes
//   [0, 5],
//   [5, 5],
//   [10, 5],
//   [15, 10],
//   [30, 15],
//   [45, 30],
//   [90, 60]
// ]
// $('#moreTimeButton').click(function() {
//   var secsLeft = $.countdown.periodsToSeconds(periods);
//   var now = new Date();
//   var timeUntil = new Date();
//   var deltaPair = [];
//   var minutesToAdd = 0;
//   for (var i = 0; i < minuteDeltas.length; i++) {
//     deltaPair = minuteDeltas[i];
//     if (secsLeft/60.0 > deltaPair[0]) {
//       minutesToAdd = minuteDeltas[1];
//     }
//   }
//   var secondsToAdd = minutesToAdd * 60;
//   timeUntil.setSeconds(now.getSeconds() + secsLeft + secondsToAdd);
//   $('#countdown').countdown('option', {until: timeUntil});
// });
// $('#playButton').click(function() {
//   $('#countdown').countdown('resume');
// });

// $('#pauseButton').click(function() {
//   $('#countdown').countdown('pause');
// });

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
  Mousetrap.bind('s', function() {
    $("a#split_link")[0].click();
  });
  Mousetrap.bind('e', function() {
    $("a#edit_link")[0].click();
  });
  Mousetrap.bind('p', function() {
    $("a#postpone_link")[0].click();
  });
  Mousetrap.bind('f', function() {
    $("a#finished_link")[0].click();
  });
  Mousetrap.bind('w', function() {
    $("a#worked_link")[0].click();
  });
  Mousetrap.bind('d', function() {
    $("a#destroy_link")[0].click();
  });
  Mousetrap.bind('n', function() {
    $("a#new_link")[0].click();
  });


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
      $('#form_' + attribute).slideToggle(400, function() {
        // focus if we opened it
        if ($(this).is(':visible')) {
          var childInput = $(this).find("input");
          if (childInput) childInput.focus();
          else {
            $(this).focus();
          }
        }
      });
      $('#form_' + attribute + '_toggle_on').toggle();
      $('#form_' + attribute + '_toggle_off').toggle();
    });
  }
  createFormSectionToggle('notes');
  createFormSectionToggle('due');
  createFormSectionToggle('children');

  // ***********************
  //       FOCUS
  // ***********************

  // focus on first place for input
  $('.initial-focus').first().focus();

  // ***********************
  //    BRAND ANIMATION
  // ***********************

  var numBrandChars = "Prioritizer".length;
  var maxBrandSize = 1.5;
  var minBrandSize = 0.5;
  var minDiff = 0.4;
  var maxDiff = 0.8;
  var reziseSpeed = 100;
  var resizeSpeedDelta = 50;
  var maxResizeSpeed = 10000;
  var waitBetweenResizings = 10;
  var waitBetweenResizingsDelta = 20;
  var numResizers = 1;
  var firstCharBonus = 0.25;
  var numResizings = 0;
  var maxNumResizings = 30;
  var sizes = Array(numBrandChars);
  for (var i = 0; i < numBrandChars; i++) {
    sizes[i] = 1.0;
  }
  var resizeBrandChar = function() {
    var charNum = Math.floor(Math.random() * numBrandChars);
    var targetSize = 1.0;
    do {
      targetSize = Math.random();
      targetSize = targetSize * 1.2 * (maxBrandSize - minBrandSize) + minBrandSize - 0.1;
      // at this point, 25th percentile val is .36, 50th percentile is .8, 75th percentile val is 3.2
      if (targetSize > maxBrandSize) { targetSize = maxBrandSize; }
      if (targetSize < minBrandSize) { targetSize = minBrandSize; }
    } while (
      (Math.abs(targetSize - sizes[charNum]) < minDiff)
      ||
      (Math.abs(targetSize - sizes[charNum]) > maxDiff)
      );
    sizes[charNum] = targetSize;
    if (charNum == 0) { targetSize += firstCharBonus; }
//    alert("setting " + charNum + " to targetSize: " + targetSize)
    var selector = "#brand_" + charNum;
    $(selector).css( { transition: "transform " + (reziseSpeed / 1000.0) + "s ease-out",
      transform:  "scale(" + (0.5 + targetSize / 2.0) + ", " + targetSize + ")" } );
//alert("resizing");
//    $(selector).animate({
//      height: targetSize + 'rem'
//    }, reziseSpeed, function() {
      numResizings++;
      waitBetweenResizings += waitBetweenResizingsDelta;
      reziseSpeed += resizeSpeedDelta;
      if (reziseSpeed > maxResizeSpeed) { reziseSpeed = maxResizeSpeed; }
      if (numResizings < maxNumResizings) {
        setTimeout(function() {
          resizeBrandChar();
        }, waitBetweenResizings);
      }
  //  });
  };
  for (var i = 0; i < numResizers; i++) {
    setTimeout(function() {
      resizeBrandChar();
    }, (reziseSpeed + 0.01) * i / (numResizers + 0.01));
  }
};

$(document).ready(ready);

// have it rerun when turbolinks fires
//$(document).on('turbolinks:load', ready);
