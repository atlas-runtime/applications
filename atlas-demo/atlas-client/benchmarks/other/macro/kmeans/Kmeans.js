import {ML} from 'benchmarks/atlas-ml.js'

//3000

export function Kmeans_bench(size){
  var data = new Array(size);

  for(let i=0;i<size;i++){
    data[i] = new Array(3);
    for(let j=0;j<3;j++){
      data[i][j] = j;
    }
  }
  var centers = new Array(size);
  for(let i=0;i<size;i++){
    centers[i] = new Array(3);
    for(let j=0;j<3;j++){
      centers[i][j] = j;
    }
  }
	// print("aobut")
	let ans = ML.KMeans(data, size, { initialization: centers });
	// console.log(JSON.stringify(ans));
}
// Kmeans_bench(3000)
