<?php
include "event.php";
include "resource.php";
$events = [];
for ($i = 0; $i < 10; $i++) {
    $event = new Event();
    for ($j = 0; $j < 3; $j++) {
        array_push($event->resources, new Resource());
    }
    $event->create();
    array_push($events, $event);
}

echo (json_encode($events));
$e1 = array_pop($events);
