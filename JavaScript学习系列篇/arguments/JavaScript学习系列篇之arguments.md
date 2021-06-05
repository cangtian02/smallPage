# JavaScript学习系列篇之arguments

## 描述
`arguments`对象不是一个Array 。它类似于Array，但除了长度之外没有任何Array属性。例如，它没有 pop 方法。但是它可以被转换为一个真正的Array：
``` bash
var args = Array.prototype.slice.call(arguments);
var args = [].slice.call(arguments);
// ES2015语法
const args = Array.from(arguments);
```
typeof arguments返回的是'object';

## 属性

`arguments.callee`
    指向当前执行的函数
`arguments.length`
    指向传递给当前函数的参数数量
    
## 示例

使用`arguments.callee`我们可以实现你个递归，比如我们来实现一个阶乘函数
``` bash
var factorial = function(x) {
	if (x < 2) {
		return 1;
	} else {
		return x * arguments.callee(x - 1);
	}
}
console.log(factorial(5)); // 120 (5 * 4 * 3 * 2 * 1)
```
或者我们实现一个n = 10,不使用for循环就输出[1,2,3,4,5,6,7,8,9,10]数组，这个时候也可以利用`arguments.callee`使用递归来实现
``` bash
function callArray(n) {
    var arr = [];
    return (function () {
        arr.unshift(n);
        n--;
        if (n != 0) {
            arguments.callee();
        }
        return arr;
    })()
}
callArray(10); // [1,2,3,4,5,6,7,8,9,10]
```
### 实现思路
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;首先现在函数中命名一个局部变量空数组arr，再return一个匿名函数。在匿名函数中，首先在空数组arr头部插入元素n，这个时候arr是[10],按照输出格式，我们接着是n--，要插入9到数组头部，所以在n不等于0之前，都将使用`arguments.callee()`来调用匿名函数本身，达到一个递归效果，当从10执行到1时，return出arr数组，整个函数执行结束，输出[1,2,3,4,5,6,7,8,9,10]。
### 存在问题
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`arguments.callee()`在ES2015后就不提倡使用了，参考：[Why was the arguments.callee.caller property deprecated in JavaScript?](https://stackoverflow.com/questions/103598/why-was-the-arguments-callee-caller-property-deprecated-in-javascript/235760#235760),我们可以了解到，去掉它几乎不会影响功能的实现，而且还能得到性能提升，在早期版本的JavaScript不允许使用命名函数表达式，因此我们无法进行递归函数表达式，为了解决这个问题，arguments.callee我们可以做到这一点。但是，到了现代浏览器上，这是个不好的解决方案，访问`arguments`是个昂贵的操作，因为它是个很大的对象，每次递归调用都需要重新创建，这个时候就会影响到现代浏览器的性能，在严格模式中`arguments.callee()`是禁止使用的。所以在这个时候，我们可以换个思路实现上面的需求，给内嵌的函数起个名字，不再调用匿名函数。
``` bash
function callArray(n) {
    var arr = [];
    return (function fn() {
        arr.unshift(n);
        n--;
        if (n != 0) {
            fn();
        }
        return arr;
    })()
}
callArray(10); // [1,2,3,4,5,6,7,8,9,10]
```
使用`arguments.length`我们可以实现一个检查传入参数个数的正确性
``` bash
function check(args) {
	var actual = args.length;
	var expected = args.callee.length;
	if (actual != expected) {
		throw new Error('参数个数有无：期望值：' + expected + '；实际值：' + actual);
	}
}
function fn(x, y, z) {
	check(arguments);
	console.log(x + y + z);
}
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好，我们现在先执行`fu();`试试。我们发现控制台已经报错了，已经抛出了我们输出的异常，期望值3，实际值0；因为fn函数接收x，y，z三个参数，而执行`fn();`没有传入一个参数，所以会抛出异常。我们再执行`fn(1,2,3)`试试，这个时候就输出6了，说明check函数生效。
### 注意
`arguments.length`表示的是实际传入的参数个数，而不是声明的参数个数，同时该属性没有任何Array.length属性的特殊行为。
## ES2015扩展操作符
``` bash
function func() { 
	console.log(...arguments);
} 
func(1, 2, 3); // 1 2 3
```
ES2015扩展操作符可以将arguments展开成独立的参数。
    






