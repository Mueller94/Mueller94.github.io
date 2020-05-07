var calendarVisible = true;

var filterOpen = false;
var createMaskOpen = false;
var globalCalendar;

/**
 * Fullcalendar constructor
 */
document.addEventListener('DOMContentLoaded', function() {

    var team = false;
    var requestType = 'team';
    var doubleClickActive = false;

    var calendarEl = document.getElementById('calendar');
    var calendar = globalCalendar = new FullCalendar.Calendar(calendarEl, {
        editable: true,
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        plugins: ['resourceTimeline', 'interaction', 'dayGrid', 'timeGrid', 'list', 'resourceTimeGrid'],
        height: 'parent',
        weekNumbers: true,

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
            left: 'prev,next,wechsleTeamAuftragButton, today, addEventButton,filterButton',
            center: 'title',
            right: 'resourceTimeline, resourceTimelineWeek, resourceTimelineMonth,resourceTimelineYear',
        },


        customButtons: {
            addEventButton: {
                text: 'Neuer Termin',
                click: function() {
                    if (!createMaskOpen) {
                        hideAllMasks();
                        showCreateEventMask();
                    } else {
                        hideAllMasks();
                    }
                }
            },
            filterButton: {
                text: 'Filter',
                click: function() {
                    if (!filterOpen) {
                        hideAllMasks();
                        showFilterMask();
                    } else {
                        hideAllMasks();
                    }
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
                        hideAllMasks();
                    } else {
                        team = true;
                        requestType = 'resource';
                        $(this).text('Auftrag');
                        calendar.refetchEvents();
                        hideAllMasks();
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
            resourceTimelineWeek: {
                buttonText: 'Woche',
                firstDay: '1',
                slotDuration: '24:00:00'
            },
            resourceTimelineMonth: {
                buttonText: "Monat"
            },
            resourceTimelineYear: {
                buttonText: "Jahr"
            }
        },

        resourceGroupField: 'bereich',

        resources: {
            url: 'getTeamsAsResources.php',

        },

        events: [],




    });
    calendar.setOption('locale', 'de');
    calendar.render();
    globalCalendar = calendar;
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

function showCreateEventMask() {
    var newEventMask = document.getElementById("createMask");
    newEventMask.style.display = "block";
    createMaskOpen = true;
}

function hideCreateEventMask() {
    var newEventMask = document.getElementById("createMask");
    newEventMask.style.display = "none";
    createMaskOpen = false;
}

function showEmployeeMask() {
    var employeeMask = document.getElementById("employeeMask");
    employeeMask.style.display = "block";
}

function hideEmployeeMask() {
    var employeeMask = document.getElementById("employeeMask");
    employeeMask.style.display = "none";
}

function showFilterMask() {
    var filterMask = document.getElementById("filterMask");
    filterMask.style.display = "block";
    filterOpen = true;
}

function hideFilterMask() {
    var filterMask = document.getElementById("filterMask");
    filterMask.style.display = "none";
    filterOpen = false;
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

function hideAllMasks() {
    filterOpen = false;
    createMaskOpen = false;
    hideFilterMask();
    hideCreateEventMask();
}

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

function submitNewEvent() {
    if (checkSubmissionValid) {
        sendData();
    } else {
        highLightMissingFields();
    }
}

function checkSubmissionValid() {
    return false;
}

function sendData() {

}

function highLightMissingFields() {
    var optionMitarbeiter = document.getElementById("calendar");
}

function applyFilter() {
    if (checkFilterValid) {
        filterData();
    } else {
        highLightMissingFilterFields();
    }
}

function checkFilterValid() {
    return false;
}

function filterData() {

}

function highLightMissingFilterFields() {

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

function filterTeams(select) {
    var departmentID = select.options[select.selectedIndex].value;
    var teamSelect = document.getElementById("selectTeamCreate");
    var counter = 0;
    showAllTeamOptions(teamSelect);
    while (teamSelect.options.length > counter) {
        if (teamSelect.options[counter].getAttribute("bereich_id") != departmentID) {
            teamSelect.remove(counter);
        } else {
            counter++;
        }
    }
}

function createEventAlert() {

    var teamSelect = document.getElementById("selectTeamCreate");
    var typeSelect = document.getElementById("selectTypeCreate");
    var event = {
        id: 'eh',
        resourceId: teamSelect.options[teamSelect.selectedIndex].value,
        title: typeSelect.options[typeSelect.selectedIndex].text,
        start: new Date(),
        allDay: true,
    };
    globalCalendar.addEvent(event);
    hideCreateEventMask();
}

function createMaskAddEmployee() {

}


function checkEndDateCreateCheckBox() {
    document.getElementById("durationCheckBoxCreate").checked = false;
}

function checkEndDurationCheckBox() {
    document.getElementById("endDateCheckBoxCreate").checked = false;
}

function showAllTeamOptions(select) {
    select.innerHTML = document.getElementById("selectAllOptions").innerHTML;
}