<?php
    /*
    Create a couple of test event objects and convert them to json
    */
    include('databaseConnector.php');

    $counter = 0;
    $eventsArray = array();
    header('Content-Type: application/json');
    for($i2=0;$i2<4;$i2++)
    {
    for($i = 0; $i< 12; $i++){        
        $event = new \stdClass();
        $event->id = 'e'.$counter;
        // 
        $event->resourceId = "r".$i;
        $date = new \DateTime();
        // Load start of event
        $event->start = "".$date->format('Y-m-d H:i:s');        
        $date->add(new DateInterval('PT8H'));
        // Load end of event
        $event->end = "".$date->format('Y-m-d H:i:s');   
        $event->title = "resource".$i."\nInfo    ⚠";
        $event->description = "Weitere Information";
        array_push($eventsArray, $event);        
        $counter++;
    }
}

    $myJSON = json_encode($eventsArray);
    echo $myJSON;
?>
