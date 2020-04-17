var calendarVisible = true;
/**
 * When the document has loaded start customizing the header of the fullcalendar with drop downs
 */
$(document).ready(function() {
    initializeHeader();
});

/**
 * Fullcalendar constructor
 */
document.addEventListener('DOMContentLoaded', function() {
    var team = false;
    var requestType = 'team';
    var doubleClickActive = false;

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        editable: true,
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        plugins: ['resourceTimeline', 'interaction', 'dayGrid', 'timeGrid', 'list', 'resourceTimeGrid'],
        height: 'parent',

        eventResize: function(info) {},

        eventDrop: function(info) {},

        eventClick: function(info) {

            if (doubleClickActive == true) {
                var xCalendar = document.getElementById('calendar');
                var xSearchbar = document.getElementById("searchbar");
                xCalendar.style.display = "none";
                xSearchbar.style.display = "none";
                if (!team) {
                    var infoBox = document.getElementById('infoBoxAuftrag');
                    exitEventBig();
                    setText(info);
                } else {
                    var infoBox = document.getElementById('infoBoxResource');
                    exitResourceBig();
                }
            } else {
                doubleClickActive = true;
                setTimeout(function() {
                    doubleClickActive = false;
                }, 500);
            }
        },

        eventMouseEnter: function(info) {
            tooltip = new Tooltip(info.el, {
                title: info.event.extendedProps.furtherInfo,
                placement: 'top',
                trigger: 'hover',
                container: 'body'
            });
        },
        eventMouseLeave: function(info) {
            if (tooltip) {
                tooltip.dispose();
            }
        },

        eventAfterAllRender: function(view) {
            alert("all done")
            initializeHeader();
        },

        eventRender: function(info, element) {

        },
        header: {
            left: 'prev,next,wechsleTeamAuftragButton, today, addEventButton',
            center: 'title',
            right: 'resourceTimeline, resourceTimeLineWeek'
        },


        customButtons: {
            addEventButton: {
                text: '+',
                click: function() {
                    var date = Date.now();
                    var i = iterateAndReturnDynamicEventCount();
                    var j = i % 4;
                    var eventColor = "";
                    switch (j) {
                        case 0:
                            eventColor = "lightgreen";
                            break;
                        case 1:
                            eventColor = "yellow";
                            break;
                        case 2:
                            eventColor = "pink";
                            break;
                        case 3:
                            break;
                        default:

                    };
                    calendar.addEvent({
                        title: 'Auftrag' + i + "\n" + "Beschreibung",
                        color: eventColor,
                        start: date,
                        textColor: "black",
                        end: date + (8 * 60 * 60 * 1000),
                        resourceId: 'r0',
                        furtherInfo: "Hover Informationen zu Auftrag" + i
                    });

                }
            },
            wechsleTeamAuftragButton: {
                text: 'Resource',
                click: function() {
                    if (team) {
                        team = false;
                        requestType = 'team';
                        $(this).text('Resource');
                        calendar.refetchEvents();
                        calendar.refetchResources();
                    } else {
                        team = true;
                        requestType = 'resource';
                        $(this).text('Auftrag');
                        calendar.refetchEvents();
                        calendar.refetchResources();

                    }
                }
            }
        },



        buttonText: {
            today: 'Heute',
            resourceTimeline: 'Tag',
            resourceTimeLineWeek: 'Woche'
        },

        defaultView: 'resourceTimeline',
        height: 'parent',
        minTime: "07:00:00",
        maxTime: "20:00:00",

        resourceColumns: [{
            labelText: 'Resource',
            field: 'title'
        }],

        views: {
            resourceTimeLineWeek: {
                type: 'resourceTimeline',
                duration: {
                    days: 7
                },
                buttonText: '7 Tage',
                slotDuration: '24:00:00'
            },
        },

        resourceGroupField: 'untergruppe',

        resources: [{
                id: 'r0',
                title: 'Resource1'
            },
            {
                id: 'r1',
                title: 'Resource2'
            }
        ],

        events: [{


        }, ],


    });
    calendar.setOption('locale', 'de');
    calendar.render();
});

/**
 * Constructor for detailview
 * Hides fullcalendar and displays an event or resource with the information that element contains
 */
