<?php
class EventController {
    private $db;
    private $event;

    public function __construct($db) {
        $this->db = $db;
        $this->event = new Event($db);
    }

    public function processRequest($method, $id) {
        if ($id) {
            $this->processResourceRequest($method, $id);
        } else {
            $this->processCollectionRequest($method);
        }
    }

    private function processCollectionRequest($method) {
        switch ($method) {
            case 'GET':
                $stmt = $this->event->read();
                $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($events);
                break;

            case 'POST':
                $data = json_decode(file_get_contents("php://input"));
                if(!empty($data->title) && !empty($data->event_date)) {
                    $this->event->title = $data->title;
                    $this->event->event_date = $data->event_date;
                    $this->event->location = $data->location ?? 'Church Sanctuary';
                    $this->event->description = $data->description ?? '';

                    if($this->event->create()) {
                        http_response_code(201);
                        echo json_encode(["message" => "Event created."]);
                    } else {
                        http_response_code(503);
                        echo json_encode(["message" => "Unable to create event."]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["message" => "Incomplete data."]);
                }
                break;
            default: http_response_code(405); break;
        }
    }

    private function processResourceRequest($method, $id) {
        $this->event->id = $id;
        switch ($method) {
            case 'DELETE':
                if($this->event->delete()) {
                    echo json_encode(["message" => "Event deleted."]);
                } else {
                    http_response_code(503);
                    echo json_encode(["message" => "Unable to delete."]);
                }
                break;
            default: http_response_code(405); break;
        }
    }
}
?>