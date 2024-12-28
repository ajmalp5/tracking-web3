// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Tracking {
    enum ShipmentStatus {
        PENDING,
        IN_TRANSIT,
        DELIVERED
    }

    struct Shipment {
        address sender;
        address receiver;
        uint256 pickupTime;
        uint256 deliveryTime;
        uint256 distance;
        uint price;
        ShipmentStatus status;
        bool isPaid;
    }

    mapping(address => Shipment[]) public shipments;

    uint256 public shipmentCount;

    struct TypeShipment {
        address sender;
        address receiver;
        uint256 pickupTime;
        uint256 deliveryTime;
        uint256 distance;
        uint price;
        ShipmentStatus status;
        bool isPaid;
    }

    TypeShipment[] typeShipments;

    event ShipmentCreated(
        address indexed sender,
        address indexed receiver,
        uint256 pickupTime,
        uint256 deliveryTime,
        uint256 distance,
        uint price
    );

    event ShipmentTransmit(
        address indexed sender,
        address indexed receiver,
        uint256 pickupTime
    );

    event ShipmentDelivered(
        address indexed sender,
        address indexed receiver,
        uint256 deliveryTime
    );
    event ShipmentPaid(
        address indexed sender,
        address indexed receiver,
        uint price
    );

    constructor() {
        shipmentCount = 0;
    }

    function createShipment(
        address _receiver,
        uint256 _pickupTime,
        uint256 _distance,
        uint _price
    ) public payable {
        require(msg.value == _price, "Payment must be matched with the price");

        // Shipment memory shipment = Shipment({
        //     sender: msg.sender,
        //     receiver: _receiver,
        //     pickupTime: _pickupTime,
        //     deliveryTime: 0,
        //     distance: _distance,
        //     price: _price,
        //     status: ShipmentStatus.PENDING,
        //     isPaid: false
        // });
        Shipment memory shipment = Shipment(
            msg.sender,
            _receiver,
            _pickupTime,
            0,
            _distance,
            _price,
            ShipmentStatus.PENDING,
            false
        );

        shipments[msg.sender].push(shipment);

        shipmentCount++;

        typeShipments.push(
            TypeShipment(
                msg.sender,
                _receiver,
                _pickupTime,
                0,
                _distance,
                _price,
                ShipmentStatus.PENDING,
                false
            )
        );

        emit ShipmentCreated(
            msg.sender,
            _receiver,
            _pickupTime,
            0,
            _distance,
            _price
        );
    }

    function startShipment(
        address _sender,
        address _receiver,
        uint256 _index
    ) public {
        Shipment storage shipment = shipments[_sender][_index];
        TypeShipment storage typeShipment = typeShipments[_index];
        require(shipment.receiver == _receiver, "Invalid receiver");
        require(
            shipment.status == ShipmentStatus.PENDING,
            "Shipment already in transmit"
        );

        shipment.status = ShipmentStatus.IN_TRANSIT;
        typeShipment.status = ShipmentStatus.IN_TRANSIT;

        emit ShipmentTransmit(_sender, _receiver, shipment.pickupTime);
    }

    function CompleteShipment(
        address _sender,
        address _receiver,
        uint256 _index
    ) public {
        Shipment storage shipment = shipments[_sender][_index];
        TypeShipment storage typeShipment = typeShipments[_index];
        require(shipment.receiver == _receiver, "Invalid receiver");
        require(
            shipment.status == ShipmentStatus.IN_TRANSIT,
            "Shipment not in transmit"
        );
        require(!shipment.isPaid, "Shipment already paid");

        shipment.status = ShipmentStatus.DELIVERED;
        typeShipment.status = ShipmentStatus.DELIVERED;
        shipment.deliveryTime = block.timestamp;
        typeShipment.deliveryTime = block.timestamp;

        uint256 amount = shipment.price;

        payable(shipment.sender).transfer(amount);
        shipment.isPaid = true;
        typeShipment.isPaid = true;

        emit ShipmentDelivered(_sender, _receiver, shipment.deliveryTime);

        emit ShipmentPaid(_sender, _receiver, amount);
    }

    function getShipment(
        address _sender,
        uint256 _index
    )
        public
        view
        returns (
            address sender,
            address receiver,
            uint256 pickupTime,
            uint256 deliveryTime,
            uint256 distance,
            uint price,
            ShipmentStatus status,
            bool isPaid
        )
    {
        Shipment storage shipment = shipments[_sender][_index];

        return (
            shipment.sender,
            shipment.receiver,
            shipment.pickupTime,
            shipment.deliveryTime,
            shipment.distance,
            shipment.price,
            shipment.status,
            shipment.isPaid
        );
    }

    function getShipmentCount(address _sender) public view returns (uint256 count) {
        return shipments[_sender].length;
    }

    function getAllTransactions() public view returns (TypeShipment[] memory) {
        return typeShipments;
    }
}
