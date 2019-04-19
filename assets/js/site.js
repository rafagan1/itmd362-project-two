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
    try {
      var storage = window[type],
      x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      console.log("Type = ", type);
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

  // ========TIME AND TICKETS FUNCTIONS !!!!!
  // Save selected movie time and date in local storage
  function storeDateAndTime(e) {
    // Remove previous stored time and date
    //    e.preventDefault();
    localStorage.removeItem('time_movieTime');
    localStorage.removeItem('time_movieDate');

    // Get the selected time and date
    var dateSel = dateSelected.options[dateSelected.selectedIndex].text;
    var timeSel = timeSelected.options[timeSelected.selectedIndex].text;

    // Store the selected date and time
    localStorage.setItem('time_movieDate', dateSel);
    localStorage.setItem('time_movieTime', timeSel);
  }

  // Save selected movie time and date in local storage
  function storeTicketType() {
    // Remove previous stored time and date
    localStorage.removeItem('tickets_adultTickets');
    localStorage.removeItem('tickets_childTickets');
    localStorage.removeItem('tickets_seniorTickets');

    if (adultTick.value > 0) {
      localStorage.setItem('tickets_adultTickets', adultTick.value);
    }
    if (childTick.value > 0) {
      localStorage.setItem('tickets_childTickets', childTick.value);
    }

    if (seniorTick.value > 0) {
      localStorage.setItem('tickets_seniorTickets', seniorTick.value);
    }
  }
  // ======END TIME AND TICKETS FUNCTIONS

  // Run JS once DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('main-select-movie') === null) {
      return;
    }

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

    // ==== TIME AND TICKETS FUNCTIONALITY
    // Variables for time and tickets pages

    // Selectors for Time page
    var dateSelected = document.querySelector('#pick-date');
    var timeSelected = document.querySelector('#pick-time');
    var submit_showTime = document.getElementById('show-time');

    // Variables on ticket page
    var adultTick = document.querySelector('#adult-tickets');
    var childTick = document.querySelector('#ch-tickets');
    var seniorTick = document.querySelector('#sr-tickets');
    var ticketType = document.querySelector('#ticket-type');

    if (storageAvailable('localStorage')) {
      // Check for the submit button on the time/date page
      if (submit_showTime !== null) {
        // Time page can only be submitted when the date
        // and time fields are selected
        submit_showTime.addEventListener('click', function(e){
          storeDateAndTime(e);
        });
      }
      // Check for the submit button/input on the ticket page
      if (ticketType !== null) {
        // Disable the submit button unti at least one ticket
        // type is selected.
        ticketType.setAttribute('disabled', 'disabled');

        // Allow the page to be submitted if at least one ticket type
        // is selected.
        adultTick.addEventListener('input', function(){
          // Could be deleting a value initially selected.
          // Disable the submit button and check the input value.
          ticketType.setAttribute('disabled', 'disabled');
          checkTicketType();
        });

        // Listen for input on child ticket type
        childTick.addEventListener('input', function(){
          ticketType.setAttribute('disabled', 'disabled');
          checkTicketType();
        });

        // Listen for input on senior ticket type
        seniorTick.addEventListener('input', function(){
          ticketType.setAttribute('disabled', 'disabled');
          checkTicketType();
        });

        // Function to allow the tickets page to be submitted
        function checkTicketType() {
          // Make sure at least one ticket type is selected before
          // allowing the submit button to be clicked
          if (adultTick.value > 0 ||
            childTick.value > 0 ||
            seniorTick.value > 0)
          {
            ticketType.removeAttribute('disabled');
            // console.log("On ticket page")
            ticketType.addEventListener('click', storeTicketType);
          }
        }
      } // ticketType== null
/*
      // FOR WBT - will be deleted!!!!!!!!!
      // Check if movie date selected should be displayed

        var time_movieTime;
        var time_movieDate;
        var tickets_adultTickets = 0;
        var tickets_childTickets = 0;
        var tickets_seniorTickets = 0;

        // Function to retrieve movie time, date, and tickets from local storage
        function getLocalStorageTimeNTickets() {
          var timeAndTickets = {
            time_movieTime: null,
            time_movieDate: null,
            tickets_adultTickets : 0,
            tickets_childTickets : 0,
            tickets_seniorTickets :0
          }

          // Get Time and Date
          timeAndTickets.time_movieDate = localStorage.getItem('time_movieDate');
          timeAndTickets.time_movieTime = localStorage.getItem('time_movieTime');

          // Check for Tickets by type
          timeAndTickets.tickets_adultTickets = localStorage.getItem('tickets_adultTickets');
          timeAndTickets.tickets_childTickets = localStorage.getItem('tickets_childTickets');
          timeAndTickets.tickets_seniorTickets = localStorage.getItem('tickets_seniorTickets');
          return(timeAndTickets);
        }
        var movieDateSel  = document.querySelector('#movie-date-selected');

        if (movieDateSel != null && ticketType == null) {
          console.log("Can print time and tickets");
          // Get time and Tickets
          var timeTickets = getLocalStorageTimeNTickets();

          var date_selected = timeTickets.time_movieDate;
          var time_selected = timeTickets.time_movieTime;

          // Create display string for showtime and date
          var date_display = "Movie date "+ date_selected + " | "+ time_selected;
          movieDateSel.innerText = date_display;

          // Check for Tickets and date_display
          var locStor_adultT = timeTickets.tickets_adultTickets;
          var locStor_childT = timeTickets.tickets_childTickets;
          var locStor_seniorT = timeTickets.tickets_seniorTickets;

          var ticketArea = document.createElement('p');
          var para = document.createElement('p');

          movieDateSel.appendChild(ticketArea);
          ticketArea.innerText = "Ticket summary:"
          ticketArea.appendChild(para);

          var cost;
          if (locStor_adultT > 0) {
            cost = Number(locStor_adultT) * 12.50;
            ticketArea.innerText +=
            "\nAdults -      " + "$"+cost+ " ("+locStor_adultT + " at $12.50)";
          }
          if (locStor_childT > 0) {
            cost = Number(locStor_childT) * 11.00
            ticketArea.innerText +=
            "\nChildren - " + "$"+cost + " ("+locStor_childT + " at $11.00)";
          }
          if (locStor_seniorT > 0) {
            cost = Number(locStor_seniorT) * 12.00
            ticketArea.innerText +=
            "\nSeniors -  " + "$"+cost +" ("+locStor_seniorT + " at $12.00)";
          }
        }
*/
      } // end if (storageAvailable....
    // === END TIME AND TICKETS FUNCTIONALITY
  }); // DOM loaded

})();
