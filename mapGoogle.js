// 'use strict';
function mapGoogle() {
    var opt = {};
    opt.urlGoogleApi = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAZMjE-rC-H-PrtnwrGurrwJfdvTQrbuMk";
    opt.hosts = [map_setting.TILE_SERVERS];
    opt.levelZoonZDCToGoogle = [];
    opt.levelZoonZDCToGoogle[20] = 19; //10m	5(m)	21z
    opt.levelZoonZDCToGoogle[19] = 18; //20m	20(m)	19.46z
    opt.levelZoonZDCToGoogle[18] = 17; //50m	50(m)	17.96z
    opt.levelZoonZDCToGoogle[17] = 17; //85m	50(m)	17.5z
    opt.levelZoonZDCToGoogle[16] = 16; //100m	100(m)	17z
    opt.levelZoonZDCToGoogle[15] = 16; //150m	100(m)	16.5z
    opt.levelZoonZDCToGoogle[14] = 16; //250m	200(m)	15.75z
    opt.levelZoonZDCToGoogle[13] = 15; //300m	200(m)	15.5z
    opt.levelZoonZDCToGoogle[12] = 15; //450m	500(m)	14.75z
    opt.levelZoonZDCToGoogle[11] = 14; //650m	500(m)	14.25z
    opt.levelZoonZDCToGoogle[10] = 13; //1.5km	1(km)	13z
    opt.levelZoonZDCToGoogle[9] = 12;  //3.5km	2(km)	12z
    opt.levelZoonZDCToGoogle[8] = 12;  //5km	5(km)	11.5z
    opt.levelZoonZDCToGoogle[7] = 10;  //8km	10(km)	10.5z
    opt.levelZoonZDCToGoogle[6] = 9;   //20km	20(km)	9.5z
    opt.levelZoonZDCToGoogle[5] = 9;   //30km	20(km)	8.75z
    opt.levelZoonZDCToGoogle[4] = 8;   //40km	50(km)	8.25z
    opt.levelZoonZDCToGoogle[3] = 7;   //85km	100(km)	7.25z
    opt.levelZoonZDCToGoogle[2] = 6;   //200km	200(km)	6z
    opt.levelZoonZDCToGoogle[1] = 5;   //400km	200(km)	5z
    opt.zoomSeting = false;
    opt.getLevelZDCFromGoogle = function (levelGoogle) {
        for (var keyZdc in opt.levelZoonZDCToGoogle) {
            if (opt.levelZoonZDCToGoogle[keyZdc] === levelGoogle) {
                return keyZdc;
            }
        }
        return levelGoogle;
    };
    opt.getLevelGoogleMapFromZDC = function (levelZDC) {
        if (opt.levelZoonZDCToGoogle[levelZDC] > 0) {
            return opt.levelZoonZDCToGoogle[levelZDC];
        }
        return levelZDC;
    };
    opt.checkIsDialogClose = true;
    opt.isDragGMap = true;
    opt.isMoving = true;
    opt.isGMapDragEventDisabled = false;
    opt.isTypeMap = "ZMap";
    var _zMap;
    var _gMap;
    var _gTrafficLayer;
    var _gVis = false;
    var _dragging;
    opt.refreshMap = function ()
    {
        if (_gVis)
        {
            _gTrafficLayer.setMap(null)
            _gVis = false;
        }
        else
        {
            _gTrafficLayer.setMap(_gMap);
            _gVis = true;
        }
    }
    this.getMap = function () {
        var object = {};
        object._gMap = _gMap;
        object._zMap = _zMap;
        return object;
    }
    opt.makeHelpIcon = function () {
        var getUrl = window.location;
        var baseUrl = getUrl.protocol + "//" + getUrl.host + "/";
        var widgetlabel = {
            html: '<img src="' + baseUrl + '/images/map_btn_icon_help.png" alt="" id="showHelpIcon">',
            size: new ZDC.WH(54, 54)
        };
        helpIconWidget = new ZDC.StaticUserWidget({
            bottom: 50,
            right: 60
        }, widgetlabel);
        _zMap.addWidget(helpIconWidget);
        helpIconWidget.open();

        $('#showHelpIcon').click(function () {
            var cookie = (cookiesDB && cookiesDB.NDISS_MapGoogle_data)?cookiesDB.NDISS_MapGoogle_data: {};
            cookie.tutorial = true;
            if(cookiesDB) cookiesDB.NDISS_MapGoogle_data = cookie;
            if(Nd && Nd.SessionDB) Nd.SessionDB.setSession('NDISS_MapGoogle_data', cookie);
            // Cookies.set('NDISS_MapGoogle_data', cookie);
            opt.makeTutorial();
            $(".tutorial_slide_bar_google").css('right',$('#ZMap').parent().width());
            $(".tutorial_slide_bar_google").show();
        });
    }
    opt.makeTutorial = function () {
        var divHtml = $(
                '<div class="tutorial_slide_bar_google"></div><div class="tutorial_control_bar_google"></div>'
                );
        divContent = d3.select("body")
                .append('div')
                .classed('tutorial-dialog', true)
                .style('display', 'block')
                .attr('id', 'tutorial-dialog');
        $(divContent.node()).append(divHtml);
        $(".tutorial_slide_bar_google").hide();
        $('#tutorial-dialog').click(function (e) {
            var cookie = (cookiesDB && cookiesDB.NDISS_MapGoogle_data)?cookiesDB.NDISS_MapGoogle_data: {};
            cookie.tutorial = false;
            if(cookiesDB) cookiesDB.NDISS_MapGoogle_data = cookie;
            if(Nd && Nd.SessionDB) Nd.SessionDB.setSession('NDISS_MapGoogle_data', cookie);
            // Cookies.set('NDISS_MapGoogle_data', cookie);
            $('#tutorial-dialog').remove();
        });
    }
    opt.makeGoogleMapNote = function () {
        var cookie = (cookiesDB && cookiesDB.NDISS_MapGoogle_data)?cookiesDB.NDISS_MapGoogle_data: {};
        if (cookie.mapGoogleShow !== 'ok') {
            var menuHtml = $(
                    '<ul class="menu_mapNote" id="nhkdiss_menu_mapNote">' +
                    '<li><span>この機能はNHK局内における情報共有を目的に開発したもので、放送利用はできません。' +
                    '<li><span>Google衛星写真等の放送利用は、当面、従来手順にてお願いします。</span></li>' +
                    '</ul>'
                    );
            var divDialog;
            divDialog = d3.select("body")
                    .append('div')
                    .classed('mapgoogle-dialog', true)
                    .style('display', 'none')
                    .attr('id', 'mapgoogle-dialog')
            $(divDialog.node()).append(menuHtml)
            opt.makeGoogleMapDialog(divDialog);
        } else {
            //Display type map default
            $('.mapGoogleChecked').prop('checked', true);
            var cookie = (cookiesDB && cookiesDB.NDISS_MapGoogle_data)?cookiesDB.NDISS_MapGoogle_data: {};
            cookie.tutorial = true;
            cookie.mapGoogleShow = 'ok';
            if(cookiesDB) cookiesDB.NDISS_MapGoogle_data = cookie;
            if(cookiesDB) cookiesDB[Nd.switchMapType_cookie] = 0;
            if(Nd && Nd.SessionDB){
                Nd.SessionDB.setSessionMulti({
                    'NDISS_MapGoogle_data': cookie,
                    'NDISS_switch_map_type': 0
                });
            }
            Nd.switchMapType_current = 0;
            displayMapType();
            opt.initGoogleMap();
        }
    }

    opt.mapGoogleNoteDialog;
    opt.makeGoogleMapDialog = function (divDialog) {
        opt.mapGoogleNoteDialog = uidialog({
            title: '【厳守】衛星写真利用上の注意事項',
            // hideclose: true,
            modal: true,
            message: $(divDialog.node()),
            dialogClass: 'info-dialog residential-note-dialog',
            minwidth: '460px',
            width: '460px',
            // minheight:'90px',
            onclose: function (event, ui) {
                if (opt.checkIsDialogClose) {
                    Nd.mapGoogle_checkShow = false;
                    var cookie = (cookiesDB && cookiesDB.NDISS_MapGoogle_data)?cookiesDB.NDISS_MapGoogle_data: {};
                    cookie.tutorial = true;
                    cookie.mapGoogleShow = '';
                    if(cookiesDB) cookiesDB.NDISS_MapGoogle_data = cookie;
                    if(Nd && Nd.SessionDB) Nd.SessionDB.setSession('NDISS_MapGoogle_data', cookie);
                    // Cookies.set('NDISS_MapGoogle_data', cookie);
                }
            },
            onopen: function (event, ui) {
                console.log("is opening");
            },
            buttons: [{
                    'text': 'OK',
                    'id': 'createMapgoogleButton',
                    'click': function () {
                        opt.checkIsDialogClose = false;

                        function displayGoogleMap () {
                            $('.mapGoogleChecked').prop('checked', true);
                            opt.mapGoogleNoteDialog.close();
                            var cookie = (cookiesDB && cookiesDB.NDISS_MapGoogle_data)?cookiesDB.NDISS_MapGoogle_data: {};
                            cookie.tutorial = true;
                            cookie.mapGoogleShow = 'ok';
                            if(cookiesDB) cookiesDB.NDISS_MapGoogle_data = cookie;
                            if(cookiesDB) cookiesDB[Nd.switchMapType_cookie] = '';
                            if(Nd && Nd.SessionDB){
                                Nd.SessionDB.setSessionMulti({
                                    'NDISS_MapGoogle_data': cookie,
                                    'NDISS_switch_map_type': ''
                                }, function () {
                                    //Remove switch map type
                                    // Cookies.remove('NDISS_switch_map_type');
                                    //cookiesDB[Nd.switchMapType_cookie] = null;
                                   // Nd.SessionDB.removeSession('NDISS_switch_map_type')
                                });
                            }
                            Nd.switchMapType_current = 0;
                            // Cookies.set('NDISS_MapGoogle_data', cookie);
                            //Enable google map
                            Nd.mapGoogle_checkShow = true;

                            // Nd.switchMapType_current = 0;
                            //Display type map default
                            // displayMapType();
                            if (typeof Nd.residentialMap.isZMapShowing == 'function' && Nd.residentialMap.isZMapShowing()) {
                                Nd.residentialMap.clear();
                            }else{
                                displayMapType();
                            }
                            opt.initGoogleMap();
                        }

                        if (Nd.map3D_checkShow) {
                            $('.map3DChecked').prop('checked', false);
                            Nd.map3DLib.destroy();
                        }

                        if (typeof Nd.residentialMap.isZMapShowing == 'function' && Nd.residentialMap.isZMapShowing()) {
                            setTimeout(function () {
                                displayGoogleMap();
                            }, 500);
                            $('.residentialChecked').prop('checked', false);
                        } else {
                            displayGoogleMap();
                        }
                    }
                }
            ]
        })
        opt.mapGoogleNoteDialog.open();
    }

    this.fullscreenWindowResize = function () {
        window_resize();
    }

    this.clickHideShowBarleft = function () {
        Nd.mapGoogle_object.clearGoogleMap();
        var cookie = (cookiesDB && cookiesDB.NDISS_MapGoogle_data)?cookiesDB.NDISS_MapGoogle_data: {};
        cookie.mapGoogleShow = 'ok';
        if(cookiesDB) cookiesDB.NDISS_MapGoogle_data = cookie;
        if(Nd && Nd.SessionDB) Nd.SessionDB.setSession('NDISS_MapGoogle_data', cookie);
        // Cookies.set('NDISS_MapGoogle_data', cookie);
        Nd.mapGoogle_object = new Nd.mapGoogle();
        Nd.mapGoogle_checkShow = true;
        Nd.mapGoogle_object.createdMapGoogle();
    }

    this.clearGoogleMap = function (checked) {
        if (Nd.mapGoogle_checkShow) {
            $('#residentialMap').enhsplitter().destroy();
            $("#ZntMap").html('');
            $("#ZntMap").hide();
            if (_zMap) {
                $("#ZMap").attr("style", "width:" + $('#shape-editor-contain').width() + "px;height:" + $('#shape-editor-contain').height() + "px;");
                _zMap.refresh();
            }
            Nd.mapGoogle_checkShow = false;
            var cookie = (cookiesDB && cookiesDB.NDISS_MapGoogle_data)?cookiesDB.NDISS_MapGoogle_data: {};
            console.log('close gooogle map cookies');
            if(cookiesDB) cookiesDB.NDISS_MapGoogle_data = {tutorial: cookie.tutorial};
            if(Nd && Nd.SessionDB) Nd.SessionDB.setSession('NDISS_MapGoogle_data', {tutorial: cookie.tutorial});
            // Cookies.set('NDISS_MapGoogle_data', {tutorial: cookie.tutorial});
        }
        if (helpIconWidget) {
            _zMap.removeWidget(helpIconWidget);
        }

    }
    opt.upadateFullScrenWidthTimeOut;
    opt.upadateFullScrenWidth = function () {
        opt.upadateFullScrenWidthTimeOut = setTimeout(function () {
            if ($("body").hasClass("full-screen")) {
                // if ($("#ZMap").width() != $(window).width()) {
                //     $("#ZMap").attr("style", "top:0;left:0;right:0;position: fixed;bottom: 0;width:" + $(window).width() + "px!important");
                //     _zMap.refresh();
                // }
                // if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                //     $("#ZMap").attr("style", "top:0;left:0;right:0;position: fixed;bottom: 0;width:" + $(window).width() + "px!important");
                //     _zMap.refresh();
                // }
            } else {
                clearTimeout(opt.upadateFullScrenWidthTimeOut);
                return;
            }
            opt.upadateFullScrenWidth();
        }, 100);
    }

    this.updateFullScreen = function () {
        clearTimeout(opt.upadateFullScrenWidthTimeOut);
        opt.upadateFullScrenWidth();
    }

    this.createdMapGoogle = function () {

        opt.makeGoogleMapNote();
    }

    this.createdMapGoogleOnBroadcast = function (checked) {
        var checked = checked || false;
        $('.mapGoogleChecked').prop('checked', true);
        var cookie = (cookiesDB && cookiesDB.NDISS_MapGoogle_data)?cookiesDB.NDISS_MapGoogle_data: {};
        cookie.tutorial = false;
        cookie.mapGoogleShow = 'ok';
        if(cookiesDB) cookiesDB.NDISS_MapGoogle_data = cookie;
        if(cookiesDB) cookiesDB[Nd.switchMapType_cookie] = 0;
        if(Nd && Nd.SessionDB){
            Nd.SessionDB.setSessionMulti({
                'NDISS_MapGoogle_data': cookie,
                'NDISS_switch_map_type': 0
            });
        }
        Nd.switchMapType_current = 0;
        if (!checked) {
            displayMapType();
            Nd.mapGoogle_checkShow = true;
        } else {
            Nd.mapGoogle_checkShow = true;
        }
        opt.initGoogleMap(checked);
    }

    this.setMapType = function (type) {
        if(type != 'ZMap' && type != 'ZntMap')
            type = 'ZMap';
        opt.isTypeMap = type;
    }


    /**
    * Init Google map
    */
    opt.initGoogleMap = function (checked) {
        if (typeof google.maps.Map == 'undefined') {
            $.getScript(opt.urlGoogleApi)
                    .done(function (script, textStatus) {
                        opt.init(checked);
                    })
                    .fail(function (jqxhr, settings, exception) {
                        alert("error in load api");
                    });
        } else {
            opt.init(checked);
        }
    }

    /**
    * Event zoom ZDC map
    */
    function zmap_changZoomZntMap() {
        if (opt.isTypeMap === "ZMap") {
            var zmapLatLon = _zMap.getLatLon();
            var moveLatlon = ZDC.tkyTowgs(zmapLatLon);
            _gMap.panTo({lat: moveLatlon.lat, lng: moveLatlon.lon});
            _gMap.setZoom(opt.getLevelGoogleMapFromZDC(_zMap.getZoomIndex()));
            window_resize();
        }
    }

    /**
    * move ZDC map location and Google map location
    */
    function zmap_MoveLocation() {
            if (opt.isMoving === true) {
                opt.isMoving = false;
                var zmapLatLon = _zMap.getLatLon();
                var moveLatlon = ZDC.tkyTowgs(zmapLatLon);
                _gMap.panTo({lat: moveLatlon.lat, lng: moveLatlon.lon});
                opt.isMoving = true;
            }
            $('#ZMap').css('z-index','999999999999');
            if(opt.isTypeMap === "ZntMap"){
                opt.isGMapDragEventDisabled = true;
            }
    }

    /**
    * Drag on Google map
    */
    var processDragGoogleMap = function () {
        if (opt.isTypeMap === "ZntMap") {
            var cLatLon = _zMap.getLatLon();
            var latLonTmp = ZDC.tkyTowgs(cLatLon);
            _gMap.panTo({lat: latLonTmp.lat, lng: latLonTmp.lon});
        }
    }
    var googleMap_onZoom = function () {
        if (opt.isTypeMap === "ZntMap") {
            _zMap.setZoom(opt.getLevelZDCFromGoogle(_gMap.getZoom()));
            window_resize();
        }
    }

    var googleMap_turnOnDragEvent = function(){
        opt.isGMapDragEventDisabled = false;        
    }
    
     /**
    * MouseDown event in google map
    */
    var googleMap_mouseDown = function(){
        if (opt.isTypeMap === 'ZntMap') {
            opt.isDragGMap = 'ZntMap'
        }
    }

    /**
    * drag on Google map
    */
    var googleMap_onGmapMouseDrag = function () {  
        if (!opt.isGMapDragEventDisabled) {           
            if (opt.isMoving === true) {
                opt.isMoving = false;               
                var latLngTmp = _gMap.getCenter();
                var latLonTmp = ZDC.wgsTotky(new ZDC.LatLon(latLngTmp.lat(), latLngTmp.lng()));
                _zMap.moveLatLon(latLonTmp);
                opt.isMoving = true;             
                opt.isGMapDragEventDisabled = false;   
                opt.isDragGMap = false;
            }
        }
    }
    /**
    * Move to latlon
    */

    var googleMap_moveToLatlon = function() {
        if (!opt.isDragGMap) {
            var latLngTmp = _gMap.getCenter();
            var latLonTmp = ZDC.wgsTotky(new ZDC.LatLon(latLngTmp.lat(), latLngTmp.lng()));
            _zMap.moveLatLon(latLonTmp);
            opt.isDragGMap = true;
        }    
    }


    /**
    * Start drag on google map
    */

    var googleMap_onDragStart = function() {
        if (opt.isTypeMap === 'ZntMap' && opt.isDragGMap === false) {
            opt.isDragGMap = true;
        }
    }

    /**
    * end drag on google map
    */
     var googleMap_onDragEnd = function() {
        if (opt.isTypeMap === 'ZntMap' && opt.isDragGMap === true) {
            opt.isDragGMap = false;
        }
    }

    function window_resize() {
        if (Nd.mapGoogle_checkShow) {
            $("#residentialMap").css('height','100%');
            $("#ZntMap").attr("style", "display: block;width:" + $('#ZntMap').parent().width() + "px;height:" + $("#residentialMap").height() + "px;");
            $("#ZMap").attr("style", "overflow: hidden!important;width:" + $('#ZMap').parent().width() + "px;height:" + $("#residentialMap").height() + "px;");
            console.log($("#ZntMap").parent().width());
            var center = _gMap.getCenter();
            google.maps.event.trigger(_gMap, "resize");
            _gMap.setCenter(center);
            _zMap.refresh();
        }
    }

    this.setZoomSetting = function(zoom) {
        opt.zoomSeting = zoom;
    }
    opt.init = function (checked) {
        var checked = checked || false;
        html = [
            "<div id='googleMap' class='googleMap'></div>",
        ];
        $("#ZntMap").html(html.join(" "));
        if (!checked) {

            $("#ZntMap").attr("style", "width:" + _ZntMapWidthG > 0?_ZntMapWidthG : $('#ZntMap').parent().width() + "px;height:" + $('#ZntMap').parent().height() + "px;");
        } else {
            $("#ZntMap").attr("style", "width:"+_ZntMapWidthG > 0?_ZntMapWidthG : 960+"px;height:1080px;");
            $("#residentialMap").attr("style", "width:1920px;height:1080px;");
        }
        if (_zMap === undefined) {
            _zMap = Nd.map;
            ZDC.addListener(_zMap, ZDC.MAP_CHG_ZOOM, zmap_changZoomZntMap);
            ZDC.addListener(_zMap, ZDC.MAP_DRAG_END, function(){
                zmap_MoveLocation();
                googleMap_turnOnDragEvent();
            });
        }
        var latLonGoogle = ZDC.tkyTowgs(_zMap.getLatLon());
        var googleZoom = opt.getLevelGoogleMapFromZDC(_zMap.getZoomIndex());
        if (opt.zoomSeting) {
            googleZoom = opt.getLevelGoogleMapFromZDC(opt.zoomSeting);
            _zMap.setZoom(opt.zoomSeting);
        }

        var mapOptions = {
            center: new google.maps.LatLng(latLonGoogle.lat, latLonGoogle.lon),
            zoom: googleZoom,
            mapTypeId: 'satellite',
            draggableCursor: 'default',
            draggable: true,
            draggingCursor: 'default',
            tilt: 0,
            fullscreenControl: false,
            zoomControl: false,
//            zoomControlOptions: {
//                position: google.maps.ControlPosition.LEFT_BOTTOM
//            },
            disableDefaultUI: true,
            scaleControl: true,
            scaleControlOptions: {position: google.maps.ControlPosition.LEFT_BOTTOM},
            scrollwheel: false,
            disableDoubleClickZoom: true
        };
        google.maps.visualRefresh = true;
        _gMap = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
        _gTrafficLayer = new google.maps.TrafficLayer();
        _gTrafficLayer.setMap(_gMap);
        _gVis = true;


        
//        _gMap.addListener('mousedown', googleMap_moveToLatlon);
        _gMap.addListener('idle', googleMap_moveToLatlon);
        _gMap.addListener('mouseup', googleMap_onGmapMouseDrag);
        _gMap.addListener('zoom_changed', googleMap_onZoom);
        if(window.innerWidth - $("#residentialMap").width() == 0){
            if(!$('body').hasClass('left-bar-off')){
                if(_ZntMapWidthG > 0)
                    _ZntMapWidthG = _ZntMapWidthG + 150;
            }
        } else {
            if(_ZntMapWidthG != 0){
                if(!$('body').hasClass('left-bar-off')){
                    if(_ZntMapWidthG > 0)
                        _ZntMapWidthG = _ZntMapWidthG - 150;
                }
            }
        }

        $('#residentialMap').enhsplitter({
            onDrag: function (e, splitter) {
                window_resize();
                if (!checked) {
                    var panelOne = splitter.children().first();
                    var panelTwo = panelOne.next().next();
                    var cookie = (cookiesDB && cookiesDB.NDISS_MapGoogle_data)?cookiesDB.NDISS_MapGoogle_data: {};
                    cookie['ZntMapWidth'] = panelOne.width();
                    _ZntMapWidthG = panelOne.width();
                    cookie['ZMapWidth'] = panelTwo.width();
                    _ZMapWidthG = panelTwo.width();
                    if(cookiesDB) cookiesDB.NDISS_MapGoogle_data = cookie;
                    if(Nd && Nd.SessionDB) Nd.SessionDB.setSession('NDISS_MapGoogle_data', cookie);
                }
                // Cookies.set('NDISS_MapGoogle_data', cookie);
            }
        ,position:_ZntMapWidthG>0?_ZntMapWidthG:($("#residentialMap").width()/2)});
        $(".tutorial_slide_bar_google").css('right',$('#ZMap').parent().width());
        $(".tutorial_slide_bar_google").show();
        if (!checked) {
            // $("#ZMap").attr("style", "overflow: hidden!important;width:" + $('#ZMap').parent().width() + "px;height:" + $('#ZMap').parent().height() + "px;");
        } else {
            //$("#ZMap").attr("style", "width:960px; height:1080px");
        }
        $("#ZntMap").show();
        window_resize();
        google.maps.event.addDomListener(window, "resize", function () {
            window_resize();
        });
        document.addEventListener('mousemove', function (e) {
            opt.onmouseMovePointer(e);
        });
        if (!checked) {
            var cookie = (cookiesDB && cookiesDB.NDISS_MapGoogle_data)?cookiesDB.NDISS_MapGoogle_data: {};
            console.log(cookie);

            setTimeout(function(){
                window_resize();
                console.log('init: window_resize');
            }, 500);

            if(Nd.mapGoogle_object){
                $('#googleMap .gm-style').css('border', '1px solid transparent');
            }

            if ((cookie.tutorial === undefined) || (cookie.tutorial === true)) {
                setTimeout(function () {
                    tutorial_slide_bar_google = $(".tutorial_slide_bar_google");
                    tutorial_control_bar_google = $(".tutorial_control_bar_google");
                    if (tutorial_slide_bar_google.length == 0 || tutorial_control_bar_google.length == 0) {
                        opt.makeTutorial();
                        $(".tutorial_slide_bar_google").css('right',$('#ZMap').parent().width());
                        $(".tutorial_slide_bar_google").show();
                    }
                }, 100);
            }
            opt.makeHelpIcon();
        }
    }

    opt.onmouseMovePointer = function (e) {
        if (opt._checkPointInElement(e.pageX, e.pageY, "ZMap") == true) {
            if (opt.isTypeMap != "ZMap") {
                opt.isTypeMap = "ZMap";
            }
        } else {
            if (opt._checkPointInElement(e.pageX, e.pageY, "ZntMap") == true) {
                if (opt.isTypeMap != "ZntMap") {
                    opt.isTypeMap = "ZntMap";
                }
            } else {
                opt.isTypeMap = "ZMap";
            }
        }
    }
    opt._checkPointInElement = function (x, y, idE) {
        var z1 = $("#" + idE).offset().left;
        var z2 = $("#" + idE).offset().top;
        var z3 = z1 + $("#" + idE).width();
        var z4 = z2 + $("#ZMap").height();
        return opt._isInsideRectangle(x, y, z1, z2, z3, z4);
    }
    opt._isInsideRectangle = function (x, y, z1, z2, z3, z4) {
        x1 = Math.min(z1, z3);
        x2 = Math.max(z1, z3);
        y1 = Math.min(z2, z4);
        y2 = Math.max(z2, z4);
        if ((x1 <= x) && (x <= x2) && (y1 <= y) && (y <= y2)) {
            return true;
        } else {
            return false;
        }
    }
//----------------------------------
//end SMap
}
if (typeof module !== 'undefined')
    module.exports = mapGoogle;
