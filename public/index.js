$('#indexPageDown').click(function() {
    var pageCounter = document.getElementById("indexPageNumber").value;
    if (pageCounter > 1) {
    pageCounter--;
    $('#indexPageNumber').val(pageCounter);
    };
  });

$('#indexPageUp').click(function() {
    var pageCounter = document.getElementById("indexPageNumber").value;
    pageCounter++;
    $('#indexPageNumber').val(pageCounter);
  });