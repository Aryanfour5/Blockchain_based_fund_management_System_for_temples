import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Donate.css';

const Donate = () => {
    const [account, setAccount] = useState(null);
    const [amount, setAmount] = useState('0.01');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
    const [transactionSuccess, setTransactionSuccess] = useState(false); // Success flag
    const navigate = useNavigate(); // useNavigate hook for redirection

    useEffect(() => {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            setIsMetaMaskAvailable(true);
        } else {
            setIsMetaMaskAvailable(false);
            alert('MetaMask is not installed! Please install it to use this application.');
        }
    }, []);

    const connectMetaMask = async () => {
        if (!window.ethereum) {
            alert('MetaMask is not installed! Please install it.');
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            console.log('Connected account:', accounts[0]);
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            alert('Failed to connect MetaMask. Please try again.');
        }
    };

    const handleRecipientSelect = (event) => {
        const selectedValue = event.target.value;
        switch (selectedValue) {
            case 'temple1':
                setRecipientAddress('0x3D0a7b23B0b245203CfB39af68e62E6A915DcAaF');
                break;
            case 'temple2':
                setRecipientAddress('0x3D0a7b23B0b245203CfB39af68e62E6A915DcAaF');
                break;
            default:
                setRecipientAddress('');
        }
    };

    const handleSendTransaction = async () => {
        if (!window.ethereum) {
            alert('MetaMask is not installed! Please install it.');
            return;
        }
    
        if (!account) {
            alert('Please connect your wallet first!');
            return;
        }
    
        if (!recipientAddress || !amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount and select a recipient.');
            return;
        }
    
        setLoading(true); // Set loading to true when the transaction is being processed
    
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
            const transaction = {
                to: recipientAddress,
                value: ethers.utils.parseEther(amount),
                gasLimit: ethers.utils.hexlify(21000), // Set manual gas limit
            };
    
            console.log('Sending transaction:', transaction);
    
            const txResponse = await signer.sendTransaction(transaction);
            console.log('Transaction sent:', txResponse);
    
            alert('Transaction sent! Waiting for confirmation...');
            const receipt = await txResponse.wait();
            console.log('Transaction confirmed:', receipt);
    
            alert('Transaction confirmed!');
    
            setTransactionSuccess(true); // Set transaction success flag
            setLoading(false); // Stop loading
    
            // Extract transaction details
            const transactionDetails = {
                transactionHash: receipt.transactionHash,
                senderAddress: account,
                recipientAddress,
                donationAmount: amount,
                timestamp: new Date().toISOString(), // Current timestamp
            };

            console.log("Transaction hash:", receipt.transactionHash);
            
            // Save to the database
            const response = await fetch('http://localhost:5000/donate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionDetails),
            });
    
            if (response.ok) {
                alert('Donation details saved successfully!');
            } else {
                const errorData = await response.json();
                alert(`Failed to save donation details: ${errorData.message}`);
            }

            // Redirect to login page after successful transaction
            navigate('/login'); // Redirect to login page

        } catch (error) {
            console.error('Error sending transaction:', error);
            alert(`Transaction failed: ${error.message}`);
            setLoading(false); // Stop loading on error
        }
    };

    return (
        <div className="container">
            <h1>Donate</h1>

            {!account ? (
                <button onClick={connectMetaMask}>Connect Wallet</button>
            ) : (
                <p>Connected: {account}</p>
            )}

            {account && !loading && !transactionSuccess && (
                <div>
                    <form>
                        <select onChange={handleRecipientSelect}>
                            <option value="">Select a recipient</option>
                            <option value="temple1">SIT Ganesh Temple </option>
                            <option value="temple2">SIT Devi TEMPLE</option>
                        </select>

                        <label htmlFor="amount">Amount (ETH):</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount in ETH"
                        />

                        <button type="button" onClick={handleSendTransaction}>
                            Send
                        </button>
                    </form>
                </div>
            )}

            {loading && (
                <div className="loading">
                    <h2>Processing your donation...</h2>
                    <p>Please wait while we confirm your transaction.</p>
                </div>
            )}

            {transactionSuccess && (
                <div className="thank-you">
                    <h2>Thank you for your generous donation!</h2>
                    <p>Your transaction has been successfully completed.</p>
                </div>
            )}
        </div>
    );
};

export default Donate;
