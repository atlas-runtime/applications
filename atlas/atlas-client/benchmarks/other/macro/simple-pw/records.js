import * as std from 'std'
import {Password} from './password.js'

    let z = 0


class Records {
  constructor() {
    this.password = new Password();
    this.existingRecords = [];
  }

  add(title, username, password) {

    let newRecord = {
      title,
      username,
      password: password,//this.password.encrypt(password)

    };

    let duplicates = this.existingRecords.filter(rec => rec.title === title);

    if (duplicates.length === 0) {

      this.existingRecords.push(newRecord);
  
      this.password.evalStrength(password);
      return true;

    } else {
      // print('duplicates')
      return false;
    }
  }

  get(index, title) {
    let results = this.existingRecords[index] //.filter(rec => rec.title === title);
/*
    let tmp_res = {};
    if (results.length !== 0) {
      tmp_res.title = results[0].title;
      tmp_res.username = results[0].username;
      tmp_res.password = results[0].password//this.password.decrypt(results[0].password);
    }
    return tmp_res;
*/
    return results
  }

  getAll() {

    let tmp = this.existingRecords;
    let decrypted = [];

    for (let record of tmp) {
      if(record){
        let tmp_rec = {}; 
        tmp_rec.title = record.title;
        tmp_rec.username = record.username
        tmp_rec.password = record.password//this.password.decrypt(record.password);
        decrypted.push(tmp_rec);
      }
    }
    return decrypted;
  }
  update(index, title, username, pass) {

    let isUpdated = false;
    let new_rec;
    let res = this.get(index, title)
    if (res != {}) {
        res.username = username
        res.password = pass   
        this.existingRecords[index] = res
    }
/*
    for (let record of this.existingRecords) {
    print(record)
      if (record.title === title && record.username === username) {
        // record.username = username;
        record.password = pass;//this.password.encrypt(pass);
        isUpdated = true;
        break;
      }
    }
*/
    return isUpdated;
  }

  delete(title) {

    let isDeleted = false;
    let resultRecords = this.existingRecords.filter(rec => rec.title !== title);

    if (this.existingRecords.length > resultRecords.length) {
      this.existingRecords = resultRecords;
      isDeleted = true;
    }
    return isDeleted;
  }

  log(rec) {
    // console.log('Title: ' + rec.title);
    // console.log('Username: ' + rec.username);
    // console.log('Password: ' + rec.password);
  }
}

export {Records};
