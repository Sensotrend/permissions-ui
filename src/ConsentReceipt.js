import { generateSecret, SignJWT } from 'jose';
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';

const PRIVATE_KEY = generateSecret('HS256');

export function download(data, mimetype = 'application/json') {
  const receipt = {
    ...data,
    jti: uuidv4(),
  };
  const filename = `${receipt.jti}.json`;
  const blob = new Blob([receipt], { type: mimetype });
  saveAs(blob, filename);
}

export function downloadSigned(data) {
  const receipt = {
    ...data,
    jti: uuidv4(),
  };
  generateJwtRS256(receipt)
  .then((jwt) => {
    const filename = `${receipt.jti}.jwt`;
    const blob = new Blob([jwt], { type: 'application/jwt' });
    saveAs(blob, filename);
  });
}

function generateJwtRS256(data) {
  return PRIVATE_KEY
  .then((privateKey) => new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(privateKey)
  );
}

// Show the possibility to download the receipt, or to integrate straight with a specific wallet...
function ConsentReceipt() {

}

export default ConsentReceipt;
