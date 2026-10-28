'use strict'

module.exports = {
  LOCKFILE_TYPES: ['npm', 'yarn', 'pnpm'], // currently supported types
  REGISTRY: {
    npm: 'registry.npmjs.org',
    yarn: 'registry.yarnpkg.com',
    verdaccio: 'registry.verdaccio.org'
  }
}
