"use strict";

(function () {
  // Browser check
  if (!('querySelector' in document && 'addEventListener' in document)) {
    console.log('querySelector or addEventListener not available');
    return;
  }

  // Value cleaning functions

  function remove_excess_whitespace(value) {
    // Remove excess whitespace
    value = value.replace(/^ +/g, '');  // Remove whitespace from beginning
    value = value.replace(/ +$/g, '');  // Remove whitespace from end
    value = value.replace(/ +/g, ' ');  // Remove extra whitespace in the middle
    return value;
  }

  function remove_all_whitespace(value) {
    // Removes any form of whitespace
    return value.replace(/ +/g, '');
  }

  // Validation functions
  function validate(value, regex) {
    // General validation checker
    if (typeof(regex.test) === 'function') {  // Check if valid regex
      // If true, use regex to test the value
      return regex.test(value);
    } else {
      return false;
    }
  }

  function validate_name(name) {
    // Valid name is a non-empty string after removing excess whitespace
    return validate(remove_excess_whitespace(name), /.+/g);
  }

  function validate_ccn(ccn) {
    // Valid CCN is a 16-digit string with no whitespace
    return validate(remove_all_whitespace(ccn), /^[0-9]{16}$/g);
  }

  function validate_expr_month(month) {
    // Valid mo is a 2-digit number between 1-12
    if (month >= 1 && month <= 12) {
      return true;
    }
    return false;
  }

  function validate_expr_year(year) {
    // Valid year is a 4-digit number after [current year]
    if (year >= 2019 && year <= 9999) {
      return true;
    }
    return false;
  }

  function validate_ccv(ccv) {
    // Valid security code is a 3 or 4 digit string with all whitespace removed
    return validate(remove_all_whitespace(ccv), /^[0-9]{3}[0-9]?$/g)
  }

  function validate_zipcode(zipcode) {
    // Valid zip code is either 5 digits or 5 digits + '-' + 4 digits with all whitespace removed
    return validate(remove_all_whitespace(zipcode), /^[0-9]{5}(-[0-9]{4})?$/g)
  }

  function validate_email(email) {
    // Valid email is a non-empty string that includes an '@' with all whitespace removed
    return validate(remove_all_whitespace(email), /^.+@.+$/g)
  }

  // Event Listeners
  // TODO: Enable/disable submit button if all fields are valid
  // ETC

  //  TODO: Update expiration month/year based on current date
  //   ie: if current mo/yr is june 2020, have the mo initialize to 06 and year to 2020, with min 2020 and max 2040 (+20)
  //  TODO: Warnings/errors for missing inputs
  //   ie: check if any fields are empty or contain errors, live feedback for invalid input

  // Run JS once DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Represents the movie selection list on homepage
    var movie_list = document.querySelector('#movie-list');
    
    // Change 'nojs' class for each html document to 'js'
    document.querySelector('html').className = 'js';

    // If broswer supports template, add Sort-By functionality
    // on movie selection homepage
    if('content' in document.createElement('template')) {
      // Node list of all the available movies
      var movie_nodes = document.querySelector('#movie-list').querySelectorAll(".movie-entry");

      // Save attributes of each movie for sorting
      var movie_attributes = [];

      // Create element for displaying a message if no movies were
      // found under a set of filter criteria
      var sort_result = document.createElement('p');
      sort_result.setAttribute('id', 'result-message');
      document.querySelector('#select-movie-h2').appendChild(sort_result);

      // Add section for sorting movies after the #select-movie section
      document.querySelector('#main-select-movie').appendChild(document.querySelector('#sort-by-template').content);

      // Populate movie_attributes list
      for (var i = 0; i < movie_nodes.length; i++) {
        var movie_info = movie_nodes[i].lastElementChild;
        movie_attributes.push({
          title: movie_nodes[i].id,
          rating: movie_info.childNodes[1].innerText,
          genre: movie_info.childNodes[3].innerText.toLowerCase().split(', '),
          runtime: movie_info.childNodes[5].innerText
        });
      }
    }

  });

})();
