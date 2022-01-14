import {ML} from 'benchmarks/atlas-ml.js'


//1500
export function Knn_bench(size){
  var train_dataset = new Array(size);

  for(let i=0;i<size;i++){
    train_dataset[i] = new Array(3);
    for(let j=0;j<3;j++){
      train_dataset[i][j] = j+i;
    }
  }
  var train_labels = new Array(size);
  for(let i=0;i<size;i++){
    train_labels[i] = i%2;
  }


	var knn = new ML.KNN(train_dataset, train_labels, {k:2})

 var test_dataset = new Array(size);

  for(let i=0;i<size;i++){
    test_dataset[i] = new Array(3);
    for(let j=0;j<3;j++){
      test_dataset[i][j] = j;
    }
  }
    // print('aboutto')
  	var ans = knn.predict(test_dataset)
  	// console.log(ans)
}
// Knn_bench(1500)
