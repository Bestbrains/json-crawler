# JSON Crawler

A small tool (WIP), that attempts to determine where data is located in a json structure, given a timeseries-like format or other forms of categorized series data.

It can help find the relevant data locations of a json to display a chart if you don't know the exact format ahead of time.

So far it's a simple and brute-force solution looking for simple markers. Future enhancements could be based on learning or refinement of the processes.

# Getting started

Run

    npm install

and

    npm test

# How to use

You can either require this in node, use requirejs('json-crawler/data-crawler') or if in the browser with no AMD loaded, use the browser global DataCrawler.

It has a single function getLayoutFor(structure: json)

Returns a structure resembling:

    {
      type: 'timeseries',
      x: 'data.0.date',
      keys: ['data.0.value'],
      length: 3
    }

or 'undecidable' if it can't be parsed.

# Lacking support

A bunch of structures are currently not supported (as it's hard to guess ahead of time what permutations will exist). One notable is the native c3 structure

    [
      ['x', '2017-01-01', '2017-01-02', '2017-01-03', '2017-01-04'],
      ['data1', 600, 450, 350, 500],
      ['data2', 700, 600, 500, 575],
      ['data3', 500, 650, 450, 500],
    ]

which is included in the test examples. It won't work because the data is spread across multiple arrays (keys in one, values in the rest, and the labels as part of each array).

What this code does so far is looking for an array with a date or x axis present, that also contains something that looks like values.
