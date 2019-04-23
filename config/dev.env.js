var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"//enterprise.appserver.fecshop.com"',
  WEBSITE_ROOT: '"//enterprise.fancyecommerce.com"'
  // TRACE_WEBSITE_ID: '"9b17f5b4-b96f-46fd-abe6-a579837ccdd9"',
  // TRACE_ENABLE: '"true"',
  // TRACE_JS_URL: '"trace.fecshop.com/fec_trace.js"',
})
