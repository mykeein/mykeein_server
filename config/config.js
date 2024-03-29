
var path = require('path')
, rootPath = path.normalize(__dirname + '/..')
, templatePath = path.normalize(__dirname + '/../app/mailer/templates')


module.exports = {
  development: {
    domain:"http://localhost:3000",
    port:3000,
    ssl:false,
    ssldomain:"https://localhost",
    sslport:443,
    db: 'mongodb://localhost/mykeein',
    root: rootPath,
    app: {
      name: 'MyKeeIn developers version' 
    }
  },
  production: {
    domain:"http://mykee.in",
    port:80,
    ssl:true,
    ssldomain:"https://mykee.in",
    sslport:443,
    db: 'mongodb://localhost/mykeein',
    root: rootPath,
    app: {
      name: 'MyKeeIn'
    }
  }
}
