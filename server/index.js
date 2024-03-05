const express = require("express");
const app = express();
const cors = require("cors");
// const signMessage = require("../utils/sign-message");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "03f6821a8e94e0fa006e883b216ed8099ff05d7cef9ca5fad025f071fa9eca27a8": 100,
  "029a3ffaae9cdcf61fbccdd4afb966dbf7536664838132b5fc649b122ba3977bd7": 50,
  "038eeca34330eaaf19346cb5c978b3d3574d133b98a9531db759c743afdbc7e15e": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  let sender = secp256k1.getPublicKey(address);
  sender = toHex(sender);

  const balance = balances[sender] || 0;

  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount, message, privateKey, signature } = req.body;
  // console.log()

  // setInitialBalance(sender);
  // setInitialBalance(recipient);
  let sender = secp256k1.getPublicKey(privateKey);
  sender = toHex(sender);
  // const signatureBuffer = Buffer.from(signature, 'hex');
  const parsedSignature = JSON.parse(signature, bigIntReviver);

  // Now you can access the properties of the signature object
  console.log('Parsed Signature: ', parsedSignature);

  console.log("Sender pub: " + sender);

  // console.log("Signature pub:\n r: " + signature.r + "\ns: " + signature.s);

  if (!isSigned(parsedSignature, message, sender)) {
    res.status(400).send({ message: "Invalid Signature!" });
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

const isSigned = (signature, messageHash, publicKey) => {
  const signed_status = secp256k1.verify(signature, messageHash, publicKey);
  console.log(`Signed: ${signed_status}`);
  return signed_status;
};

function bigIntReviver(key, value) {
  if (typeof value === 'string' && /^\d+n$/.test(value)) {
    return BigInt(value.slice(0, -1));
  }
  return value;
}