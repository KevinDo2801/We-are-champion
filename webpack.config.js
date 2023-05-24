const path = require('path');

module.exports = {
  entry: './your-entry-file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};
