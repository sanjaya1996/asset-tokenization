import React, { Component } from 'react';
import MyToken from './build/MyToken.json';
import MyTokenSale from './build/MyTokenSale.json';
import Kyc from './build/KycContract.json';
import getWeb3 from './getWeb3';

import './App.css';

class App extends Component {
  state = { loaded: false, tokenSaleAddress: null, userTokens: 0 };

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

      console.log('Token address: ', MyToken.networks[this.networkId].address);

      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] &&
          MyTokenSale.networks[this.networkId].address
      );

      this.kycInstance = new this.web3.eth.Contract(
        Kyc.abi,
        Kyc.networks[this.networkId] && Kyc.networks[this.networkId].address
      );

      this.listenToTokenTransfer();
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        {
          loaded: true,
          tokenSaleAddress: MyTokenSale.networks[this.networkId].address,
        },
        this.updateUserTokens
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  updateUserTokens = async () => {
    let userTokens = await this.tokenInstance.methods
      .balanceOf(this.accounts[0])
      .call();
    this.setState({ userTokens });
  };

  listenToTokenTransfer = () => {
    this.tokenInstance.events
      .Transfer({ to: this.accounts[0] })
      .on('data', this.updateUserTokens);
  };

  handleInputChange = (e) => {
    const target = e.target;
    const value = target.value === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  handleBuyTokens = async () => {
    await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({
      from: this.accounts[0],
      value: this.web3.utils.toWei('1', 'wei'),
    });
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
        <h2>Buy Tokens</h2>
        <p>
          If you want to buy tokens, send wei to this address:{' '}
          {this.state.tokenSaleAddress}
        </p>
        <p>You currently have: {this.state.userTokens} CAPPU Tokens</p>
        <button type='button' onClick={this.handleBuyTokens}>
          Buy more tokens
        </button>
      </div>
    );
  }
}

export default App;
