(function(global) {
  'use strict'
  const dc = () => {

    return {

      getLayoutFor: getLayoutFor,
      _isArray: isArray,
      _isDate: isDate,
      _isNumber: isNumber,
      _isObj: isObj
    }
  }

  function getLayoutFor(crawlable) {
    let properties = {
      'date': {},
      'keys': { keys: [] },
      'array': {},
      'axis' : {}
    }

    crawl(crawlable, '', properties)
    // console.log("props", properties)
    if(propertyComplete(properties)) {
      return {
        type: properties.axis.type,
        x: properties.axis.location.replace(/^\./, ""),
        keys: properties.keys.keys.map((key) => { return key.replace(/^\./, "") }),
        length: properties.array.length
      }
    } else return 'undecidable'
  }


  function crawl(crawlable, parent, properties) {
    if (isObj(crawlable)) {
      // Traverse object properties looking for values
      Object.keys(crawlable).forEach((k) => {
        // To figure out when to stop looking after keys are found...
        properties.keys.bestGuessLength = Object.keys(crawlable).length - 1
        if(!properties.axis.found || !properties.keys.found || properties.keys.keys.length < properties.keys.bestGuessLength) {
          crawl(crawlable[k], parent + '.' + k, properties)
        }
      })
      // Reset if not found in same object traversal
      if(!properties.axis.found || !properties.keys.found) {
        properties.axis.found = properties.keys.found = false
      }
    } else if (isArray(crawlable)) {
      // Found array - likely a list of objects
      properties.array.found = true
      properties.array.location = parent
      properties.array.length = crawlable.length
      // Keep going.
      crawl(crawlable[0], parent + '.0', properties)
    } else {
      // Found value
      let v = crawlable
      if (isNumber(v) && properties.array.found) {
        // Taking a wild guess that numerics = values, not axes.
        properties.keys.found = true
        properties.keys.keys.push(parent)
      } else if (properties.array.found) {
        // If it's not a numeric value - maybe it's an axis?
        properties.axis.found = true
        properties.axis.location = parent
        if (isDate(v)) {
          properties.axis.type = 'timeseries'

          properties.date.found = true
          properties.date.location = parent
        } else {
          properties.axis.type = 'category'
        }
      } else {
        // Probably not the droids I'm looking for...
      }
    }
  }

  function propertyComplete(props) {
    return props.array.found && props.axis.found && props.keys.found
  }

  function isArray(obj) {
    //TODO: Improve down here. Strings are arrays Dx
    return Array.isArray(obj)
  }

  function isObj(obj) {
    return (typeof obj === "object" && !Array.isArray(obj))
  }

  function isDate(value) {
    // Consider using moment instead - more robust - but will require a dependency.
    let hackyDateRegex = /((\d){2,4}[\.|/|-]){2}(\d){2,4}(T((\d){2,4}([\.|\:]){0,1}){1,4}){0,1}(Z|([+-]\d\d\:\d\d)){0,1}|(\d{4}[\.|/|-]W(\d){2}([\.|/|-][0-7]){0,1})/g
    // Should be enough, no? Covers ISO dates and a few variants
    let looksLikeDate = !isNumber(value) && value.match && !!value.match(hackyDateRegex)
    return looksLikeDate && (new Date(value) !== "Invalid Date") && !isNaN(new Date(value));
  }

  function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  // Determine which kind of module to expose
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = dc()
  } else if (typeof global.define == 'function' && global.define.amd) {
    // Wireup with RequireJS
    define('json-crawler/data-crawler', [], dc)
  } else {
    // ...or as browser global
    global.DataCrawler = dc()
  }

})(typeof window !== 'undefined' ? window : this)
