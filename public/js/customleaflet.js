$(document).ready(function () {
    let locations = {};
    let LeafIcon = L.Icon.extend({
        options: {
            iconSize: [17, 17],
            shadowSize: [10, 12],
            shadowAnchor: [4, 62],
            iconAnchor: [10, 10],//changed marker icon position
            popupAnchor: [0, -16]//changed popup position
        }
    });

    let map, mapHistory;
    let markers = new L.FeatureGroup();
    let markersHistory = new L.FeatureGroup();
    let filterMarkers = [];
    let average_speed = [];

//Set Awal
    (function () {
        [].slice.call(document.querySelectorAll('.tabs')).forEach(function (el) {
            new CBPFWTabs(el);
        });
    })();

    $("#tab-track").click(function () {
        $("#googleMap").show();
        $("#googleMapHistory").hide();
    });

    $("#tab-history").click(function () {
        $("#googleMapHistory").show();
        $("#googleMap").hide();
        getDataMapHistory();
    });

    let minDatePicker = new Date();
    minDatePicker.setFullYear(minDatePicker.getFullYear() - 1);

    $(".datepicker").datepicker({
        dateFormat: 'dd.mm.yy',
        autoSize: true,
        firstDay: 1,
        constrainInput: true,
        maxDate: '0',
        minDate: minDatePicker
    });

    let endDate = new Date();
    endDate.setHours(0, 0, 0, 0);
    let startDate = endDate;

    $(".datepicker.startDate").datepicker("setDate", startDate);
    $(".datepicker.endDate").datepicker("setDate", endDate);

    $("#setDate").click(function () {
        endDate = $(".datepicker.endDate").datepicker("getDate");
        startDate = $(".datepicker.startDate").datepicker("getDate");
        $("div.inner-table").closest("tr").remove();
        for (let terminalId in locations) {
            let message = locations[terminalId];
            if (message.path) {
                message.path.remove();
                $.each(message.historiesMarkers, function (i, marker) {
                    markersHistory.removeLayer(marker);
                });
                delete message.historiesMarkers;
                delete message.path;
            }
        }
    });

    function getTimeDifference(fromDate) {
        if (!fromDate) {
            return "-";
        }

        let toDate = new Date().getTime();

        let seconds = Math.round((toDate - fromDate) / 1000);
        let minutes = 0, hours = 0, days = 0, weeks = 0, months = 0, years = 0;

        let result = seconds + "s";

        if (seconds >= 60) {
            minutes = Math.floor(seconds / 60);
            seconds = seconds % 60;
            result = minutes + "m" + seconds + "s";
        }

        if (minutes >= 60) {
            hours = Math.floor(minutes / 60);
            minutes = minutes % 60;
            result = hours + "h" + minutes + "m";
        }

        if (hours >= 24) {
            days = Math.floor(hours / 24);
            hours = hours % 24;
            result = days + "d" + hours + "h";
        }

        if (days >= 7 && days < 30) {
            weeks = Math.floor(days / 7);
            days = days % 7;
            result = weeks + "w" + days + "d";
        } else if (days >= 30 && days < 365) {
            months = Math.floor(days / 30);
            weeks = Math.floor(days % 30 / 7);
            result = months + "m" + weeks + "w";
        } else if (days >= 365) {
            years = Math.floor(days / 365);
            months = Math.floor(days % 365 / 30);
            result = years + "y" + months + "m";
        }

        return result;
    }

    $('#floating-panel div.close').on('click', function () {
        let $this = $("#floating-panel");
        if ($this.hasClass('open')) {
            $this.animate({
                left: 0
            }).removeClass('open');
            $('#floating-panel div.close i').removeClass("fa-angle-double-right");
            $('#floating-panel div.close i').addClass("fa-angle-double-left");
        } else {
            $this.animate({
                left: '-425px'
            }).addClass('open');
            $('#floating-panel div.close i').removeClass("fa-angle-double-left");
            $('#floating-panel div.close i').addClass("fa-angle-double-right");
        }
    });

    function getDataMap() {
        map = L.map('googleMap', {
            center: [0, 118.8230631], zoom: 5,
            contextmenu: true,
            contextmenuWidth: 140,
            contextmenuItems: [{
                text: 'Start Point',
                callback: startPoint,
                index: 1
            }]
        });

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }

    function startPoint(e) {
        map.contextmenu.removeAllItems(1);
        map.contextmenu.insertItem({text: 'End Point', callback: endPoint}, 2);
    }

    function endPoint(e) {
        map.contextmenu.removeAllItems();
        map.contextmenu.insertItem({text: 'Start Point', callback: startPoint}, 1);
    }

    function getDataMapHistory() {
        mapHistory = L.map('googleMapHistory', {center: [0, 118.8230631], zoom: 5});
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapHistory);
    }

//TRACK
    function getDataShip() {
        $.ajax({
            type: 'get',
            url: "/admin/getDataShip",
            success: function (data) {
                let getDataShip = '';
                let getDataHistoryShip = '';
                let damask, jsonParse, lastSeeShip = '';
                let timeShip, speed, latitude, longitude, key = '';
                let k = 0;
                for (let i in data) {
                    if (i === "") {
                        damask = 'Unassigned terminals';
                    } else {
                        damask = i;
                    }

                    getDataShip = getDataShip + '<tr class="header"><td><input type="checkbox" name="' + k + '" checked="checked"/></td> <td colspan="3">' + damask + '</td> </tr>';

                    getDataHistoryShip = getDataHistoryShip + '<tr class="header"><td></td><td>' + damask + '</td></tr>';

                    for (const j in data[i]) {
                        if (data[i][j]['ship_history_ships_latest'].length > 0) {
                            timeShip = Date.parse(data[i][j]['ship_history_ships_latest'][0]['message_utc']) + 7 * 60 * 60 * 1000;
                            lastSeeShip = getTimeDifference(timeShip);

                            jsonParse = JSON.parse(data[i][j]['ship_history_ships_latest'][0]['payload']);
                            for (const k in jsonParse['Fields']) {
                                if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'speed') {
                                    speed = (jsonParse['Fields'][k]['Value'] * 1).toFixed(1);
                                }

                                if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'latitude') {
                                    latitude = (jsonParse['Fields'][k]['Value'] * 1).toFixed(4);
                                }

                                if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'longitude') {
                                    longitude = (jsonParse['Fields'][k]['Value'] * 1).toFixed(4);
                                }

                                if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'heading') {
                                    heading = (jsonParse['Fields'][k]['Value'] * 0.1).toFixed(1);
                                }
                            }
                            key = data[i][j]['ship_ids'];
                            locations[key] = {};
                            locations[key]['id'] = data[i][j]['id'];
                            locations[key]['name'] = data[i][j]['name'];
                            locations[key]['eventTime'] = timeShip;
                            locations[key]['heading'] = heading ? heading : 0;
                            locations[key]['speed'] = speed ? speed : 0;
                            locations[key]['latitude'] = latitude;
                            locations[key]['longitude'] = longitude;
                        } else {
                            lastSeeShip = '-';
                            speed = 0;
                        }

                        getDataShip = getDataShip + '<tr class="row">' +
                            '<td><input type="checkbox" name="' + k + '" value="' + data[i][j]['ship_ids'] + '" checked="checked"/></td>' +
                            '<td>' + data[i][j]['name'] + ' </td>' +
                            '<td id="' + data[i][j]['ship_ids'] + '-last">' + lastSeeShip + '</td>' +
                            '<td id="' + data[i][j]['ship_ids'] + '-speed">' + speed + '</td></tr>';
                        getDataHistoryShip = getDataHistoryShip +
                            '<tr class="row">' +
                            '<td><input type="checkbox" name="' + i + '" value="' + data[i][j]['ship_ids'] + '"/></td>' +
                            '<td>' + data[i][j]['name'] + '</td>' +
                            '</tr>';
                    }
                    k++;
                }

                $('#shipData').html(getDataShip);
                $('#historyShipData').html(getDataHistoryShip);
                getDataMap();
                getMarker();
            },
        });
    }

    function getMarker() {
        map.addLayer(markers);
        for (let terminalId in locations) {
            let message = locations[terminalId];
            let greenIcon = new LeafIcon({iconUrl: getIcon(message)});
            let rotation = message.speed > 0.49 ? Math.round(message.heading * 0.7) : 0;
            let popup = showInfoPopUp(message);
            let marker = L.marker([message.latitude, message.longitude],
                {rotationAngle: rotation, icon: greenIcon});
            marker.bindPopup(popup);
            marker.on('mouseover', function (e) {
                this.openPopup();
            });
            marker.on('mouseout', function (e) {
                this.closePopup();
            });
            filterMarkers[terminalId] = marker;
            markers.addLayer(marker);
        }
    }

    function showInfoPopUp(message) {
        let name = message.name ? message.name : message.id;
        let content = "<p><strong><u>" + name + "</u></strong></p>" +
            "<p><strong>Last:</strong> " + $.format.date(new Date(message.eventTime), "dd.MM.yyyy HH:mm:ss") + "</p>" +
            "<p><strong>Position:</strong> " + (message.latitude * 1).toFixed(4) + " S&nbsp;&nbsp;" + (message.longitude * 1).toFixed(4) + " E</p>" +
            "<p><strong>Speed:</strong> " + (message.speed * 1).toFixed(1) + " knots</p>" +
            "<p><strong>Heading</strong>: " + (message.heading * 0.1).toFixed(1) + "&deg;</p>";

        return content;
    }

    function getMarkerWithIds(x) {
        x = x || 0;
        x = (typeof x != 'undefined' && x instanceof Array) ? x : [x];
        map.addLayer(markers);
        for (let n in x) {
            if (typeof locations[x[n]] != 'undefined') {
                markers.addLayer(filterMarkers[x[n]]);
            }
        }
    }

    function deleteMarkerWithIds(x) {
        x = x || 0;
        x = (typeof x != 'undefined' && x instanceof Array) ? x : [x];
        for (let n in x) {
            if (typeof locations[x[n]] != 'undefined') {
                markers.removeLayer(filterMarkers[x[n]]);
            }
        }
    }

    $("#checkAll").click(function () {
        $("#tracking_table input:checkbox").not(this).prop("checked", this.checked);
        $("#tracking_table tbody tr.row input:checkbox").trigger("change");
        if ($(this).prop("checked") === true) {
            getMarker();
        } else {
            markers.clearLayers();
        }
    });

    $(document).on("click", "#tracking_table tbody tr.header input:checkbox", function () {
        let checkbox_selector = "#tracking_table input[name='" + $(this).attr("name") + "']";
        $(checkbox_selector).not(this).prop("checked", this.checked);
        $(checkbox_selector).trigger("change");

        let getTerminalId = [];
        $.each($("#tracking_table input[name='" + $(this).attr("name") + "']"), function () {
            getTerminalId.push($(this).val());

        });
        getTerminalId.indexOf('on') !== -1 && getTerminalId.splice(getTerminalId.indexOf('on'), 1);
        if ($(checkbox_selector).prop("checked") === true) {
            getMarkerWithIds(getTerminalId);
        } else {
            deleteMarkerWithIds(getTerminalId);
        }
    });

    $(document).on("click", "#tracking_table tbody tr.row", function () {
        let id = $("input:checkbox", this).val();
        if (typeof locations[id] != "undefined") {
            filterMarkers[id].openPopup();
        } else {
            $("#tracking_table tbody  input:checkbox[value=" + id + "]").trigger("click");
        }
    });

    $(document).on("click", "#tracking_table tbody tr.row input:checkbox", function () {
        let id = $(this).val();
        let checked = $(this).is(":checked");
        if (checked) {
            getMarkerWithIds(id);
        } else {
            deleteMarkerWithIds(id);
        }
    });

    function getIcon(message) {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let oneHoursBefore = new Date();
        oneHoursBefore.setHours(oneHoursBefore.getHours() - 1);

        let notActivityMoreThan24h = message.eventTime <= yesterday.getTime();
        let notActivityMoreThan1h = message.eventTime <= oneHoursBefore.getTime();

        let speedMoreThen05 = notActivityMoreThan24h ? '/images/0.5red-ship.png' : notActivityMoreThan1h ? '/images/0.5orange-ship.png' : '/images/0.5green-ship.png';
        let speedLessThen05 = notActivityMoreThan24h ? '/images/0.05red-ship.png' : notActivityMoreThan1h ? '/images/0.05orange-ship.png' : '/images/0.05green-ship.png';

        return message.speed > 0.5 ? speedMoreThen05 : speedLessThen05;
    }

    getDataShip();

