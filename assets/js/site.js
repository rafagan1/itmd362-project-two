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
    if (isNaN(typeof(month))) {
      return false;
    }
    month = Number(month);

    if (month >= 1 && month <= 12) {
      return true;
    }
    return false;
  }

  function validate_expr_year(year) {
    // Valid year is a 4-digit number after [current year]
    if (isNaN(typeof(year))) {
      return false;
    }
    year = Number(year);
    if (year >= 2019 && year <= 9999) {
      return true;
    }
    return false;
  }

  function validate_cvv(cvv) {
    // Valid security code is a 3 or 4 digit string with all whitespace removed
    return validate(remove_all_whitespace(cvv), /^[0-9]{3}[0-9]?$/g);
  }

  function validate_zipcode(zipcode) {
    // Valid zip code is either 5 digits or 5 digits + '-' + 4 digits with all whitespace removed
    return validate(remove_all_whitespace(zipcode), /^[0-9]{5}(-[0-9]{4})?$/g);
  }

  function validate_email(email) {
    // Valid email is a non-empty string that includes an '@' with all whitespace removed
    return validate(remove_all_whitespace(email), /^.+@.+$/g);
  }

  // Event Listeners
  // TODO: Enable/disable submit button if all fields are valid
  document.addEventListener('DOMContentLoaded', function() {
    var payment_form = document.querySelector('#payment');
    var submit_payment = document.querySelector('#pay');
    var pay_name = document.querySelector('#name').value;
    var pay_ccn = document.querySelector('#ccn').value;
    var pay_expr_mo = document.querySelector('#exp-month').value;
    var pay_expr_yr = document.querySelector('#exp-year').value;
    var pay_cvv = document.querySelector('#cvv').value;
    var pay_zipcode = document.querySelector('#zipcode').value;
    var pay_email = document.querySelector('#email').value;

    console.log('DOM loaded');

    // Disable submit button
    submit_payment.setAttribute('disabled', 'disabled');
    console.log('Submit button disabled');

    // Set up listener for any changes in the form using keyup
    payment_form.addEventListener('keyup', function() {
      console.log('keyup');
      // Get updated input values
      pay_name = document.querySelector('#name').value;
      pay_ccn = document.querySelector('#ccn').value;
      pay_expr_mo = document.querySelector('#exp-month').value;
      pay_expr_yr = document.querySelector('#exp-year').value;
      pay_cvv = document.querySelector('#cvv').value;
      pay_zipcode = document.querySelector('#zipcode').value;
      pay_email = document.querySelector('#email').value;

      // If everything is valid, enable the submit button
      if (validate_name(pay_name) && validate_ccn(pay_ccn) && validate_expr_month(pay_expr_mo) && validate_expr_year(pay_expr_yr) && validate_cvv(pay_cvv) && validate_zipcode(pay_zipcode) && validate_email(pay_email)) {
        // Enable submit if all valid
        if (submit_payment.hasAttribute('disabled')) {
          submit_payment.removeAttribute('disabled');
          console.log('Submit button enabled');
        }
      } else {
        // Else, disable the submit button
        if (!submit_payment.hasAttribute('disabled')) {
          submit_payment.setAttribute('disabled', 'disabled');
          console.log('Submit button disabled');
        }
        // TODO: Add error messages depending on invalid inputs

        // Invalid name
        if (!validate_name(pay_name)) {
          console.log('Invalid name');
          // TODO: Add some form of warning for an invalid name
        }

        // Invalid CCN
        if (!validate_ccn(pay_ccn)) {
          console.log('Invalid CCN');
        }

        // Invalid expr month
        if (!validate_expr_month(pay_expr_mo)) {
          console.log('Invalid Expiration Month');
        }

        // Invalid expr year
        if (!validate_expr_year(pay_expr_yr)) {
          console.log('Invalid Expiration Year');
        }

        // Invalid zip code
        if (!validate_zipcode(pay_zipcode)) {
          console.log('Invalid ZIP Code');
        }

        // Invalid email
        if (!validate_email(pay_email)) {
          console.log('Invalid Email');
        }
      }
    });
  });

  // ETC

  //  TODO: Update expiration month/year based on current date
  //   ie: if current mo/yr is june 2020, have the mo initialize to 06 and year to 2020, with min 2020 and max 2040 (+20)
  //  TODO: Warnings/errors for missing inputs
  //   ie: check if any fields are empty or contain errors, live feedback for invalid input

  // Checks if the selected movie genre from the sort-by form matches
  // the genre of a particular movie
  function check_genre(selection, genres) {
    if (selection !== "") {
      return (genres.includes(selection));
    }
    else {
      // Selection is "All Genres", every movie is a match
      return true;
    }
  }

  // Checks if the selected movie rating from the sort-by form matches
  // the rating of a particular movie
  function check_rating(selection, rating) {
    if (selection !== "") {
      return (selection === rating);
    }
    else {
      // Selection is "All Ratings", every movie is a match
      return true;
    }
  }

  // Outputs a message if no movies were found for a set of filters
  function check_movie_list(count, sort_result) {
    if (count === 0) {
      sort_result.innerText = "Sorry, no movies were found with those filters.";
    }
    else {
      sort_result.innerText = "";
    }
  }

  // Run JS once DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Represents the movie selection list on homepage
    var movie_list = document.querySelector('#movie-list');

    // Node list of all the available movies
    var movie_nodes = document.querySelector('#movie-list').querySelectorAll(".movie-entry");

    // Save attributes of each movie for sorting
    var movie_attributes = [];

    // Create element for displaying a message if no movies were
    // found under a set of filter criteria
    var sort_result = document.createElement('p');

    var i, movie_info, selection;
    // Change 'nojs' class for each html document to 'js'
    document.querySelector('html').className = 'js';

    // If broswer supports template, add Sort-By functionality
    // on movie selection homepage
    if('content' in document.createElement('template')) {
      sort_result.setAttribute('id', 'result-message');
      document.querySelector('#select-movie-h2').appendChild(sort_result);

      // Add section for sorting movies after the #select-movie section
      document.querySelector('#main-select-movie').appendChild(document.querySelector('#sort-by-template').content);

      // Populate movie_attributes list
      for (i = 0; i < movie_nodes.length; i++) {
        movie_info = movie_nodes[i].lastElementChild;
        movie_attributes.push({
          title: movie_nodes[i].id,
          rating: movie_info.childNodes[1].innerText,
          genre: movie_info.childNodes[3].innerText.toLowerCase().split(', '),
          runtime: movie_info.childNodes[5].innerText
        });
      }

      // Listen for selection on #genre-select to sort by movie genre
      document.querySelector('#genre-select').addEventListener('change', function(e) {
        var i;
        selection = e.target.value;
        for (i = 0; i < movie_attributes.length; i++) {
          if (check_genre(selection, movie_attributes[i].genre) && check_rating(document.querySelector('#rating-select').value, movie_attributes[i].rating)) {
            movie_list.appendChild(movie_nodes[i]);
          }
          else {
            if (movie_list.contains(movie_nodes[i])) {
              movie_list.removeChild(movie_nodes[i]);
            }
          }
        }
        check_movie_list(movie_list.childElementCount, sort_result);
      });

      // Listen for selection on #rating-select to sort by movie rating
      document.querySelector('#rating-select').addEventListener('change', function(e) {
        var selection = e.target.value;
        var i;
        for (i = 0; i < movie_attributes.length; i++) {
          if (check_genre(document.querySelector('#genre-select').value, movie_attributes[i].genre) && check_rating(selection, movie_attributes[i].rating)) {
            movie_list.appendChild(movie_nodes[i]);
          }
          else {
            if (movie_list.contains(movie_nodes[i])) {
              movie_list.removeChild(movie_nodes[i]);
            }
          }
        }
        check_movie_list(movie_list.childElementCount, sort_result);
      });
    }

  });

})();
