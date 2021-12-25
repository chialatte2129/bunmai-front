export const rsa_encypted = {
    export_pub_key,
    export_pri_key,
    rsa_encrypt,
    rsa_decrypt
  }

function export_pub_key(){
    var public_key = "\
    -----BEGIN PUBLIC KEY-----\
    -----END PUBLIC KEY-----"
    return public_key
}

function export_pri_key(){
    var private_key ="\
    -----BEGIN RSA PRIVATE KEY-----\
    -----END RSA PRIVATE KEY-----"
    return private_key
}

function rsa_encrypt(pub_key, param){
    let jse = new JSEncrypt();
    jse.setPublicKey(pub_key);
    return jse.encrypt(param);
}

function rsa_decrypt(pri_key, cipher){
    let jse = new JSEncrypt();
    jse.setPrivateKey(pri_key);
    return jse.decrypt(cipher);
}