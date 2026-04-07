<?php
// config/database.php
class Database {
    private $host = "localhost";
    private $db_name = "transportco_db";
    private $username = "your_username";
    private $password = "your_password";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>

<?php
// api/tracking.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
include_once '../models/Tracking.php';

$database = new Database();
$db = $database->getConnection();
$tracking = new Tracking($db);

$tracking_id = isset($_GET['id']) ? $_GET['id'] : die();

$result = $tracking->getTrackingInfo($tracking_id);

if($result){
    http_response_code(200);
    echo json_encode($result);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Tracking ID not found."));
}
?>

<?php
// models/Tracking.php
class Tracking {
    private $conn;
    private $table_name = "shipments";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getTrackingInfo($tracking_number) {
        $query = "SELECT 
                    s.tracking_number,
                    s.current_status,
                    s.current_location,
                    s.estimated_delivery,
                    sth.status,
                    sth.location,
                    sth.description,
                    sth.recorded_at
                  FROM " . $this->table_name . " s
                  LEFT JOIN shipment_tracking_history sth ON s.id = sth.shipment_id
                  WHERE s.tracking_number = ?
                  ORDER BY sth.recorded_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $tracking_number);
        $stmt->execute();

        $num = $stmt->rowCount();

        if($num > 0) {
            $tracking_info = array();
            $tracking_info["history"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                
                if(!isset($tracking_info["tracking_number"])) {
                    $tracking_info["tracking_number"] = $tracking_number;
                    $tracking_info["current_status"] = $current_status;
                    $tracking_info["current_location"] = $current_location;
                    $tracking_info["estimated_delivery"] = $estimated_delivery;
                }

                $history_item = array(
                    "status" => $status,
                    "location" => $location,
                    "description" => $description,
                    "timestamp" => $recorded_at
                );

                array_push($tracking_info["history"], $history_item);
            }

            return $tracking_info;
        }
        return false;
    }
}
?>

<?php
// api/booking.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../models/Booking.php';

$database = new Database();
$db = $database->getConnection();
$booking = new Booking($db);

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->customer_id) &&
    !empty($data->service_type) &&
    !empty($data->pickup_location) &&
    !empty($data->dropoff_location) &&
    !empty($data->pickup_datetime)
) {
    $booking->customer_id = $data->customer_id;
    $booking->service_type_id = $data->service_type;
    $booking->pickup_location = $data->pickup_location;
    $booking->dropoff_location = $data->dropoff_location;
    $booking->pickup_datetime = $data->pickup_datetime;
    $booking->number_of_passengers = $data->number_of_passengers;
    $booking->special_requirements = $data->special_requirements;

    if($booking->create()) {
        http_response_code(201);
        echo json_encode(array(
            "message" => "Booking created successfully.",
            "booking_reference" => $booking->booking_reference
        ));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create booking."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create booking. Data is incomplete."));
}
?>