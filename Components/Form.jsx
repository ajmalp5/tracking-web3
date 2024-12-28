import React, { useContext, useState } from "react";
import { TrackingContext } from '../Conetxt/TrackingContext';
const CreateShipmentForm = () => {
  const { createShipment } = useContext(TrackingContext);
  const [receiver, setReceiver] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [distance, setDistance] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const shipmentData = {
      receiver,
      pickupTime,
      distance,
      price,
    };
    await createShipment(shipmentData); // Call the createShipment function from context
  };

  return (
    <div className="p-6 border rounded-lg shadow-lg">
      <h2 className="mb-4 text-2xl">Create New Shipment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="receiver" className="block text-sm font-medium text-gray-700">
            Receiver Address
          </label>
          <input
            id="receiver"
            type="text"
            className="block w-full p-2 mt-1 border border-gray-300 rounded"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700">
            Pickup Time
          </label>
          <input
            id="pickupTime"
            type="datetime-local"
            className="block w-full p-2 mt-1 border border-gray-300 rounded"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
            Distance (in km)
          </label>
          <input
            id="distance"
            type="number"
            className="block w-full p-2 mt-1 border border-gray-300 rounded"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price (ETH)
          </label>
          <input
            id="price"
            type="number"
            className="block w-full p-2 mt-1 border border-gray-300 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 text-white bg-blue-600 rounded-lg"
        >
          Create Shipment
        </button>
      </form>
    </div>
  );
};

export default CreateShipmentForm;
