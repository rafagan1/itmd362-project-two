"use strict";

(function () {
  // Browser check
  if (!('querySelector' in document && 'addEventListener' in document)) {
    console.log('querySelector or addEventListener not available');
    return;
  }

  // Function to be called later for determining localStorage support
  // Taken from discussion at https://gist.github.com/paulirish/5558557
  function storageAvailable(type) {
    var storage, x;
    try {
      storage = window[type];
      x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      // console.log("Type = ", type);
      return true;
    }
    catch(e) {
      return false;
    }
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
    month = Number(month);

    if (month >= 1 && month <= 12) {
      return true;
    }
    return false;
  }

  function validate_expr_year(year) {
    // Valid year is a 4-digit number after [current year]
    year = Number(year)

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

    // Initialize warning/error labels
    var allFormLabels = document.getElementsByTagName('label');
    var i;
    for (i = 0; i < allFormLabels.length; i++) {
      console.log(allFormLabels[i].id);
      document.querySelector('#'+allFormLabels[i].id).insertAdjacentHTML('afterend', '<b class="error"></b>');
    }

    if (document.getElementById('main-pay-info') === null) {
      return;
    }

    console.log('DOM loaded');

    // Enable/Disable submit button
    if (validate_name(pay_name) && validate_ccn(pay_ccn) && validate_expr_month(pay_expr_mo) && validate_expr_year(pay_expr_yr) && validate_cvv(pay_cvv) && validate_zipcode(pay_zipcode) && validate_email(pay_email)) {
      // Enable submit if all valid
      if (submit_payment.hasAttribute('disabled')) {
        submit_payment.removeAttribute('disabled');
        console.log('Submit button enabled');
      }
    }
    else {
      if (!submit_payment.hasAttribute('disabled')) {
        submit_payment.setAttribute('disabled', 'disabled');
        console.log('Submit button disabled');
      }
    }

    // Set up listener for any changes in the form using keyup
    payment_form.addEventListener('keyup', function() {
      // Initialize variables for use later
      var error_tags;

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

        error_tags = document.getElementsByClassName('error');
        for (i = error_tags.length-1; i >= 0; i--) {
          error_tags[i].remove();
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
          console.log('Invalid Name');
          if (document.querySelector('#name-label + .error') === null) {
            document.querySelector('#name-label').insertAdjacentHTML('afterend', '<b class="error"></b>');
          }
        } else {
          if (document.querySelector('#name-label + .error') !== null) {
            document.querySelector('#name-label + .error').remove();
          }
        }

        // Invalid CCN
        if (!validate_ccn(pay_ccn)) {
          console.log('Invalid CCN');
          if (document.querySelector('#ccn-label + .error') === null) {
            document.querySelector('#ccn-label').insertAdjacentHTML('afterend', '<b class="error"></b>');
          }
        } else {
          if (document.querySelector('#ccn-label + .error') !== null) {
            document.querySelector('#ccn-label + .error').remove();
          }
        }

        // Invalid expr year
        if (!validate_expr_year(pay_expr_yr)) {
          if (document.querySelector('#exp-year-label + .error') === null) {
            document.querySelector('#exp-year-label').insertAdjacentHTML('afterend', '<b class="error"></b>');
          }
        } else {
          if (document.querySelector('#exp-year-label + .error') !== null) {
            document.querySelector('#exp-year-label + .error').remove();
          }
        }

        // Invalid CVV
        if (!validate_cvv(pay_cvv)) {
          if (document.querySelector('#cvv-label + .error') === null) {
            document.querySelector('#cvv-label').insertAdjacentHTML('afterend', '<b class="error"></b>');
          }
        } else {
          if (document.querySelector('#cvv-label + .error') !== null) {
            document.querySelector('#cvv-label + .error').remove();
          }
        }

        // Invalid zip code
        if (!validate_zipcode(pay_zipcode)) {
          if (document.querySelector('#zipcode-label + .error') === null) {
            document.querySelector('#zipcode-label').insertAdjacentHTML('afterend', '<b class="error"></b>');
          }
        } else {
          if (document.querySelector('#zipcode-label + .error') !== null) {
            document.querySelector('#zipcode-label + .error').remove();
          }
        }

        // Invalid email
        if (!validate_email(pay_email)) {
          if (document.querySelector('#email-label + .error') === null) {
            document.querySelector('#email-label').insertAdjacentHTML('afterend', '<b class="error"></b>');
          }
        } else {
          if (document.querySelector('#email-label + .error') !== null) {
            document.querySelector('#email-label + .error').remove();
          }
        }
      }
    });
  });

  // ETC

  //  TODO: Update expiration month/year based on current date
  //   ie: if current mo/yr is june 2020, have the mo initialize to 06 and year to 2020, with min 2020 and max 2040 (+20)
  //  TODO: Warnings/errors for missing inputs
  //   ie: check if any fields are empty or contain errors, live feedback for invalid input

  // Given a list of movies and id for inner list of its attributes,
  // Returns a list of of movie objects (title, genre, rating, etc.)
  // Outer loop traverses each movie
  // Inner loop saves attributes of each movie
  function get_movie_list(movie_nodes, attribute_list) {
    var movie_attributes = [], node, movie, movie_entry;
    for (node of movie_nodes) {
      movie_entry = {
        title: node.id
      };
      for (movie of node.querySelector(attribute_list).children) {
        movie_entry[movie.className] = movie.innerText;
      }
      movie_attributes.push(movie_entry);
    }
    return movie_attributes;
  }

  // Checks if the selected movie genre from the sort-by form matches
  // the genre of a particular movie
  function check_genre(selection, genres) {
    genres = genres.toLowerCase().split(', ');
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
    var movie_list, movie_nodes, movie_attributes, sort_result;
    if (document.getElementById('main-select-movie') === null) {
      return;
    }

    // Represents the movie selection list on homepage
    movie_list = document.querySelector('#movie-list');

    // Node list of all the available movies
    movie_nodes = document.querySelector('#movie-list').querySelectorAll(".movie-entry");

    // Save attributes of each movie for sorting
    movie_attributes = get_movie_list(movie_nodes, ".movie-info");

    // Create element for displaying a message if no movies were
    // found under a set of filter criteria
    sort_result = document.createElement('p');

    // Change 'nojs' class for each html document to 'js'
    document.querySelector('html').className = 'js';


    if (storageAvailable('localStorage')) {
      // Save title of clicked element in Local Storafe before proceeding to
      // movie times page
      document.querySelector('#movie-list').addEventListener('click', function(e) {
        var elem = e.target;
        e.preventDefault();
        if (elem.className === 'movie-title' || elem.className === 'poster') {
          while (elem.className !== 'movie-title') {
            elem = elem.nextElementSibling;
          }
          localStorage.removeItem('movie-title');
          localStorage.setItem('movie-title', elem.innerText);
          document.location.assign('time/');
        }
      });
    }

    // If browser supports template, add Sort-By functionality
    // on movie selection homepage
    if('content' in document.createElement('template')) {
      sort_result.setAttribute('id', 'result-message');
      document.querySelector('#select-movie-h2').appendChild(sort_result);

      // Add section for sorting movies after the #select-movie section
      document.querySelector('#main-select-movie').appendChild(document.querySelector('#sort-by-template').content);


      // Listen for selection on #genre-select to sort by movie genre
      document.querySelector('#genre-select').addEventListener('change', function(e) {
        var i;
        var selection = e.target.value;
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
        var i;
        var selection = e.target.value;
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

      // Listen for click on 'Reset Filter' button to show all movies on screen
      document.querySelector('#reset-sort').addEventListener('click', function(e) {
        var movie;
        e.preventDefault();
        for (movie of movie_nodes) {
          if (!movie_list.contains(movie)) {
            movie_list.appendChild(movie);
          }
        }
        check_movie_list(movie_list.childElementCount, sort_result);
        document.querySelector('#genre-select').value = "";
        document.querySelector('#rating-select').value = "";
      });
    }

  });

})();
