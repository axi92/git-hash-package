#! /usr/bin/env node
 //rm -rf node_modules/ && npm i . && node index.js --verbose
import git from 'git-rev-sync';
import {
  readPackageUp as readPkgUp
} from 'read-pkg-up';
import {
  writePackage as writePkg
} from 'write-pkg';
import minimist from 'minimist';
const options = minimist(process.argv.slice(2))
import path from 'path';

// don't normalize package.json
readPkgUp({
  normalize: false
}).then(result => {
  let {
    packageJson
  } = result
  const pkgPath = result.path
  const gitPath = path.dirname(pkgPath)

  const gitInfo = {
    short: git.short(gitPath),
    long: git.long(gitPath),
    branch: git.branch(gitPath),
    tag: git.tag()
  }
  packageJson.git = gitInfo;

  writePkg(pkgPath, packageJson).then(() => {
    if (options.verbose || options.v) {
      const logMsg = `
Git path: ${gitPath}
Git info in ${pkgPath} was updated:
Short: ${gitInfo.short}
Long: ${gitInfo.long}
Branch: ${gitInfo.branch}
Tag: ${gitInfo.tag}`
      console.log(logMsg)
    }
  })
})