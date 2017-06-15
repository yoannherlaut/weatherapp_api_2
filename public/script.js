$("document").ready(function() {
  
  console.log('load ok');

  $( function() {
    $( ".list-group" ).sortable({

      update: function( event, ui ) {
        
        var newSort = JSON.stringify($( ".list-group" ).sortable( "toArray" ));
        
        $.get("./updatesort?sort="+newSort, function(data) {
          console.log($( ".list-group-item" ));
          $( ".list-group-item" ).each(function( i ) {
            $( this ).attr("id", i);
          });
        });
      }
  
      
    });
    $( ".list-group" ).disableSelection();
  } );
  
})
