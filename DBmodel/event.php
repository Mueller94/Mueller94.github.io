<?php
    include('../databaseConnector.php');
    class Event{
        public $id;
        public $start;
        public $end;
        public $resouceID;
        public $title;
        public $employees;
        public $department;
        public $type;
        public $team;
        public $customer;
        public $resources = [];

        function __construct()
        {
            
        }

        function create(){

        }        

        function read(){            
            return json_encode($this);
        }

        function update(){

        }

        function delete(){

        }
    }
