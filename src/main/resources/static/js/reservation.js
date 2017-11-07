/**
 * Script to handle placing reservations.
 */

"use strict";

(function() {
  
  function collectFormInput() {
    
    var reservationFormValues = {};
    $.each($('#reservationForm').serializeArray(), function(i, field) {
      reservationFormValues[field.name] = field.value;
    });
    
    return reservationFormValues;
  }
  

$(document).ready(function() {

  $("#submitReservation").click(function(e) {     
    e.preventDefault();           

    $('.message').hide();
    
    var reservationRequest = collectFormInput();
    
    // TODO: form input validation
    
    var reservationUrl = 
      '/api/reservations/' + encodeURIComponent(reservationRequest.resourceId) 
      + '/from-' + encodeURIComponent(reservationRequest.fromDate) 
      + '/to-' + encodeURIComponent(reservationRequest.toDate)
      + '/?owner=' + encodeURIComponent(reservationRequest.owner);

    $.ajax({
      url : reservationUrl,                    
      method: 'POST',                           
      async : true,                          
      cache : false,                         
      timeout : 5000,                     

      data : {},                               

      success : function(data, statusText, response) {          
        var reservationId = response.getResponseHeader('reservation-id');
        $('#reservationId').text(reservationId);
        $('#reservation-successful-message').show();
      },
                                                
      error : function(XMLHttpRequest, textStatus, errorThrown) {   
        console.log("reservation request failed ... HTTP status code: " + XMLHttpRequest.status + ' message ' + XMLHttpRequest.responseText);
        
        var errorCodeToHtmlIdMap = {400 : '#validation-error', 405 : '#validation-error', 409 : '#conflict-error' , 500: '#system-error'};
        var id = errorCodeToHtmlIdMap[XMLHttpRequest.status];
        
        if (!id) {
          id =  errorCodeToHtmlIdMap[500]; 
        }
        
        $(id).fadeIn();
      }
    });
    
  });

  
});


})();