function setText(info) {
    document.getElementById("eventBeginn").innerHTML = info.event.start;
    document.getElementById("eventEnde").innerHTML = info.event.end;
    document.getElementById("eventBemerkung").innerHTML = info.event.extendedProps.furtherInfo;
    document.getElementById("eventArt").innerHTML = info.event.extendedProps.type;
    document.getElementById("eventStatus").innerHTML = info.event.extendedProps.status;
    document.getElementById("eventKunde").innerHTML = info.event.extendedProps.customer;
    document.getElementById("eventStückzahl").innerHTML = info.event.extendedProps.count;
    document.getElementById("eventTeam").innerHTML = info.event.extendedProps.team;
    document.getElementById("eventBereich").innerHTML = info.event.extendedProps.department;
    document.getElementById("eventAuftrag").innerHTML = info.event.extendedProps.furtherInfo;
    var list = info.event.extendedProps.employees;
    var ele;
    document.getElementById("mitarbeiterListe").innerHTML = "<tr><td><h3>Mitarbeiter</h3></td><td></td></tr>" +
        "<tr><td>Vorname</td><td>Nachname</td></tr>";
    var counter = 0;
    for (ele in list) {
        document.getElementById("mitarbeiterListe").innerHTML += "<tr><td>" +
            info.event.extendedProps.employees[counter].firstName + "</td><td>" +
            info.event.extendedProps.employees[counter].lastName + "</td></tr>"
        counter++;
    }
}



/**
 * Helperfunction for removing elements
 * Calls parents and tells them to remove the calling element to improve readability 
 */
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

/**
 * 
 */
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

/**
 * Add dropdowns to header of fullcalendar
 */
function initializeHeader() {
    var newParent = document.getElementsByClassName('fc-center')[0];
    var store = newParent.innerHTML;
    newParent.innerHTML = "";
    document.getElementById("dateHolder").innerHTML = store;
    var oldParent = document.getElementById('searchbar');

    while (oldParent.childNodes.length > 0) {
        newParent.appendChild(oldParent.childNodes[0]);
    }
}

function fillDropDowns() {

}

var counter = 0;

function iterateAndReturnDynamicEventCount() {
    counter += 1;
    return counter;
}

/**
 * Return to calenderview by hiding detailview
 */
function exitEventBig() {
    console.log("exit event");
    var calendar = document.getElementById("calendar");
    var infoBoxAuftrag = document.getElementById("infoBoxAuftrag");
    var searchbar = document.getElementById("searchbar");
    var infoBoxBilder = document.getElementById("infoBoxBilder");
    console.log(calendarVisible);
    if (calendarVisible) {
        calendarVisible = !calendarVisible;
        calendar.style.display = "none";
        searchbar.style.display = "none";
        infoBoxBilder.style.display = "block";
        infoBoxAuftrag.style.display = "block";

        console.log("hiding infobox");
    } else {
        calendarVisible = !calendarVisible;
        calendar.style.display = "block";
        searchbar.style.display = "block";
        infoBoxAuftrag.style.display = "none";
        infoBoxBilder.style.display = "none";

        console.log("displaying infobox");
    }
}

function filterEvents() {
    /**
     * Filter Events then render calendar
     */
    alert("placeholder");
}

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

/**
 * Exit the resourceview by hiding it and unhiding the calendarview
 */
function exitResourceBig() {
    console.log("exit resource");
    var calendar = document.getElementById("calendar");
    var infoBox = document.getElementById("infoBoxResource");
    var searchbar = document.getElementById("searchbar");
    var infoBoxBilder = document.getElementById("infoBoxBilder");

    if (calendarVisible) {
        calendarVisible = !calendarVisible;
        calendar.style.display = "block";
        infoBoxResource.style.display = "none";
        infoBoxAuftrag.style.display = "none";
        infoBoxBilder.style.display = "none";
        searchbar.style.display = "block";

        console.log("hiding infobox");
    } else {
        calendarVisible = !calendarVisible;
        calendar.style.display = "none";
        infoBoxResource.style.display = "block";
        searchbar.style.display = "none";
        infoBoxBilder.style.display = "block";
        console.log("displaying infobox");
    }
}