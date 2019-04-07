"use strict";

(function () {
  // Browser check
  if (!('querySelector' in document && 'addEventListener' in document)) {
    console.log('querySelector or addEventListener not available');
    return;
  }

  // Value cleaning functions

  //  Payment form inputs:
  //    TODO: Full name (non-empty string?)
  //    TODO: Credit Card Number (16-digits, remove all whitespace, no other chars)
  //    TODO: Expiration date (month [dropdown value] + year [number])
  //    TODO: Security code (3 or 4 digit number code)
  //    TODO: Zip code (5# or 5#-4# number code)
  //    TODO: Email addresss (Remove whitespace, includes @)


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

  function validate_name(value) {
    // Valid name is a non-empty string after removing excess whitespace
    return validate(remove_excess_whitespace(value), /\.+/g);
  }

  // Event Listeners
  // TODO: Enable/disable submit button if all fields are valid
  // ETC

  //  TODO: Update expiration month/year based on current date
  //   ie: if current mo/yr is june 2020, have the mo initialize to 06 and year to 2020, with min 2020 and max 2040 (+20)
  //  TODO: Warnings/errors for missing inputs
  //   ie: check if any fields are empty or contain errors, live feedback for invalid input

});
