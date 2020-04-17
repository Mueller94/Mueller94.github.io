<?php    
    /*
    Create a couple of test resource objects and convert them to json
    */
    include('databaseConnector.php');

    header('Content-Type: application/json');
    $resourcesArray = array();
    
    $counter = 0;
    for($i = 0; $i< 3; $i++){
        
        for($i2 = 0; $i2 < 4; $i2++){
            $resource = new \stdClass();
            $resource->id = "r".$counter;
            $resource->untergruppe = "u".$i;
            $resource->title = "event".$i2;  
            array_push($resourcesArray, $resource);
            $counter++;
        }    
    }
    $myJSON = json_encode($resourcesArray);
    echo $myJSON;
    
?>