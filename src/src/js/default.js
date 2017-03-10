//google map
function initMap() {
    var Options = {
        center: new google.maps.LatLng(59.933451, 30.357678),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('map'), Options);

    my_marker = new google.maps.LatLng(59.933451, 30.357678);
    addMarker(my_marker);

    function addMarker(location) {
        marker = new google.maps.Marker({
            position: location,
            map: map
        });
    }
}


//clipboard
var clipboard = new Clipboard('.popup-share__body-url');
var clipboard = new Clipboard('.post__header-share-url');
clipboard.on('success', function(e) {
    console.log(e);
});
clipboard.on('error', function(e) {
    console.log(e);
});

//close popup
(function () {
    $('.popup-share__close').on('click', function () {
        $(this).closest('.popup-share').removeClass('popup-share_visible');
    });


})();