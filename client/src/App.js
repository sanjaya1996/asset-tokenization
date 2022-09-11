import React, { Component } from 'react';
import MyToken from './contracts/MyToken.json';
import MyTokenSale from './contracts/MyTokenSale.json';
import Kyc from './contracts/KycContract.json';
import getWeb3 from './getWeb3';

import './App.css';

class App extends Component {
  state = { loaded: false };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.tokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] &&
          MyToken.networks[this.networkId].address
      );

      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] &&
          MyTokenSale.networks[this.networkId].address
      );

      this.kycInstance = new this.web3.eth.Contract(
        Kyc.abi,
        Kyc.networks[this.networkId] && Kyc.networks[this.networkId].address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded: true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  handleInputChange = (e) => {
    const target = e.target;
    const value = target.value === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  handleKycWhitelisting = async () => {
    await this.kycInstance.methods
      .setKycCompleted(this.state.kycAddress)
      .send({ from: this.accounts[0] });
    alert(`KYC for ${this.state.kycAddress} is completed`);
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className='App'>
        <h1>StarDucks Cappucino Token Sale</h1>
        <p>GEt your Tokens today!</p>
        <h2>Kyc whitlisting</h2>
        Address to allow:
        <input
          type='text'
          name='kycAddress'
          value={this.state.kycAddress}
          onChange={this.handleInputChange}
        />
        <button type='button' onClick={this.handleKycWhitelisting}>
          Add to Whitelist
        </button>
      </div>
    );
  }
}

export default App;
