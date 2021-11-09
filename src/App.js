import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from "./lottery.js";

class App extends React.Component {
  state = {
    manager: "",
    players: [],
    totalPlayersPlaying: 0,
    balance: "",
    bettingAmount: "",
    message: "",
  };

  async componentDidMount() {
    // note that here in the call we do not need to specific the from:accounts[0].... reason: while using the local copy by default the first account of metamask is used (or whichever account is set as default in metamask)
    // note that this applies for 'call'  ... not for 'send'
    const manager = await lottery.methods.manager().call();
    const players = lottery.methods.getPlayers().call();

    // the address is the address of the lottery contract
    // the balance is the balance of the contract
    const balance = await web3.eth.getBalance(lottery.options.address);

    const totalPlayersPlaying = players.length;

    this.setState({ manager, players, balance, totalPlayersPlaying });
  }

  onEnter = async (event) => {
    event.preventDefault();

    this.setState({
      message: "Hold on... loading... waiting for transaction success... ",
    });

    const accounts = await web3.eth.getAccounts();

    await lottery.methods.enter().send({
      // we are assuming that the first account of metamask is the one that we are going to use to enter into the lottery
      from: accounts[0],
      value: web3.utils.toWei(this.state.bettingAmount, "ether"),
    });

    this.setState({
      message: "Yo! Successfully entered the lottery. Keep gambling! ",
    });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({
      message: "Hold on... loading... waiting for transaction success... ",
    });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({
      message: "Picked your winner... Enjoy ",
    });
  };

  render() {
    web3.eth.getAccounts().then(console.log);

    return (
      <div className="App">
        <h2>Lottery</h2>

        <p>The manager of the contract is: {this.state.manager}</p>
        <p>
          Total players in the lottery are: {this.state.totalPlayersPlaying}
        </p>
        <p>
          Total lottery you can win:{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether
        </p>

        <hr />

        <form onSubmit={this.onEnter}>
          <h4>Try your luck</h4>
          <div>
            <label>Amount of ether you will bet with: </label>

            <input
              value={this.state.bettingAmount}
              onChange={(event) =>
                this.setState({ bettingAmount: event.target.value })
              }
            />
          </div>

          <button>Enter</button>
        </form>

        <hr />

        <h3>{this.state.message}</h3>

        <hr />

        <h4>GO pick a winner man</h4>
        <button onClick={this.onClick}>Pick winner</button>

        <hr />
      </div>
    );
  }
}
export default App;
