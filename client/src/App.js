import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { previousAmountSent: 0, web3: null, accounts: null, contract: null, inputValue: "", supplementalMessage: "" };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.updatePreviousAmountSent, this.sendValue);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }

  handleClick(event) {
    if (isNaN(this.state.inputValue) || this.state.inputValue.length === 0) {
      this.setState({supplementalMessage: "Must input a number"});
      return;
    }
    this.setState({supplementalMessage: ""});
    const input = this.state.inputValue;
    this.sendValue(input);
    this.setState({inputValue: ""});
  }

  sendValue = async (value) => {
    const accounts = this.state.accounts;
    const contract = this.state.contract;
    console.log("about to send");
    console.log(value);
    await contract.methods.set(value).send({ from: accounts[0] });
    await this.updatePreviousAmountSent();
  }

  updatePreviousAmountSent = async () => {
    const contract = this.state.contract;
    const response = await contract.methods.get().call();
    this.setState({ previousAmountSent: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Pay it Backward!</h1>
        <div>
          <input value={this.state.inputValue} placeholder="amount (in wei)" onChange={evt => this.updateInputValue(evt)}/>
        </div>
        <button onClick={this.handleClick.bind(this)}>Pay it Backward</button>
        <div>{this.state.supplementalMessage}</div>
      </div>
    );
  }
}

export default App;
