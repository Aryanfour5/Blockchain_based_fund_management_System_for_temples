import React, { useState, useEffect } from "react";
import './Transaction.css'; // Ensure correct path to your CSS file

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  // Updated transaction data with timestamps in 2023 and 2024
  const sampleTransactions = [
    {
      sender: "SIT Ganesh Temple",
      receiver: "0x1234567890abcdef1234567890abcdef12345678",
      timestamp: 1682937600, // Corresponds to May 1, 2023
      purpose: "Donation for temple renovation",
      amount: "0.5 ETH",
    },
    {
      sender: "SIT Devi Temple",
      receiver: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcde",
      timestamp: 1704057600, // Corresponds to January 1, 2024
      purpose: "Charity fund donation",
      amount: "0.3 ETH",
    },
    {
      sender: "SIT Ganesh Temple",
      receiver: "0x9876543210abcdef9876543210abcdef98765432",
      timestamp: 1688208000, // Corresponds to July 1, 2023
      purpose: "Event sponsorship",
      amount: "0.1 ETH",
    },
    {
      sender: "SIT Devi Temple",
      receiver: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcde",
      timestamp: 1706745600, // Corresponds to February 1, 2024
      purpose: "Festival donation",
      amount: "0.8 ETH",
    },
    {
      sender: "SIT Ganesh Temple",
      receiver: "0x5555555555abcdef5555555555abcdef55555555",
      timestamp: 1690761600, // Corresponds to August 1, 2023
      purpose: "Maintenance fund donation",
      amount: "1.2 ETH",
    },
    {
      sender: "SIT Devi Temple",
      receiver: "0x7777777777abcdef7777777777abcdef77777777",
      timestamp: 1709424000, // Corresponds to March 1, 2024
      purpose: "Charity for disaster relief",
      amount: "0.7 ETH",
    },
    {
      sender: "SIT Ganesh Temple",
      receiver: "0x9999999999abcdef9999999999abcdef99999999",
      timestamp: 1693430400, // Corresponds to September 1, 2023
      purpose: "Festival preparation donation",
      amount: "2.0 ETH",
    },
    {
      sender: "SIT Devi Temple",
      receiver: "0x2222222222abcdef2222222222abcdef22222222",
      timestamp: 1712102400, // Corresponds to April 1, 2024
      purpose: "Educational sponsorship",
      amount: "0.4 ETH",
    },
  ];

  // Set transactions once component mounts
  useEffect(() => {
    setTransactions(sampleTransactions);
  }, []);

  // Group transactions by temple
  const groupedTransactions = transactions.reduce((acc, tx) => {
    if (!acc[tx.sender]) acc[tx.sender] = [];
    acc[tx.sender].push(tx);
    return acc;
  }, {});

  return (
    <div className="transactions-container">
      <h1>Temple Transaction History</h1>

      {Object.entries(groupedTransactions).map(([temple, templeTransactions], index) => (
        <div key={index} className="temple-transaction-section">
          <h2>{temple} Transactions</h2>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Receiver</th>
                <th>Timestamp</th>
                <th>Amount</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {templeTransactions.map((tx, idx) => (
                <tr key={idx}>
                  <td>{tx.receiver}</td>
                  <td>{new Date(tx.timestamp * 1000).toLocaleDateString()}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Transactions;
