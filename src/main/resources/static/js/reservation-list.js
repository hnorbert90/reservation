/**
 * Script to display and cancel reservations.
 */

"use strict";

(function() {
  
  

$(document).ready(function() {

  function loadAndDisplayListOfReservations() {
    
    $('.message').hide();
    
    var reservationListTemplateSource = $("#reservation-list-template").html();      // get the template's html source
    var reservationListTemplate = Handlebars.compile(reservationListTemplateSource); // initialize Handlebars template

    $.ajax({
      url : "/api/reservations/",
      dataType : 'json',
      async : true, 
      cache : false,
      timeout : 5000, 

      data : {},
      success : function(response) {

        var h = reservationListTemplate(response);     // generate HTML from the object using the template
        $("#reservation-list").empty();
        $("#reservation-list").append(h);              // insert the generated HTML into the document
      },
      error : function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("reservation list retrieval failed ... HTTP status code: " + XMLHttpRequest.status + ' message ' + XMLHttpRequest.responseText);
        $('#system-error').fadeIn();
      }
    });
  }
  
  $("body").on('click', '.action', function(e) { 
    var reservationId = $(this).attr('reservationId');
    
    $.ajax({
      url : '/api/reservations/' + encodeURIComponent(reservationId),                    
      method: 'DELETE',                           
      async : true,                          
      cache : false,                         
      timeout : 5000,                     

      data : {},                               

      success : function(data, statusText, response) {          
        loadAndDisplayListOfReservations();
      },
                                                
      error : function(XMLHttpRequest, textStatus, errorThrown) {   
        console.log("reservation request failed ... HTTP status code: " + XMLHttpRequest.status + ' message ' + XMLHttpRequest.responseText);
        $('#action-error').fadeIn();
      }
    });
  });
  
  loadAndDisplayListOfReservations();
});


})();