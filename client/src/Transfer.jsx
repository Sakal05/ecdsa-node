import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256.js";
import SHA256 from "crypto-js/sha256";
import { keccak256 } from "ethereum-cryptography/keccak.js";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  function bigIntReplacer(key, value) {
    if (typeof value === "bigint") {
      return value.toString() + 'n';
    }
    return value;
  }

  const setValue = (setter) => (evt) => setter(evt.target.value);

  function signMessage(message, privateKey) {
    const signature = secp256k1.sign(message, privateKey);
    console.log("Signature: ", signature);
    return signature;
  }

  function hashMessage(message) {
    return (SHA256(message)).toString();
    // return keccak256(utf8ToBytes(message)).toString();
  }

  async function transfer(evt) {
    evt.preventDefault();

    let sender = secp256k1.getPublicKey(address);
    sender = toHex(sender);
    const messageToSign = hashMessage(
      `${sender}${sendAmount}${recipient}`
    );

    console.log("Message: ", messageToSign);
    const signature = signMessage(messageToSign, address);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        // sender: address,
        amount: parseInt(sendAmount),
        recipient,
        message: messageToSign,
        privateKey: address,
        signature: JSON.stringify(signature, bigIntReplacer)
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
      alert(ex.response);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
