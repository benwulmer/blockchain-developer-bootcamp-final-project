import React, { Component } from "react";
import PayItBackwardContract from "./contracts/PayItBackward.json";
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
      const instance = new web3.eth.Contract(
        PayItBackwardContract.abi,
        '0xE0EDe3a0cE45c58f190382E92237fCc6Bc3c92A9'
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
    if (parseInt(this.state.inputValue, 10) < 100) {
      this.setState({supplementalMessage: "Must send at least 100 wei"});
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
    try {
      await contract.methods.send().send({ from: accounts[0], value: value });
      await this.updatePreviousAmountSent();
      this.setState({supplementalMessage: "Successfully sent transaction"});
    } catch (error) {
      this.setState({supplementalMessage: "Unable to process transaction"});
    }
  }

  updatePreviousAmountSent = async () => {
    const contract = this.state.contract;
    const response = await contract.methods.getPreviousAmountSent().call();
    this.setState({ previousAmountSent: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Pay it Backward!</h1>
        <div>Strangers helping strangers! In a similar vein to buying cofee for the person behind you in line, feel free to donate crypto to the previous sender.</div>
        <div>
          <input value={this.state.inputValue} placeholder="amount (in wei)" onChange={evt => this.updateInputValue(evt)}/>
        </div>
        <button onClick={this.handleClick.bind(this)}>Pay it Backward</button>
        <div>{this.state.supplementalMessage}</div>
        <div>Previous amount sent: {this.state.previousAmountSent}</div>
      </div>
    );
  }
}

export default App;
