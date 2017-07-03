$("document").ready(function() {

  console.log('load ok');

  var mymap = L.map('mapid').setView([51.505, -0.09], 13);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mymap);

  $("li").each(function(){
    L.marker([$(this).attr("lat"), $(this).attr("lon")],{
     icon: redIcon })
    .addTo(mymap)
  })

  var redIcon = L.icon({
      iconUrl: '//blog.chibi-nah.fr/images/map/marker-icon-red.png',
      iconSize: [25,41]
  });


 $( function() {
   $( ".list-group" ).sortable({

     update: function( event, ui ) {

       var mymap = L.map('mapid').setView([$("li:last-child").attr("lat"), $("li:last-child").attr("lon")], 13);

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
