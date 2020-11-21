// Copy all files under 'assets/static' to 'dist'.
// This so we can use static file paths across parcel builds.
// Used for social media summary banners for exmaple.
const fs = require('fs-extra')
fs.copySync('assets/static', 'dist')