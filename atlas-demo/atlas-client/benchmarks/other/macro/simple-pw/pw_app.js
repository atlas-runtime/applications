import {Records} from 'benchmarks/macro/simple-pw/records.js'
import * as std from 'std'


const record = new Records();

function pw_create(title, username, password){

  if(!title || !username || !password){
        print('wrong args at create');
        std.exit()
      }
      let isAdded = record.add(title, username, password);
      if (isAdded) {
        // print('Record created.');
        // print(JSON.stringify(record))
      } else {
        // print('Record title already exists.');
      }
}

function pw_createdb(title, username, password){

  for (let i = 0; i < Number(title); i++) {
    record.add('title' + i, 'username' + i, 'password' + i);
  }
}


function pw_update(index, title, username, password){

  if(!title || !username || !password){
        print('wrong args at update');
        std.exit()
      }

      let isUpdated = record.update(index, title, username, password);
/*
      if (isUpdated) {
        // print('Record updated.');
      } else {
        // print('Record title does not exist.');
      }
*/

}

function pw_updaten(title, username, password){

  let end = password
  let index = title
  let size = username
  for (let k = 0; k < end; k++) {
    pw_update((k+index)%size, 'title' + (k + index)%size, 'username' + (k + index)%size, 'password' + (k + index)%size);
  }
}

function pw_delete(title, username, password){

  if(!title){
    print('wrong title at delete');
    std.exit()
  }

  let isDeleted = record.delete(title);
  if (isDeleted) {
  // print('Record deleted.');
  } else {
    // print('Record title does not exist.');
  }
}

function pw_deleten(title, username, password){

  let end = password
  let index = title
  let size = username
  for (let k = 0; k < end; k++) {
    pw_delete('title' + (k + index)%size, 'username' + (k + index)%size, 'password' + (k + index)%size);
  }
}


function pw_all(){
  let results = record.getAll();
  if (results.length === 0) {
    // print('No records.');
  } else {
    for (let result of results) {
      //record.log(result);
      //print('-------');
    }
  }
}

function pw_read(index, title){
  if(!title){
    print('wrong title at read');
    std.exit()
  }
  let results = record.get(index, title);
/*
  if (results.length === 0) {
    // print('Record does not exist.');
  } else {
    record.log(results);
  }
*/
}



function pw_readn(title, username, password){

  let end = password
  let index = title
  let size = username
  for (let k = 0; k < end; k++) {
    pw_read((k+index)%size, 'title' + (k + index)%size)
  }
}

let pw_exec = {};
pw_exec.pw_create = pw_create;
pw_exec.pw_update = pw_update;
pw_exec.pw_delete = pw_delete;
pw_exec.pw_deleten = pw_deleten;
pw_exec.pw_read = pw_read;
pw_exec.pw_all = pw_all;
pw_exec.pw_createdb = pw_createdb;
pw_exec.pw_updaten = pw_updaten;
pw_exec.pw_readn = pw_readn;
export {pw_exec};


