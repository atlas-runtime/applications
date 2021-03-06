import {wrapObject as wrapper} from './atlas-wrapper.js'
import {NQueen_bench as NQueen_asd} from './benchmarks/micro/Backtracking/NQueen.js'
let NQueen_bench = wrapper(NQueen_asd)
NQueen_bench(20)
NQueen_bench(20)
NQueen_bench(20)
NQueen_bench(20)
NQueen_bench(20)
NQueen_bench(20)
NQueen_bench(20)
NQueen_bench(20)
NQueen_bench(20)
NQueen_bench(20)
print('*NQueen done*')
import {Queue_bench as Queue_asd} from './benchmarks/micro/Data-Structures/Queue.js'
let Queue_bench = wrapper(Queue_asd)
Queue_bench(30000)
Queue_bench(30000)
Queue_bench(30000)
Queue_bench(30000)
Queue_bench(30000)
Queue_bench(30000)
Queue_bench(30000)
Queue_bench(30000)
Queue_bench(30000)
Queue_bench(30000)
print('*Queue done*')
import {SingleCircularLinkedList_bench as SingleCircularLinkedList_asd} from './benchmarks/micro/Data-Structures/SingleCircularLinkedList.js'
let SingleCircularLinkedList_bench = wrapper(SingleCircularLinkedList_asd)
SingleCircularLinkedList_bench(10000)
SingleCircularLinkedList_bench(10000)
SingleCircularLinkedList_bench(10000)
SingleCircularLinkedList_bench(10000)
SingleCircularLinkedList_bench(10000)
SingleCircularLinkedList_bench(10000)
SingleCircularLinkedList_bench(10000)
SingleCircularLinkedList_bench(10000)
SingleCircularLinkedList_bench(10000)
SingleCircularLinkedList_bench(10000)
print('*SingleCircularLinkedList done*')
import {LongestIncreasingSubsequence_bench as LongestIncreasingSubsequence_asd} from './benchmarks/micro/Dynamic-Programming/LongestIncreasingSubsequence.js'
let LongestIncreasingSubsequence_bench = wrapper(LongestIncreasingSubsequence_asd)
LongestIncreasingSubsequence_bench(10000)
LongestIncreasingSubsequence_bench(10000)
LongestIncreasingSubsequence_bench(10000)
LongestIncreasingSubsequence_bench(10000)
LongestIncreasingSubsequence_bench(10000)
LongestIncreasingSubsequence_bench(10000)
LongestIncreasingSubsequence_bench(10000)
LongestIncreasingSubsequence_bench(10000)
LongestIncreasingSubsequence_bench(10000)
LongestIncreasingSubsequence_bench(10000)
print('*LongestIncreasingSubsequence done*')
import {ZeroOneKnapsack_bench as ZeroOneKnapsack_asd} from './benchmarks/micro/Dynamic-Programming/ZeroOneKnapsack.js'
let ZeroOneKnapsack_bench = wrapper(ZeroOneKnapsack_asd)
ZeroOneKnapsack_bench(10000)
ZeroOneKnapsack_bench(10000)
ZeroOneKnapsack_bench(10000)
ZeroOneKnapsack_bench(10000)
ZeroOneKnapsack_bench(10000)
ZeroOneKnapsack_bench(10000)
ZeroOneKnapsack_bench(10000)
ZeroOneKnapsack_bench(10000)
ZeroOneKnapsack_bench(10000)
ZeroOneKnapsack_bench(10000)
print('*ZeroOneKnapsack done*')
