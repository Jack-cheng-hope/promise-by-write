class Promise {
    constructor(executor) {
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
            if (self.PromiseState !== 'pending') return
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
                console.log(item);
                item.isResolved(data)
            });



        };
        // 声明reject函数
        function reject(data) {
            // 判断状态,保证状态只能修改一次
            if (self.PromiseState !== 'pending') return
            // 修改reject的结果为失败,与resolve的过程相当
            self.PromiseState = 'rejected'
            self.PromiseResult = data;
            // 保存的回调，改变状态后在执行回调
            // if (self.callBack.onRejected) {
            //     self.callBank.onRejected(data)
            // }

            // promise的then中的回调是异步执行的
            setTimeout(() => {
                self.callBacks.forEach(item => {
                    item.isRejected(data)
                })

            }, 1000)
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

    then(onResolved, onRejected) {
        const self = this;
        if (typeof onRejected !== 'function') {
            onRejected = reason => {
                throw reason
            }
        }
        if (typeof onResolved !== 'function') {
            onResolved = value => {
                onResolved(value)
            }
        }
        return new Promise((resolve, reject) => {

            function change(type) {
                try {
                    let res = type(self.PromiseResult)
                    // console.log(self.PromiseResult);
                    // console.log(res);
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
            if (this.PromiseState === 'fulfilled') {
                // promise的then中的回调是异步执行的
                setTimeout(() => { change(onResolved) }, 1000)

                // let res = onResolved(this.PromiseResult)
                // console.log(res);
                // if (res instanceof Promise) {
                //     res.then(v => {
                //         resolve(v)
                //     }, r => {
                //         reject(r)
                //     })
                // } else {
                //     resolve(res)
                // }
            }

            if (this.PromiseState === 'rejected') {
                // promise的then中的回调是异步执行的
                setTimeout(() => { change(onRejected) }, 1000)
            }

            // 异步任务时
            if (this.PromiseState === 'pending') {

                console.log(this.callBacks);
                this.callBacks.push({
                    isResolved: function () {
                        change(onResolved)
                    },
                    isRejected: function () {
                        change(onRejected)
                    }
                })

            }
        })
    }

    catch(onRejected) {
        this.then(undefined, onRejected)
    }

    static resolve(value) {
        // 返回promise对象
        // console.log(value);
        return new Promise((resolve, reject) => {
            if (value instanceof Promise) {
                console.log(123);
                value.then(v => {
                    // resolve(v)
                    console.log(v);
                }, r => {
                    reject(r)
                })
            } else {
                resolve(value)
            }
        })
    }

    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    }

    static all(promises) {
        return new Promise((resolve, reject) => {
            // console.log(promises);
            let count = 0;
            let arr = []

            for (let i = 0; i < promises.length; i++) {
                promises[i].then(v => {
                    count++;
                    arr[i] = v;
                    console.log(arr);
                    if (count === promises.length) {
                        resolve(v)
                    }
                }, r => {
                    reject(r)
                })
            }
        })
    }

    static race(promises) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(v => {
                    console.log(12);
                    resolve(v)
                }, r => {
                    reject(r)
                })
            }
        })
    }
}

// Promise.prototype.then = function (onResolved, onRejected) {
//     // console.log(this.PromiseState);
//     const self = this

//     if (typeof onRejected !== 'function') {
//         onRejected = reason => {
//             throw reason
//         }
//     }

//     if (typeof onResolved !== 'function') {
//         onResolved = value => {
//             onResolved(value)
//         }
//     }

//     return new Promise((resolve, reject) => {

//         function change(type) {
//             try {
//                 let res = type(self.PromiseResult)
//                 // console.log(res);
//                 if (res instanceof Promise) {
//                     res.then(v => {
//                         resolve(v)
//                     }, r => {
//                         reject(r)
//                     })
//                 } else {
//                     resolve(res)
//                 }
//             } catch (e) {
//                 reject(e)
//             }
//         }
//         if (this.PromiseState === 'fulfilled') {
//             // promise的then中的回调是异步执行的
//             setTimeout(() => { change(onResolved) }, 1000)

//             // let res = onResolved(this.PromiseResult)
//             // console.log(res);
//             // if (res instanceof Promise) {
//             //     res.then(v => {
//             //         resolve(v)
//             //     }, r => {
//             //         reject(r)
//             //     })
//             // } else {
//             //     resolve(res)
//             // }
//         }

//         if (this.PromiseState === 'rejected') {
//             // promise的then中的回调是异步执行的
//             setTimeout(() => { change(onRejected) }, 1000)
//         }

//         // 异步任务时
//         if (this.PromiseState === 'pending') {

//             console.log(this.callBacks);
//             this.callBacks.push({
//                 isResolved: function () {
//                     change(onResolved)
//                 },
//                 isRejected: function () {
//                     change(onRejected)
//                 }
//             })

//         }
//     })

// }
