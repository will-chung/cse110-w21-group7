const sinon = require("sinon");
const referee = require("@sinonjs/referee");
import { init, transaction } from '../src/indexedDB/IndexedDBWrapper.js'
const assert = referee.assert;

describe ('Testing IndexDBWrapper', function() {
    let spy

    beforeEach(function () {
        spy = sinon.spy('init')
     })

    it ('init should be called once', function() {
        transaction()

        assert(spy.calledWith({}, spy.args[0][0]))
    })
})