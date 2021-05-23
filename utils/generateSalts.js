const getRandomValues = require("get-random-values");
var getRandom = function (min, max) {
  var rval = 0;
  var range = max - min;

  var bits_needed = Math.ceil(Math.log2(range));
  if (bits_needed > 53) {
    throw new Exception("We cannot generate numbers larger than 53 bits.");
  }
  var bytes_needed = Math.ceil(bits_needed / 8);
  var mask = Math.pow(2, bits_needed) - 1;
  // 7776 -> (2^13 = 8192) -1 == 8191 or 0x00001111 11111111

  // Create byte array and fill with N random numbers
  var byteArray = new Uint8Array(bytes_needed);
  getRandomValues(byteArray);

  var p = (bytes_needed - 1) * 8;
  for (var i = 0; i < bytes_needed; i++) {
    rval += byteArray[i] * Math.pow(2, p);
    p -= 8;
  }

  // Use & to apply the mask and reduce the number of recursive lookups
  rval = rval & mask;

  if (rval >= range) {
    // Integer out of acceptable range
    return getRandom(min, max);
  }
  // Return an integer that falls within the range
  return min + rval;
};

var getRandomChar = function () {
  var minChar = 33; // !
  var maxChar = 126; // ~
  var char = String.fromCharCode(getRandom(minChar, maxChar));
  if (
    ["'", '"', "\\"].some(function (badChar) {
      return char === badChar;
    })
  ) {
    return getRandomChar();
  }

  return char;
};

var generateSalt = function () {
  return Array.apply(null, Array(64)).map(getRandomChar).join("");
};

var generateEnvLine = function (mode, key) {
  var salt = generateSalt();
  switch (mode) {
    case "yml":
      return key.toLowerCase() + ': "' + salt + '"';
    default:
      return key.toUpperCase() + "='" + salt + "'";
  }
};

generateFile = function (mode, keys) {
  return keys.map(generateEnvLine.bind(null, mode)).join("\n");
};

var keys = [
  "AUTH_KEY",
  "SECURE_AUTH_KEY",
  "LOGGED_IN_KEY",
  "NONCE_KEY",
  "AUTH_SALT",
  "SECURE_AUTH_SALT",
  "LOGGED_IN_SALT",
  "NONCE_SALT",
];

module.exports = () => generateFile("env", keys);
