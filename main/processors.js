// @flow
const npmValidateName = require("validate-npm-package-name")

/*::
  export type Processor = {
    name: string,
    prefixes: Array<string>,
    validateName: (name: string) => boolean,
    apiUrl: (name: string) => string,,
    packageUrl: (name: string) => string,
    dataPath: string,
  }
*/
const base /*:Processor*/ = {
  prefixes: [],
  validateName: () => true,
  apiUrl: name => name,
  packageUrl: name => name,
  dataPath: "",
}

const npm /*:Processor*/ = Object.assign({}, base, {
  name: "npm",
  prefixes: ["js", "npm", "javascript"],
  validateName: name => {
    const validate = npmValidateName(name)
    if (validate.validForNewPackages && validate.validForNewPackages) {
      return true
    }
    return false
  },
  apiUrl: name => "https://registry.npmjs.org/" + name.replace("/", "%2f"),
  packageUrl: name => "https://www.npmjs.com/package/" + name,
  dataPath: "repository.url",
})
const composer /*:Processor*/ = Object.assign({}, base, {
  name: "composer",
  prefixes: ["php", "composer", "packagist"],
  // TODO: Fix this. Naive validation, check for the present of "/" in string
  validateName: name => {
    const first = name.indexOf("/")
    const last = name.lastIndexOf("/")
    if (first !== -1 && first === last) {
      return true
    } else {
      return false
    }
  },
  apiUrl: name => `https://packagist.org/packages/${name}.json`,
  packageUrl: name => "https://packagist.org/packages/" + name,
  dataPath: "package.repository",
})
// TODO: Add validate
const crates /*:Processor*/ = Object.assign({}, base, {
  name: "crates",
  prefixes: ["crates", "crate", "rust", "cargo"],
  apiUrl: name => `https://crates.io/api/v1/crates/${name}`,
  packageUrl: name => "https://crates.io/crates/" + name,
  dataPath: "crate.repository",
})

module.exports = [npm, composer]
exports.base = base
