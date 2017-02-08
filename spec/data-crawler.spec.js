'use strict'
const dc = require('../data-crawler')
const examples = require('./examples')


describe('Data Crawler', () => {

  describe('isArray', () => {
    it('detects Arrays', () => {
      expect(dc._isArray([])).toBe(true)
      expect(dc._isArray([{key: 'value'}])).toBe(true)
    })
    it('rejects most other things', () => {
      expect(dc._isArray('some string')).toBe(false)
      expect(dc._isArray(5235)).toBe(false)
      expect(dc._isArray({})).toBe(false)
    })
  })

  describe('isDate', () => {
    it('detects most date types', () => {
      expect(dc._isDate('2017-01-30')).toBe(true, 'YYYY-MM-DD ISO date string')
      expect(dc._isDate('2017-02-30')).toBe(true, 'February 30th') // Whoops, february.
      expect(dc._isDate('01/30/2017')).toBe(true, 'MM/DD/YYYY')

      expect(dc._isDate('30/01/2017')).toBe(false, 'DD/MM/YYYY') // Danish date format won't parse...
      expect(dc._isDate('30-01-2017')).toBe(false, 'DD-MM-YYYY') // Danish date format won't parse...
      expect(dc._isDate('2017-30-01')).toBe(false, 'YYYY-DD-MM')
      expect(dc._isDate('2017/30/01')).toBe(false, 'YYYY/DD/MM')
      expect(dc._isDate('02-01-2017T01:00:47.112+01:00')).toBe(false, 'Full ISO date')
      expect(dc._isDate('02-01-2017T01:00:47.112Z')).toBe(false, 'Zulu time')
      expect(dc._isDate('2017-W22-7')).toBe(false, 'Week indicator')
    })
    it('rejects most other things', () => {
      expect(dc._isDate('42.5')).toBe(false, 'float in a string')
      expect(dc._isDate('Weird string 3')).toBe(false, 'Weird string')
      expect(dc._isDate('Week 22')).toBe(false, 'Week + number')
      expect(dc._isDate(340)).toBe(false, '340')
      expect(dc._isDate(3)).toBe(false, '3')

      expect(dc._isDate(1486385004)).toBe(false, "uts not supported")
    })
  })

  describe('isNumber', () => {
    it('detects numbers', () => {
      expect(dc._isNumber(20)).toBe(true)
      expect(dc._isNumber(20.3)).toBe(true)
      expect(dc._isNumber('20.3')).toBe(true)
      expect(dc._isNumber('20')).toBe(true)
    })
    it('rejects most other things', () => {
      expect(dc._isNumber('Weird string 3')).toBe(false, 'Weird string')
      expect(dc._isNumber('30/01/2017')).toBe(false, 'Weird string')
      expect(dc._isNumber([1, 2, 3])).toBe(false, 'Array')
      expect(dc._isNumber({key: 2})).toBe(false, 'Object')
    })
  })

  describe('isObj', () => {
    it('detects objects', () => {
      expect(dc._isObj({})).toBe(true)
      expect(dc._isObj({ key: 'value' })).toBe(true)
      expect(dc._isObj({ key: 6 })).toBe(true)
      expect(dc._isObj({ key: ['value'] })).toBe(true)
    })
    it('rejects most other things', () => {
      expect(dc._isObj(['value'])).toBe(false, 'array')
      expect(dc._isObj(function(){})).toBe(false, 'function')
      expect(dc._isObj('String')).toBe(false, 'string')
    })
  })

  it('Discovers the data layout for a json object', () => {

    let layout = dc.getLayoutFor(examples.testCases[0])

    expect(layout).toEqual({
      type: 'timeseries',
      x: 'series.samples.0.date',
      keys: ['series.samples.0.value'],
      length: 3
    })

    layout = dc.getLayoutFor(examples.testCases[1])
    expect(layout).toEqual({
      type: 'timeseries',
      x: 'data.0.date',
      keys: ['data.0.value'],
      length: 3
    })

    layout = dc.getLayoutFor(examples.testCases[2])
    expect(layout).toEqual({
      type: 'timeseries',
      x: '0.date',
      keys: ['0.value'],
      length: 3
    })

    layout = dc.getLayoutFor(examples.testCases[3])
    expect(layout).toEqual({
      type: 'timeseries',
      x: '0.x',
      keys: ['0.y'],
      length: 3
    })

    layout = dc.getLayoutFor(examples.testCases[4])
    expect(layout).toEqual({
      type: 'category',
      x: '0.name',
      keys: ['0.upload', '0.download', '0.total'],
      length: 4
    })

    layout = dc.getLayoutFor(examples.testCases[5])
    expect(layout).toEqual({
      type: 'timeseries',
      x: 'series.samples.0.date',
      keys: ['series.samples.0.value'],
      length: 3
    })
  })
})
