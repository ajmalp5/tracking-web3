import { ethers } from "ethers";

import React, {useEffect, useState} from 'react'
import Web3Model from 'web3modal'
import tracking from "./Tracking.json";
const ContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const Contract = tracking.abi;

const fetchContract = async (signerOrProvider) => {
  return new ethers.Contract(ContractAddress, Contract, signerOrProvider);
};

export const TrackingContext = React.createContext();

export const TrackingProvider = ({ children }) => {
  const DappName = "Product Tracking Dappp";

  const [currentAccount, setCurrentAccount] = useState("");

  const createShipment = async (items) => {
    console.log(items);
    const { receiver, pickupTime, distance, price } = items;
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      console.log(contract, 'contract')
      const createItem = await contract.createShipment(
        receiver,
        new Date(pickupTime),
        distance,
        ethers.utils.parseUnits(price, 18),
        {
          value: ethers.utils.parseUnits(price, 18),
        }
      );
      await createItem.wait();
      console.log(createItem, "Shipment created successfully");
    } catch {
      console.log("Error while creating Shipment");
    }
  };

  const getAllShipments = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);

      const shipments = await contract.getAllTransactions();
      const allShipments = shipments.map((shipment) => {
        return {
          receiver: shipment.receiver,
          pickupTime: shipment.pickupTime.toNumber(),
          distance: shipment.distance,
          price: ethers.utils.formatEther(shipment.price.toString()),
          status: shipment.status,
          isPaid: shipment.isPaid,
          deliveryTime: shipment.deliveryTime.toNumber(),
        };
      });
      return allShipments;
    } catch {
      console.log("Error while getting Shipment");
    }
  };

  const getShipmentCount = async () => {
    try {
      if (!window.ethereum) {
        return "Install Metamask";
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipmentCount = await contract.getShipmentCount(accounts[0]);
     
      return shipmentCount.toNumber();
    } catch {
      console.log("Error while getting Shipment count");
    }
  };
  const completeShipment = async (completeShip) => {
    console.log(completeShip);

    const { receiver, index } = completeShip;

    try {
      if (!window.ethereum) {
        return "Install Metamask";
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const transaction = await contract.completeShipment(
        accounts[0],
        receiver,
        index,
        {
          gasLimit: 300000,
        }
      );
      await transaction.wait();
      console.log(transaction, "Shipment completed successfully");
    } catch (error) {
      console.log("Error while completing Shipment");
    }
  };

  const getShipment = async (index) => {
    try {
      if (!window.ethereum) {
        return "Install Metamask";
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);

      const shipment = await contract.getShipment(accounts[0], index * 1);
      const singleShipment = {
        sender: shipment[0],
        receiver: shipment[1],
        pickupTime: shipment[2].toNumber(),
        deliveryTime: shipment[3].toNumber(),
        distance: shipment[4].distance,
        price: ethers.utils.formatEther(shipment[5].toString()),
        status: shipment[6],
        isPaid: shipment[7],
      };

      return singleShipment;
    } catch (error) {
      console.log("Error while getting Shipment");
    }
  };

  const startShipment = async (getProduct) => {
    const { receiver, index } = getProduct;
    try {
      if (!window.ethereum) {
        return "Install Metamask";
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const shipment = await contract.startShipment(
        accounts[0],
        receiver,
        index * 1
      );
      await shipment.wait();
      console.log(shipment, "Shipment started successfully");
    } catch (error) {
      console.log("Error while getting Shipment");
    }
  };

  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) {
        return "Install Metamask";
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        console.log(accounts, 'accounts')
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log("Error while getting Shipment");
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        return "Install Metamask";
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error while connecting wallet");
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <TrackingContext.Provider
      value={{
        createShipment,
        getAllShipments,
        getShipmentCount,
        completeShipment,
        getShipment,
        startShipment,
        checkIfWalletConnected,
        connectWallet,
        currentAccount,
        DappName
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
