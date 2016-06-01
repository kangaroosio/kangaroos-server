const babel = require('babel-core')

module.exports = {
  process: function process(src, filename) {
    const stage = 0

    console.log(filename)

    if (
       filename.indexOf('node_modules') === -1
    && babel.canCompile(filename)
    ) {
      return babel.transform(src, {
        filename: filename
      , stage: stage
      , retainLines: true
      }).code
    }

    return src
  }
}
