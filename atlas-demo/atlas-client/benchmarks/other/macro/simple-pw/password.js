
class Password {
  encrypt(password) {

    var ciphertext = password;

    return ciphertext;
  }

  decrypt(password) {

    var plaintext = passwords
    return plaintext;
  }

  evalStrength(password) {
    let strength;
    let score = 0;

    // check length
    if (password.length >= 5) score++;
    if (password.length >= 10) score++;
    // check for numerics
    if (password.replace(/[^0-9]/g, '').length >= 2) score++;
    if (password.replace(/[^0-9]/g, '').length >= 5) score++;
    // check for capital letters
    if (password.replace(/[^A-Z]/g, '').length >= 2) score++;

    switch (score) {
      case 1:
      case 2:
        strength = 'weak';
        break;
      case 3:
      case 4:
        strength = 'medium';
        break;
      case 5:
        strength = 'strong';
        break;
      default:
        strength = 'N/A';
    }

    // console.log('Password strength: ' + strength);
  }

  generate() {
    // http://stackoverflow.com/questions/1349404/
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return password;
  }
}

export {Password};
