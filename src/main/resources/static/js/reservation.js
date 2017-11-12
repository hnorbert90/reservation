/**
 * Script to handle placing reservations.
 */

"use strict";
function validateForm() {
 if($("[name=\"resourceId\"]").val()==""){
	$("#validation-error-no-resourceId").fadeIn();
	return false;
}else if($("[name=\"fromDate\"]").val()==""||$("[name=\"toDate\"]").val()==""){
	$("#validation-error-no-date").fadeIn();
	return false;
}else if(new Date($("[name=\"fromDate\"]").val())<new Date()){
	$("#validation-error-reservation-in-past").fadeIn();
	return false;
}else if($("[name=\"owner\"]").val()==""){
	$("#validation-error-no-owner").fadeIn();
	return false;
}else{ 
	return true;
}
}
function sortTable() {
	  var table, rows, switching, i, x, y, shouldSwitch;
	  table = document.getElementById("statistictable");
	  switching = true;
	  while (switching) {
	    switching = false;
	    rows = table.getElementsByTagName("TR");
	    for (i = 1; i < (rows.length - 1); i++) {
	      shouldSwitch = false;
	      if ((Math.round(rows[i].getAttribute("value")) < Math.round(rows[i + 1].getAttribute("value")))) {
	        shouldSwitch= true;
	        break;
	      }
	    }
	    if (shouldSwitch) {
	      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
	      switching = true;
	    }
	  }
	}

