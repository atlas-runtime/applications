import {ML} from 'benchmarks/atlas-ml.js'
//regression
export function DecisionTree_bench(size){
	//auto pernei wra gia panw apo 1000
	let  x = new Array(size);
	let  y = new Array(size);
	let val = 0.0;
	for (let i = 0; i < x.length; ++i) {
	  x[i] = val;
	  y[i] = Math.sin(x[i]);
	  val += 0.01;
	}
	const reg = new ML.DecisionTreeRegression();

	reg.train(x, y);
	const estimations = reg.predict(x);
}
// DecisionTree_bench(2500)
