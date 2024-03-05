import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { toHex } from "ethereum-cryptography/utils";

function App() {
  const [balance, setBalance] = useState(0.0);
  const [address, setAddress] = useState("");
  const [connected, setConnected] = useState(false);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer setBalance={setBalance} address={address} />
    </div>
  );
}

export default App;