(function() {
	var rsId;
	function getColor(value){
	    //value from 0 to 1
	    var hue=((1-value)*120).toString(10);
	    return ["hsl(",hue,",100%,50%)"].join("");
	}
	
	function loadStatistic(){
		 $.getJSON( "/api/reservations/?page=0&size=10000", function( data ) {
			 var listOfResourceIds=new Set();
			 $("#statistic>table>tbody").empty();
			 $("#statistic>table>tbody").append("<tr><th>Facility Id:</th><th>Availablity:</th></tr>");
				  for(var i=0; i<data.content.length;i++){
					  listOfResourceIds.add(data.content[i].resourceId);
				  }
				  listOfResourceIds.forEach(function(resourceId) {				  
				  $.getJSON( "/api/reservations/resource/from-"
				    	  +currentTime.toISOString().substring(0, 10)+"/to-"
				    	  +afterThirtyDays.toISOString().substring(0, 10)
				    	  +"/"+resourceId+"/"+"?page=0&size=10000"
				    	  , function(response) {
				    		  var days=0;
					  for(var j=0; j<response.content.length;j++){
						  var startDate = formatDate(response.content[j].startDate);
						  var endDate = formatDate(response.content[j].endDate);
						  for (var d = new Date(startDate); d <= new Date(endDate) 
						  		&& d<=afterThirtyDays; d.setDate(d.getDate() + 1)) {
							  if(d>=currentTime){
								  days++;	
							  }
							}
					  }
					  var percentage = Math.round(100-Number(((days/30)*100)).toFixed(2));
					  var style=("style=\"background-color:"+getColor((1-percentage/100))+";\"");
					  
					  $("#statistic>table>tbody").append("<tr "+style+"value="+percentage+" resourceId=\""+resourceId+"\""+
							  " class=\"statistictablerow\"><td >"+resourceId+"</td><td>"
							  +percentage+"%</td>"+"</tr>");
						});
				  });
					});
	}
	
	var SelectedDates = {};
	var SeletedText = {};
	var currentTime = new Date();
	const DAYS = 30; 
	var afterThirtyDays=new Date();
	  	afterThirtyDays.setDate(afterThirtyDays.getDate() + DAYS);
	  	
	function formatDate(value){
	   return value.substring(5,7)+ "/" + value.substring(8, 10) + "/" + value.substring(0, 4);
	}

	  function collectFormInput() {
	    var reservationFormValues = {};
	    $.each($('#reservationForm').serializeArray(), function(i, field) {
	      reservationFormValues[field.name] = field.value;
	    });
	    return reservationFormValues;
	  }

	  function isNumber(n) {
		  return !isNaN(parseFloat(n)) && isFinite(n);
		}

	  function updateReservatedDates(facilityId){
		  $.getJSON( "/api/reservations/resource/"+facilityId+
				  "/?page=0&size=10000&sort=startDate,desc", function( data ) {
				SelectedDates=[[]];
				  for(var i=0; i<data.content.length;i++){
					  var startDate = formatDate(data.content[i].startDate);
					  var endDate = formatDate(data.content[i].endDate);
					  for (var d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
						  SelectedDates[d] = d;
						  SeletedText[d]  = "Reserved by "+data.content[i].owner+" from: "+startDate+" to "+endDate;
						}
				  }
					});
	  }

	  function clearFields(){
		  $("*[type=text]").val("");
	  }
	    
$(document).ready(function() {
	$(".message").hide();
	$("#reservationForm").css("display", "none");
	$("#reservationForm").fadeIn(1000);
	$("canvas").css("display", "none");
	$("canvas").fadeIn(1000);
	dragElement(document.getElementById(("statistic")));

	function dragElement(elmnt) {
	  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	  if (document.getElementById(elmnt.id + "header")) {
	    /* if present, the header is where you move the DIV from:*/
	    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
	  } else {
	    /* otherwise, move the DIV from anywhere inside the DIV:*/
	    elmnt.onmousedown = dragMouseDown;
	  }

	  function dragMouseDown(e) {
	    e = e || window.event;
	    // get the mouse cursor position at startup:
	    pos3 = e.clientX;
	    pos4 = e.clientY;
	    document.onmouseup = closeDragElement;
	    // call a function whenever the cursor moves:
	    document.onmousemove = elementDrag;
	  }

	  function elementDrag(e) {
	    e = e || window.event;
	    // calculate the new cursor position:
	    pos1 = pos3 - e.clientX;
	    pos2 = pos4 - e.clientY;
	    pos3 = e.clientX;
	    pos4 = e.clientY;
	    // set the element's new position:
	    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	  }

	  function closeDragElement() {
	    /* stop moving when mouse button is released:*/
	    document.onmouseup = null;
	    document.onmousemove = null;
	  }
	}
	
	loadStatistic();
	
	$('.txtDate, #datepicker').datepicker({
        beforeShowDay: function(date) {
            var Highlight = SelectedDates[date];
            var HighlighText = SeletedText[date]; 
            if (Highlight) {
                return [true, "Highlighted", HighlighText];
            }
            else {
                return [true, '', ''];
            }
        },dateFormat: 'yy-mm-dd'
    });
		  
	  var clickedId; 
	 $(document).on('click','tr[resourceId]',function() {
		 $('#facilityid').val(this.getAttribute("resourceId"));
		 clickedId=this.getAttribute("resourceId");
	});
	 
	 $("#statistictable").on("mouseover", 'tr[resourceId]', function (e) {
		 rsId= this.getAttribute("resourceId");
		 $("#datepicker").css("left", e.pageX+10);
		 $("#datepicker").css("top", e.pageY+10);
		 $( "#datepicker" ).css("display", "block");
		});
	 
	 $("#statistic").on("mouseleave", 'tbody', function () { 
		 $( "#datepicker" ).css("display", "none");
		 if($('#facilityid').val()==""){
			 rsId=undefined;
			 } 
		});
	 
	 $("#statistic").on("mouseleave", 'table', function () { 
		 if(clickedId==undefined){
			 rsId=$("#facilityid").val();
			 }else{
				 rsId=clickedId;
			 }
		 
		});
	 
	 
	 
	var intervalID = window.setInterval(myCallback, 100);
	var sort = window.setInterval(sortTable, 2000);
	
	function myCallback() {
		if(isNumber(rsId)){
			updateReservatedDates(rsId);
			$( "#datepicker" ).datepicker( "refresh" );
		}else {
			SelectedDates=[[]];
		}
	}
	
	$('#facilityid').keyup(function() {
		if(isNumber($(this).val())){
		rsId=($(this).val());
	}else {
		$(this).val('');
		rsId="";
		SelectedDates=[[]];
	}
		});

	
  $("#submitReservation").click(function(e) {    
	  e.preventDefault();
	  $('.message').hide();
	  if(validateForm()){
		  
    var reservationRequest = collectFormInput();
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
        clearFields();
        loadStatistic();
        $('#reservation-successful-message').show();
      },
                                                
      error : function(XMLHttpRequest, textStatus, errorThrown) {   
        console.log("reservation request failed ... HTTP status code: " 
        		+ XMLHttpRequest.status + ' message ' + XMLHttpRequest.responseText);
        var errorCodeToHtmlIdMap = {400 : '#validation-error',
        		405 : '#validation-error', 409 : '#conflict-error' , 500: '#system-error'};
        var id = errorCodeToHtmlIdMap[XMLHttpRequest.status];
        
        if (!id) {
          id =  errorCodeToHtmlIdMap[500]; 
        }
        $(id).fadeIn();
      }
    });
  } 
  });

   
});


})();