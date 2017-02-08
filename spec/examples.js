'use strict'

const testCases = [
  {
    series: {
      samples: [
        { date: "2017-01-01", value: 827 },
        { date: "2017-01-02", value: 754 },
        { date: "2017-01-03", value: 1194 }
      ]
    }
  },
  {
    data: [
      { date: "2017-01-01", value: 827 },
      { date: "2017-01-02", value: 754 },
      { date: "2017-01-03", value: 1194 }
    ]
  },
  [
    { date: "2017-01-01", value: 827 },
    { date: "2017-01-02", value: 754 },
    { date: "2017-01-03", value: 1194 }
  ],
  [
    { x: "2017-01-01", y: 827 },
    { x: "2017-01-02", y: 754 },
    { x: "2017-01-03", y: 1194 }
  ],
  [
    { name: 'www.site1.com', upload: 800, download: 500, total: 400},
    { name: 'www.site2.com', upload: 600, download: 600, total: 400},
    { name: 'www.site3.com', upload: 400, download: 800, total: 500},
    { name: 'www.site4.com', upload: 400, download: 700, total: 500}
  ],
  {
    unwanted_meta: {
      extracted: "2017-01-03",
      time_in_ms: 42,
      source: "endpoint_name",
      query: {
        paramA: "A",
        paramB: "B",
        paramC: "2017-01-01",
        paramD: "2017-01-04",
        paramE: 127
      }
    },
    series: {
      samples: [
        { date: "2017-01-01", value: 827 },
        { date: "2017-01-02", value: 754 },
        { date: "2017-01-03", value: 1194 }
      ]
    }
  },
  [
    ['x', '2017-01-01', '2017-01-02', '2017-01-03', '2017-01-04'],
    ['data1', 600, 450, 350, 500],
    ['data2', 700, 600, 500, 575],
    ['data3', 500, 650, 450, 500],
  ]
]

module.exports = {
  testCases: testCases
}
