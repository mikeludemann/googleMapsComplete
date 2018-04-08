google.maps.event.addDomListener(window, 'load', init);
var map, markersArray = [];
function bindInfoWindow(marker, map, location) {
    google.maps.event.addListener(marker, 'click', function () {
        function close(location) {
            location.ib.close();
            location.infoWindowVisible = false;
            location.ib = null;
        }
        if (location.infoWindowVisible === true) {
            close(location);
        } else {
            markersArray.forEach(function (loc, index) {
                if (loc.ib && loc.ib !== null) {
                    close(loc);
                }
            });
            var boxText = document.createElement('div');
            boxText.style.cssText = 'background: #fff;';
            boxText.classList.add('md-whiteframe-2dp');

            function buildPieces(location, el, part, icon) {
                if (location[part] === '') {
                    return '';
                } else if (location.iw[part]) {
                    switch (el) {
                        case 'photo':
                            if (location.photo) {
                                return '<div class="photo" style="background-image: url(' + location.photo + ');"></div>';
                            } else {
                                return '';
                            }
                            break;
                        case 'iw-toolbar':
                            return '<div class="toolbar"><h3 class="subhead">' + location.title + '</h3></div>';
                            break;
                        case 'div':
                            switch (part) {
                                case 'email':
                                    return '<div class="details"><i class="icons" style="color:#4285f4;"><img src="' + icon + '.svg"/></i><span><a href="mailto:' + location.email + '" target="_blank">' + location.email + '</a></span></div>'
                                    break;
                                case 'web':
                                    return '<div class="details"><i class="icons" style="color:#4285f4;"><img src="' + icon + '.svg"/></i><span><a href="' + location.web + '" target="_blank">' + location.web_formatted + '</a></span></div>';
                                    break;
                                case 'desc':
                                    return '<label class="desc" for="details"><input type="checkbox" id="details"/><h3 class="small-details">Details</h3><i class="icons open-details"><img src="' + icon + '.svg"/></i><p class="small-details">' + location.desc + '</p></label>';
                                    break;
                                default:
                                    return '<div class="details"><i class="icons"><img src="' + icon + '.svg"/></i><span>' + location.part + '</span></div>';
                                    break;
                            }
                            break;
                        case 'open_hours':
                            var items = '';
                            if (location.open_hours.length > 0) {
                                for (var i = 0; i < location.open_hours.length; ++i) {
                                    if (i !== 0) {
                                        items += '<li><strong>' + location.open_hours[i].day + '</strong><strong>' + location.open_hours[i].hours + '</strong></li>';
                                    }
                                    var first = '<li><label for="hours"><input type="checkbox" id="hours"/><strong>location.open_hours[0].day</strong><strong>' + location.open_hours[0].hours + '</strong><i class="icons open-hours"><img src="images/arrow.svg"/></i><ul>' + items + '</ul></label></li>';
                                }
                                return '<div class="list"><i class="icons first-icons" style="color:#4285f4;"><img src="' + icon + '.svg"/></i><ul>' + first + '</ul></div>';
                            } else {
                                return '';
                            }
                            break;
                    }
                } else {
                    return '';
                }
            }
            boxText.innerHTML = buildPieces(location, 'photo', 'photo', '') + buildPieces(location, 'iw-toolbar', 'title', '') + buildPieces(location, 'div', 'address', 'location_on') + buildPieces(location, 'div', 'web', 'public') + buildPieces(location, 'div', 'email', 'email') + buildPieces(location, 'div', 'tel', 'phone') + buildPieces(location, 'div', 'int_tel', 'phone') + buildPieces(location, 'open_hours', 'open_hours', 'access_time') + buildPieces(location, 'div', 'desc', 'keyboard_arrow_down');
            var myOptions = {
                alignBottom: true,
                content: boxText,
                disableAutoPan: true,
                maxWidth: 0,
                pixelOffset: new google.maps.Size(-140, -40),
                zIndex: null,
                boxStyle: {
                    opacity: 1,
                    width: '280px'
                },
                closeBoxMargin: '0px 0px 0px 0px',
                infoBoxClearance: new google.maps.Size(1, 1),
                isHidden: false,
                pane: 'floatPane',
                enableEventPropagation: false
            };
            location.ib = new InfoBox(myOptions);
            location.ib.open(map, marker);
            location.infoWindowVisible = true;
        }
    });
}

function init() {
    var mapOptions = {
        center: new google.maps.LatLng(51.165691, 10.451526000000058), // The middle of germany
        zoom: 5, 
        gestureHandling: 'auto', 
        fullscreenControl: true, 
        zoomControl: true,
        disableDoubleClickZoom: true,

        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        },
        scaleControl: true,
        scrollwheel: true,
        streetViewControl: true,
        draggable: true,
        clickableIcons: true,
        fullscreenControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        },

        mapTypeId: google.maps.MapTypeId.ROADMAP,

        styles: [],

    }
    var mapElement = document.getElementById('maps');
    var map = new google.maps.Map(mapElement, mapOptions);
    var locations = [{ "title": "Köln Hbf", "address": "50668 Köln, Deutschland", "desc": "Kölner Hauptbahnhof", "tel": "0900 1990599", "int_tel": "", "email": "info@koeln-hbf.de", "web": "http://koeln-hbf.de/", "web_formatted": "koeln-hbf.de", "open": "", "time": "", "lat": 50.9432083, "lng": 6.958657300000027, "photo": "https://goo.gl/cqHpKR", "vicinity": "Germany", "marker": { "fillColor": "#000000", "fillOpacity": 1, "strokeWeight": 0, "scale": 1.5, "path": "M10.2,0C4.6,0,0,4.6,0,10.2c0,6.9,7.8,6.3,10.2,26.4c2.5-20.1,10.2-19.5,10.2-26.4C20.4,4.6,15.9,0,10.2,0z M10.2,13.9c-2.4,0-4.3-1.9-4.3-4.3s1.9-4.3,4.3-4.3s4.3,1.9,4.3,4.3C14.6,12,12.6,13.9,10.2,13.9z", "anchor": { "x": 10, "y": 30 }, "origin": { "x": 0, "y": 0 }, "style": 3 }, "iw": { "address": true, "desc": true, "email": true, "enable": true, "int_tel": true, "open": true, "open_hours": true, "photo": true, "tel": true, "title": true, "web": true } }];

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            icon: locations[i].marker,
            position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
            map: map,
            title: locations[i].title,
            address: locations[i].address,
            desc: locations[i].desc,
            tel: locations[i].tel,
            int_tel: locations[i].int_tel,
            vicinity: locations[i].vicinity,
            open: locations[i].open,
            open_hours: locations[i].open_hours,
            photo: locations[i].photo,
            time: locations[i].time,
            email: locations[i].email,
            web: locations[i].web,
            iw: locations[i].iw
        });

        markersArray.push(marker);

        if (locations[i].iw.enable === true) {
            bindInfoWindow(marker, map, locations[i]);
        }
    }

}