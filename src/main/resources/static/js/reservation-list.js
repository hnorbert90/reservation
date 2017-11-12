/**
 * Script to display and cancel reservations.
 */

"use strict";
function romanize (num) {
    if (!+num)
        return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

var pages=[[]];
var jsonData;
function generatePageLinks(pageNumber){ 
		  $('#pagebar').empty();
		  if((pageNumber)>0)
		  $('#pagebar').append("<a class=\"pagelink\" onClick=\"goToPage("+
				  (pageNumber-1)+");\"><i style=\"transform: rotateZ(180deg);" +
				  		"\"class=\"material-icons\">keyboard_tab</i></a>");
		  $('#pagebar').append("<b style=\"font-size:1.5em; user-select: none;\">"+romanize(pageNumber+1)+"</b>"); 
		  if((pageNumber+1<pages.length))
		  $('#pagebar').append("<a class=\"pagelink\" onClick=\"goToPage("+
				  (pageNumber+1)+");\"><i class=\"material-icons\">keyboard_tab</i></a>");     
}

function goToPage(pageNumber) {
	
	var reservationListTemplateSource = $("#reservation-list-template").html();      // get the template's html source
	var reservationListTemplate = Handlebars.compile(reservationListTemplateSource); // initialize Handlebars template
	if(pages[pageNumber].length<=10)
		{
		for(var i = pages[pageNumber].length ; i < 10;i++){
			pages[pageNumber][i]=[];
		}
		}
	jsonData.content=pages[pageNumber];
	var h = reservationListTemplate(jsonData);  
    $("#reservation-list").empty();
    $("#reservation-list").append(h);
    generatePageLinks(pageNumber);
}
  
(function() {
	
$(document).ready(function() {
	$(".message").hide();
	$(".container").css("display", "none");
	$(".container").fadeIn(1000);
	$("canvas").css("display", "none");
	$("canvas").fadeIn(1000);
	
	function loadAndDisplayListOfReservations() {
	    
		  $('.message').hide();
		    
		    var currentTime = new Date();
			const DAYS = 30; 
			var afterThirtyDays=new Date();
			  	afterThirtyDays.setDate(afterThirtyDays.getDate() + DAYS);
			  	
		    $.ajax({
		      url : "/api/reservations/from-"
		    	  +currentTime.toISOString().substring(0, 10)+"/to-"
		    	  +afterThirtyDays.toISOString().substring(0, 10)
		    	  +"/"+"?page=0&size=10000&sort=startDate,desc",
		      dataType : 'json',
		      async : true, 
		      cache : false,
		      timeout : 5000, 
		      data : {},
		      
		      success : function(response) { 
		    	  pages=[[]];
		    	  var page=[];
		    	  var index=0;
		    	  const ELEMENT_PER_PAGE=10;
		    	  for(var i=0;i<response.content.length;i++){
		    		  if(i%ELEMENT_PER_PAGE==0&i!=0){
		    			  pages[index]=page;
		        		  page=[];
		    			  index++;  
		    		  } 
		    		  page.push(response.content[i]);
		    	  }
		    	  pages[index]=page;
		    	  jsonData=response;
		    	  goToPage(0) 
		      },
		      error : function(XMLHttpRequest, textStatus, errorThrown) {
		        console.log("reservation list retrieval failed ... HTTP status code: " +
		        		XMLHttpRequest.status + ' message ' + XMLHttpRequest.responseText);
		        $('#system-error').fadeIn();
		      }
		    });
		  }
  
  $("body").on('click', '.action', function(e) { 
    var reservationId = $(this).attr('reservationId');
    if(reservationId!=""){
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
        console.log("reservation request failed ... HTTP status code: " +
        		XMLHttpRequest.status + ' message ' + XMLHttpRequest.responseText);
        $('#action-error').fadeIn();
      }
    });
  }
  });
  loadAndDisplayListOfReservations();
});

})();