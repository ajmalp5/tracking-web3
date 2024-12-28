import React, { useContext, useState, useEffect } from 'react';
import { TrackingContext } from '../Conetxt/TrackingContext';

import CreateShipmentForm from '../Components/Form';

const Dashboard = () => {
  const { currentAccount, connectWallet, getAllShipments, getShipmentCount } = useContext(TrackingContext);
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    console.log('first')
    const fetchShipments = async () => {
      const count = await getShipmentCount();

      console.log(count, 'COUNt')
      const data = await getAllShipments();
      setShipments(data);
    };
    fetchShipments();
  }, []);

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Shipment Dashboard</h1>
        <CreateShipmentForm />
        {currentAccount ? (
          <button className="px-4 py-2 text-white bg-green-600 rounded">
            Wallet Connected
          </button>
        ) : (
          <button onClick={connectWallet} className="px-4 py-2 text-white bg-blue-600 rounded">
            Connect Wallet
          </button>
        )}
      </header>

      <section>
        <h2 className="mb-4 text-xl">All Shipments</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th>Receiver</th>
              <th>Pickup Time</th>
              <th>Distance</th>
              <th>Price</th>
              <th>Status</th>
              <th>Delivery Time</th>
            </tr>
          </thead>
          <tbody>
            {shipments?.map((shipment, index) => (
              <tr key={index}>
                <td>{shipment.receiver}</td>
                <td>{new Date(shipment.pickupTime * 1000).toLocaleString()}</td>
                <td>{shipment.distance}</td>
                <td>{shipment.price} ETH</td>
                <td>{shipment.status ? 'Completed' : 'Pending'}</td>
                <td>
                  {shipment.deliveryTime
                    ? new Date(shipment.deliveryTime * 1000).toLocaleString()
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;
