/**
 * 为Promise添加的扩展
 * http://coderlt.coding.me/2016/12/04/promise-in-depth-an-introduction-2/
 */
let publichMethods = ['finally', 'wait'];
let staticMethods = ['timeout', 'sequence', 'stop'];

const extendsFns = {
  finally: function(fn) {
    return this.then(function(v) {
      return fn(v), v;
    }, function(r) {
      throw fn(r), r;
    })
  },
  wait: function(ms) {
    var P = this.constructor;
    return this.then(function(v) {
      return new P(function(resolve, reject) {
        setTimeout(function() {
          resolve(v);
        }, ~~ms)
      })
    }, function(r) {
      return new P(function(resolve, reject) {
        setTimeout(function() {
          reject(r);
        }, ~~ms)
      })
    })
  },
  timeout: function(promise, ms) {
    return this.race([promise, this.reject().wait(ms)]);
  },
  sequence: function(tasks) {
    return tasks.reduce(function(prev, next) {
      return prev.then(next).then(function(res) {
        return res
      });
    }, this.resolve());
  },
  stop: function() {
    return new this(() => {});
  },
}

publichMethods = publichMethods.filter(v => !Promise.prototype.hasOwnProperty(v));
staticMethods = staticMethods.filter(v => !Promise.hasOwnProperty(v));

publichMethods.forEach(v => {
  Promise.prototype[v] = extendsFns[v];
})

staticMethods.forEach(v => {
  Promise[v] = extendsFns[v].bind(Promise)
})