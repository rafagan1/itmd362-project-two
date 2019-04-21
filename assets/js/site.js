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

  function calc_subtotal(adult, child, senior) {
    return adult*12.50 + child*11.00 + senior*12.00;
  }

  // Event Listeners
  document.addEventListener('DOMContentLoaded', function() {
    // Variables for Movie Select / Home page

    // Variables for Date/Time page

    // Variables for Ticket page

    // Variables for Seating page

    // Variables for Payment page
    var payment_form, submit_payment, pay_name, pay_ccn, pay_expr_mo, pay_expr_yr, pay_cvv, pay_zipcode, pay_email, movie_title, adult_tix, child_tix, senior_tix, subtotal, tax, allFormLabels, i;

    // Check which page we're on and load that content
    if (document.getElementById('main-pay-info') !== null) {
      // Payment page
      payment_form = document.querySelector('#payment');
      submit_payment = document.querySelector('#pay');
      pay_name = document.querySelector('#name').value;
      pay_ccn = document.querySelector('#ccn').value;
      pay_expr_mo = document.querySelector('#exp-month').value;
      pay_expr_yr = document.querySelector('#exp-year').value;
      pay_cvv = document.querySelector('#cvv').value;
      pay_zipcode = document.querySelector('#zipcode').value;
      pay_email = document.querySelector('#email').value;

      if (storageAvailable('localStorage')) {
        // Retrieve movie, date, time, and tickets from localStorage
        movie_title = localStorage.getItem('movie-title');
        adult_tix = Number(localStorage.getItem('tickets_adultTickets'));
        child_tix = Number(localStorage.getItem('tickets_childTickets'));
        senior_tix = Number(localStorage.getItem('tickets_seniorTickets'));

        // Update summary with information
        document.querySelector('#summary-movie').innerText += ' '+ movie_title;
        document.querySelector('#summary-adults').innerText += ' '+adult_tix;
        document.querySelector('#summary-childs').innerText += ' '+child_tix;
        document.querySelector('#summary-senior').innerText += ' '+senior_tix;

        // Calculate subtotal, tax, and grand total
        subtotal = calc_subtotal(adult_tix, child_tix, senior_tix);
        tax = subtotal*.1;

        // Update totals on page
        document.querySelector('#summary-subtotal').innerText += ' '+Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(subtotal);
        document.querySelector('#summary-tax').innerText += ' '+Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(tax);
        document.querySelector('#summary-total').innerText += ' '+Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(subtotal+tax);

        // TODO: On submit, navigate to success page (on that page, clear localStorage)
      }

      // Initialize warning/error labels
      allFormLabels = document.getElementsByTagName('label');
      for (i = 0; i < allFormLabels.length; i++) {
        console.log(allFormLabels[i].id);
        document.querySelector('#'+allFormLabels[i].id).insertAdjacentHTML('afterend', '<b class="error"></b>');
      }

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
    }  // End of payment
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
      sort_result.className = "";
      sort_result.innerText = "Sorry, no movies were found with those filters.";
      document.querySelector("#movie-list").className = "hidden";
    }
    else {
      sort_result.className = "hidden";
      sort_result.innerText = "";
      document.querySelector("#movie-list").className = "";
    }
  }

  // ========TIME AND TICKETS FUNCTIONS !!!!!
  // Save selected movie time and date in local storage
  function storeDateAndTime(e) {
    var dateSelected = document.querySelector('#pick-date');
    var timeSelected = document.querySelector('#pick-time');
    // Remove previous stored time and date
    e.preventDefault();
    localStorage.removeItem('time_movieTime');
    localStorage.removeItem('time_movieDate');

    // Get the selected time and date
    var dateSel = dateSelected.options[dateSelected.selectedIndex].text;
    var timeSel = timeSelected.options[timeSelected.selectedIndex].text;

    // Store the selected date and time.
    localStorage.setItem('time_movieDate', dateSel);
    localStorage.setItem('time_movieTime', timeSel);
    document.location.assign('../tickets');
  }

  // Save selected movie time and date in local storage
  function storeTicketType(e, adult, child, senior) {

    e.preventDefault();
    // Remove previous stored time and date
    localStorage.removeItem('tickets_adultTickets');
    localStorage.removeItem('tickets_childTickets');
    localStorage.removeItem('tickets_seniorTickets');

    if (adult > 0) {
      localStorage.setItem('tickets_adultTickets', adult);
    }
    if (child > 0) {
      localStorage.setItem('tickets_childTickets', child);
    }

    if (senior > 0) {
      localStorage.setItem('tickets_seniorTickets', senior);
    }
    document.location.assign('booking.html');
  }
  document.addEventListener('DOMContentLoaded', function() {
    // ==== TIME AND TICKETS FUNCTIONALITY
    // Variables for time and tickets pages

    // Selectors for Time page

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
          if ((adultTick.value) > 0 ||
             (childTick.value) > 0 ||
             (seniorTick.value) > 0)
          {
            ticketType.removeAttribute('disabled');
            // console.log("Can submit ticket page");
            ticketType.addEventListener('click', function(e) {
              storeTicketType(e, adultTick.value, childTick.value, seniorTick.value);
            });
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

  });
  // ======END TIME AND TICKETS FUNCTIONS

  // Run JS once DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    var movie_list, movie_nodes, movie_attributes, sort_result, sort_button;
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
      sort_result.setAttribute('class', 'hidden');

      // Add section for sorting movies after the #select-movie section
      document.querySelector('#select-movie-h2').after(document.querySelector('#sort-by-template').content);

      // Add element for displaying a message for no sort results
      document.querySelector('#sort-by').after(sort_result);

      // At smaller screens, expand to view Sort By feautre
      sort_button = document.createElement('a');
      sort_button.textContent = 'Expand ▾';
      sort_button.setAttribute('id', 'expand-sort');
      sort_button.setAttribute('href', '');

      document.querySelector("#sort-by-h2").appendChild(sort_button);
      document.querySelector('#sort-by-movie').className = 'hidden';
      document.querySelector('#reset-sort').className = 'hidden';

      // Show/hide the Sort By feature
      document.querySelector("#sort-by-h2").addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('#sort-by-movie').classList.toggle('hidden');
        document.querySelector('#reset-sort').classList.toggle('hidden');
        if (document.querySelector('#sort-by-movie').className === 'hidden') {
          sort_button.textContent = 'Expand ▾';
        }
        else {
          sort_button.textContent = 'Hide ▴';
        }
      });

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

  }); // DOM loaded

})();
