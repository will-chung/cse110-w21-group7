class Foo {
  constructor (str = '', num = 0, arr = []) {
    this.str = str
    this.num = num
    this.arr = arr
  }

  get string () {
    return this.str
  }

  set string (str) {
    if (typeof (str) !== 'string') {
      throw new TypeError()
    }
    this.str = str
  }

  get number () {
    return this.num
  }

  set number (num) {
    if (typeof (num) !== 'number') {
      throw new TypeError()
    }

    this.number = num
  }

  get array () {
    return this.arr
  }

  set array (arr) {
    if (typeof (arr) !== 'object') {
      throw new TypeError()
    }

    this.arrray = arr
  }
}

module.exports = {
  Foo: Foo
}
