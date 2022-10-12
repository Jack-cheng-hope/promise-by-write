function Promise(executor) {

    // 添加属性,(初始状态)
    this.PromiseState = 'pending'
    // 传过来的值
    this.PromiseResult = '';
    // 保存this
    const self = this;
    // 保存的回调函数
    this.callBacks = [];
    // 声明resolve函数
    function resolve(data) {
        // 判断状态,保证状态只能修改一次
        if (self.PromiseState === 'pending') {
            // 这个函数中的this实在Promise实例化后再执行的，
            // 也就是this不是指在当前的作用域，而是在实例化之后作用域，也就是window
            // const self = this; 就是保存当前的this 
            // 修改对象状态（PromiseState）结果为成功
            self.PromiseState = 'fulfilled'
            // console.log(this)
            // 修改对象结果值（PromiseResult）
            self.PromiseResult = data;
            // 保存的回调，改变状态后在执行回调
            // if (self.callBack.onResolved) {
            //     self.callBack.onResolved(data)
            // }
            self.callBacks.forEach(item => {
                item.onResolved(data)
            });
        }


    };
    // 声明reject函数
    function reject(data) {
        // 判断状态,保证状态只能修改一次
        if (self.PromiseState === 'pending') {
            // 修改reject的结果为失败,与resolve的过程相当
            self.PromiseState = 'rejected'
            self.PromiseResult = data;
            // 保存的回调，改变状态后在执行回调
            // if (self.callBack.onRejected) {
            //     self.callBank.onRejected(data)
            // }
            self.callBacks.forEach(item => {
                item.onRejected(data)
            })
        }

    }

    // 同步调用 【执行器函数】
    // 实例化抛出异常也能修改Promise的状态
    // 抛出异常在执行时出现，所以在这里try catch all
    try {
        executor(resolve, reject)
    } catch (e) {
        // console.log(e); // e -> 失败的结果 error
        // 将promise的状态设为是失败
        reject(e)
    }
}

// then 方法,onResolved,onRejected分别是.then的两个回调
Promise.prototype.then = function (onResolved, onRejected) {
    const self = this

    //promise的then返回的结果也是个promise对象
    return new Promise((resolve, reject) => {
        console.log(this);
        function callBack(type) {
            try {
                let res = type(self.PromiseResult)
                if (res instanceof Promise) {
                    res.then(v => {
                        resolve(v)
                    }, r => {
                        reject(r)
                    })
                } else {
                    resolve(res)
                }
            } catch (e) {
                reject(e)
            }
        }
        if (this.PromiseState == 'fulfilled') {
            callBack(onResolved)
            // try {
            //     // console.log(this);
            //     // 成功是处理的结果的值
            //     // 就是resolve传递过来的data，已经赋值给了PromiseResult
            //     let result = onResolved(this.PromiseResult)
            //     // console.log(result, '123');
            //     //then返回的结果必定是一个promise对象，而返回的状态有返回的promise的状态决定的，
            //     // .then的回调函数,判断当前的状态执行那个回调函数
            //     if (result instanceof Promise) {
            //         result.then(v => {
            //             resolve(v)
            //         }, r => {
            //             reject(r)
            //         })
            //     } else {
            //         // 如果不是promise，则返回的状态为成功
            //         resolve(result)
            //     }
            // } catch (e) {
            //     //抛出的错误直接捕捉到
            //     reject(e)
            // }
        }
        if (this.PromiseState == 'rejected') {
            callBack(onRejected)
            // try {
            //     let res = onRejected(this.PromiseResult)
            //     if (res instanceof Promise) {
            //         res.then(v => {
            //             resolve(v)
            //         }, r => {
            //             reject(r)
            //         })
            //     } else {
            //         resolve(res)
            //     }
            // } catch (error) {
            //     reject(error)
            // }
        }
        // 判断pending的状态
        if (this.PromiseState == 'pending') {
            // 若实例化后存在异步任务setTimeout，此时 pending不会发生改变
            // 所以将then的回调保存下来，
            // 保存回调,
            // 数组，保证多个then回调
            this.callBacks.push({
                // 改变返回的promise对象状态
                onResolved: function () {
                    console.log('success');
                    // 执行成功的回调函数
                    // onResolved(self.PromiseResult)

                    callBack(onResolved)
                    // try {
                    //     let res = onResolved(self.PromiseResult)
                    //     if (res instanceof Promise) {
                    //         res.then(v => {
                    //             resolve(v)
                    //         }, r => {
                    //             reject(r)
                    //         })
                    //     } else {
                    //         resolve(res)
                    //     }
                    // } catch (e) {
                    //     reject(e)
                    // }
                },
                onRejected: function () {
                    callBack(onRejected)
                    // try {
                    //     let res = onRejected(self.PromiseResult)
                    //     if (res instanceof Promise) {
                    //         res.then(v => {
                    //             resolve(v)
                    //         }, r => {
                    //             reject(r)
                    //         })
                    //     } else {
                    //         reject(res)
                    //     }
                    // } catch (e) {
                    //     reject(e)
                    // }
                }
            })
        }
    })

}