//History
    $("#downloadCSV").click(function () {
        var data = [["ID",
            "Event Time",
            "Ship Id",
            "Ship Name",
            "Latitude",
            "Longitude",
            "Speed",
            "Heading"]];

        for (var terminalId in locations) {
            var message = locations[terminalId];
            if (message.path) {
                var histories = message.histories;
                var path = [];
                $.each(histories, function (i, history) {
                    var nextDay = new Date(endDate);
                    nextDay.setDate(endDate.getDate() + 1);
                    let timeShip = Date.parse(history['message_utc']) + 7 * 60 * 60 * 1000;
                    if (timeShip > startDate.getTime() && timeShip < nextDay.getTime()) {
                        let jsonParse = JSON.parse(history['payload']);
                        let speed, latitude, longitude, heading;
                        for (const k in jsonParse['Fields']) {
                            if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'speed') {
                                speed = (jsonParse['Fields'][k]['Value'] * 1).toFixed(1);
                            }

                            if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'latitude') {
                                latitude = (jsonParse['Fields'][k]['Value'] * 1).toFixed(4);
                            }

                            if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'longitude') {
                                longitude = (jsonParse['Fields'][k]['Value'] * 1).toFixed(4);
                            }

                            if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'heading') {
                                heading = (jsonParse['Fields'][k]['Value'] * 0.1).toFixed(1);
                            }
                        }
                        data.push([history['id'],
                            '"' + $.format.date(new Date(timeShip), "dd.MM.yyyy HH:mm:ss") + '"',
                            '"' + history['ship_ids'] + '"',
                            '"' + (history['name'] ? history['name'] : '') + '"',
                            latitude,
                            longitude,
                            speed,
                            heading
                        ]);
                    }
                });
            }
        }

        var csvContent = "";
        data.forEach(function (infoArray, index) {
            var dataString = infoArray.join(",");
            csvContent += index < data.length ? dataString + "" : dataString;
        });

        if (window.navigator.msSaveOrOpenBlob) {
            var blobObject = new Blob(["\ufeff" + csvContent]);
            window.navigator.msSaveOrOpenBlob(blobObject, "terminal-messages.csv");
        } else {
            var link = document.createElement("a");
            link.setAttribute("href", encodeURI("data:text/csv;charset=utf-8," + csvContent));
            link.setAttribute("download", "terminal-messages.csv");
            document.body.appendChild(link); // Required for FF

            link.click();
        }
    });

    function showHistories(terminalId) {
        let selectedTR = $("#history_table tr.row").has("input:checkbox[value=" + terminalId + "]");

        if (selectedTR.next().length > 0 && !(selectedTR.next().hasClass("row") || selectedTR.next().hasClass("header"))) {
            return;
        }

        selectedTR.addClass("checked");
        let histories_html = "<tr><td></td><td><div class=\"inner-table\">";
        $.each(locations[terminalId].histories, function (i, history) {
            let nextDay = new Date(endDate);
            nextDay.setDate(endDate.getDate() + 1);
            let timeShip = Date.parse(history['message_utc']) + 7 * 60 * 60 * 1000;
            let speed;
            let jsonParse = JSON.parse(history['payload']);
            for (const k in jsonParse['Fields']) {
                if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'speed') {
                    speed = (jsonParse['Fields'][k]['Value'] * 1).toFixed(1);
                }
            }

            if (timeShip > startDate.getTime() && timeShip < nextDay.getTime()) {
                histories_html += "<div class=\"inner-table-row\">";
                histories_html += '<div class="inner-table-icon-cell"><input type="checkbox" name="' + i + '" value="' + history['ship_ids'] + '"/></div>';
                histories_html += "<div class=\"inner-table-icon-cell\"><i class=\"fa fa-compass\"></i></div>";
                histories_html += "<div class=\"inner-table-date-cell\">" + $.format.date(new Date(timeShip), "dd.MM.yyyy HH:mm:ss") + "</div>";
                histories_html += "<div>" + (speed * 0.1).toFixed(1) + " knots</div>";
                histories_html += "</div>";
            }
        });
        histories_html += "</div></td></tr>";

        selectedTR.after(histories_html);
    }

    function createPath(terminalId) {
        let histories = locations[terminalId].histories;
        let path = [];
        let historiesMarkers = [];
        let poliline = [];

        mapHistory.addLayer(markersHistory);
        $.each(histories, function (i, history) {
            let nextDay = new Date(endDate);
            nextDay.setDate(endDate.getDate() + 1);
            let timeShip = Date.parse(history['message_utc']) + 7 * 60 * 60 * 1000;
            let speed, latitude, longitude, heading;
            if (timeShip > startDate.getTime() && timeShip < nextDay.getTime()) {
                let jsonParse = JSON.parse(history['payload']);
                for (const k in jsonParse['Fields']) {
                    if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'speed') {
                        speed = (jsonParse['Fields'][k]['Value'] * 1).toFixed(1);
                    }

                    if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'latitude') {
                        latitude = (jsonParse['Fields'][k]['Value'] * 1).toFixed(4);
                    }

                    if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'longitude') {
                        longitude = (jsonParse['Fields'][k]['Value'] * 1).toFixed(4);
                    }

                    if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'heading') {
                        heading = (jsonParse['Fields'][k]['Value'] * 0.1).toFixed(1);
                    }
                }

                path = {};
                path['id'] = history['id'];
                path['name'] = history['name'];
                path['eventTime'] = timeShip;
                path['heading'] = heading ? heading : 0;
                path['speed'] = speed;
                path['latitude'] = latitude;
                path['longitude'] = longitude;

                let greenIcon = new LeafIcon({iconUrl: getIcon(path)});
                let rotation = speed > 0.49 ? Math.round(heading * 0.7) : 0;
                let popup = showInfoPopUp(path);
                let markerHistory;
                poliline[poliline.length] = new L.LatLng(latitude, longitude);
                if (histories.length > 0 && i === 0) {
                    markerHistory = L.circle([latitude, longitude], {
                        color: '#000000',
                        fillColor: '#0000FF',
                        fillOpacity: 1,
                        radius: 30000
                    });
                } else if (histories.length > 1 && histories.length === i + 1) {
                    markerHistory = L.marker([latitude, longitude], {
                        rotationAngle: rotation, icon: greenIcon
                    });
                } else {
                    markerHistory = L.circle([latitude, longitude], {
                        color: '#000000',
                        fillColor: '#ff0000',
                        fillOpacity: 1,
                        radius: 30000
                    });
                }

                markerHistory.bindPopup(popup);
                markerHistory.on('mouseover', function (e) {
                    this.openPopup();
                });
                markerHistory.on('mouseout', function (e) {
                    this.closePopup();
                });
                markersHistory.addLayer(markerHistory);
                historiesMarkers[historiesMarkers.length] = markerHistory;
            }
        });

        locations[terminalId].historiesMarkers = historiesMarkers;
        locations[terminalId].path = new L.polyline(poliline, {
            color: "#0000FF",
            weight: 2,
            opacity: 0.8
        }).addTo(mapHistory);

    }

    function removeHistories(terminalId) {
        let selectedTR = $("#history_table tr.row").has("input:checkbox[value=" + terminalId + "]");

        if (selectedTR.next().hasClass("row")) {
            return;
        }

        selectedTR.removeClass("checked");

        selectedTR.next().remove();
    }

    $(document).on("click", "#history_table tbody tr.row input:checkbox", function () {
        let id = $(this).val();
        let selectedMessage = locations[id];

        if (selectedMessage) {
            if (!selectedMessage.path) {
                if (selectedMessage.histories) {
                    createPath(id);
                    showHistories(id);
                } else {
                    let terminal_messages_url = "/admin/getDataHistoryShipById/" + id;
                    $.getJSON(terminal_messages_url, function (data) {
                        if (data.length > 0) {
                            let terminalId = data[0].ship_ids;
                            locations[terminalId].histories = data;
                            createPath(terminalId);
                            showHistories(id);
                        }
                    });
                }
            } else {
                let checked = $(this).is(":checked");
                selectedMessage.path.remove(checked);
                $.each(selectedMessage.historiesMarkers, function (i, marker) {
                    if (checked)
                        markersHistory.addLayer(marker);
                    else
                        markersHistory.removeLayer(marker);
                });

                if (checked) {
                    showHistories(id);
                } else {
                    removeHistories(id);
                }
            }
        }
    });

    $(document).on("click", "#history_table tbody tr.row", function () {
        let id = $("input:checkbox", this).val();
        let selectedMessage = locations[id];
        if (selectedMessage) {
            if (selectedMessage.path) {
                selectedMessage.historiesMarkers[selectedMessage.historiesMarkers.length - 1].openPopup();
            }
        }
    });

    function searchForId(name, shipId, array) {
        for (let i in array) {
            if (array[i][0] === name && array[i][1] == shipId) {
                return i;
            }
        }
        return null;
    }

    $(document).on("click", "#history_table tbody tr .inner-table .inner-table-row .inner-table-icon-cell input:checkbox", function () {
        let id = $(this).val();
        let name = $(this).attr("name");
        let selectedMessage = locations[id];
        let checked = $(this).is(":checked");

        if (selectedMessage) {
            if (selectedMessage.path) {
                if (checked) {
                    average_speed.push([name, selectedMessage.histories[name].id, selectedMessage.histories[name].message_utc]);
                    selectedMessage.historiesMarkers[name].openPopup();
                } else {
                    let findId = searchForId(name, selectedMessage.histories[name].id, average_speed);
                    average_speed.splice(findId, 1);
                    selectedMessage.historiesMarkers[name].closePopup();
                }
            }
        }

        if (average_speed.length % 2 === 0) {
            $.ajax({
                type: 'get',
                url: "/admin/getAverageSpeed/" + JSON.stringify(average_speed),
                success: function (data) {
                    if (data) {
                        let html = '<table class="table" align="center" style="text-align: left; font-size: 1em; min-width: 200px"><thead> <tr> <th width="50%">Name</th>' +
                            '<th width="50%">Speed</th></tr></thead><tbody>';
                        for (let i in data) {
                            html = html + '<tr><td>' + data[i].name + '</td><td>' + data[i].speed + ' knots</td></tr>';
                        }
                        html = html + '</tbody>' + '</table>';

                        Swal.fire({
                            title: '<h3>Average Speed Of The Ship</h3>',
                            html: html,
                            showCloseButton: true,
                            focusConfirm: false,
                            confirmButtonText: 'Close',
                        })
                    }
                }
            });
        }
    });

    function updateTrackingInfo(terminalId, lastUpdate, speed) {
        $("#" + terminalId + "-last").text(getTimeDifference(lastUpdate));

        let speedInfo = $("#" + terminalId + "-speed");
        if (speed == 0) {
            speedInfo.text(0);
        } else {
            speedInfo.text((speed * 0.1).toFixed(1));
        }
    }

    setInterval(function () {
        (function () {
            $.getJSON("/admin/getDataShip/", function (data) {
                markers.clearLayers();
                for (let i in data) {
                    for (const j in data[i]) {
                        if (data[i][j]['ship_history_ships_latest'].length > 0) {
                            let timeShip = Date.parse(data[i][j]['ship_history_ships_latest'][0]['message_utc']) + 7 * 60 * 60 * 1000;
                            let location = locations[data[i][j].ship_ids];
                            let jsonParse = JSON.parse(data[i][j]['ship_history_ships_latest'][0]['payload']);
                            let speed, latitude, longitude, heading;
                            for (const k in jsonParse['Fields']) {
                                if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'speed') {
                                    speed = (jsonParse['Fields'][k]['Value'] * 1).toFixed(1);
                                }

                                if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'latitude') {
                                    latitude = (jsonParse['Fields'][k]['Value'] * 1).toFixed(4);
                                }

                                if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'longitude') {
                                    longitude = (jsonParse['Fields'][k]['Value'] * 1).toFixed(4);
                                }

                                if (jsonParse['Fields'][k]['Name'].toLowerCase() === 'heading') {
                                    heading = (jsonParse['Fields'][k]['Value'] * 0.1).toFixed(1);
                                }
                            }

                            if (location['id'] != data[i][j]['id']) {
                                location['id'] = data[i][j]['id'];
                                location['name'] = data[i][j]['name'];
                                location['eventTime'] = timeShip;
                                location['heading'] = heading ? heading : 0;
                                location['speed'] = speed;
                                location['latitude'] = latitude;
                                location['longitude'] = longitude;
                            }
                            let getChecked = $('#checkAll:checked').length;

                            let greenIcon = new LeafIcon({iconUrl: getIcon(locations[data[i][j].ship_ids])});
                            let rotation = speed > 0.49 ? Math.round(heading * 0.7) : 0;
                            let popup = showInfoPopUp(location);

                            let marker = L.marker([latitude, longitude],
                                {rotationAngle: rotation, icon: greenIcon});
                            marker.bindPopup(popup);
                            filterMarkers[data[i][j].ship_ids] = marker;
                            let checked = [];
                            $('#tracking_table tbody tr.row input:checkbox:checked').each(function () {
                                checked.push($(this).val());
                            });

                            if (getChecked > 0 || checked.includes(data[i][j].ship_ids)) {
                                getMarkerWithIds(data[i][j].ship_ids);
                            }
                            updateTrackingInfo(data[i][j].ship_ids, timeShip, speed);
                        }
                    }
                }
            });

            $.each(locations, function (id, location) {
                if (location.histories) {
                    $.getJSON("/admin/getDataHistoryShipById/" + id, function (data) {
                        if (data.length > 0) {
                            let thisId = data[0]['ship_ids'];
                            let thisLocation = locations[thisId];
                            let maxIdNew = Math.max.apply(Math, data.map(function (msg) {
                                return msg.id;
                            }));
                            let maxIdOld = Math.max.apply(Math, thisLocation.histories.map(function (msg) {
                                return msg.id;
                            }));
                            if (maxIdNew != maxIdOld) {
                                thisLocation.histories = data;
                                let path = thisLocation.path;
                                if (path) {
                                    markersHistory.removeLayer(path);
                                    delete thisLocation.path;
                                    createPath(thisId);
                                    removeHistories(thisId);
                                    showHistories(thisId);
                                }
                            }
                        }
                    });
                }
            });
        })();
    }, 900000);
});
