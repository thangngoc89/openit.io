// @flow
const npmHostedGitInfo = require("hosted-git-info")
const npmValidateName = require("validate-npm-package-name")

/*::
  export type Processor = {
    prefixes: Array<string>,
    validateName: (name: string) => boolean,
    apiUrl: (name: string) => string,,
    packageUrl: (name: string) => string,
    dataPath: string,
    postprocessUrl: (url: string) => string | null
  }
*/
const base /*:Processor*/ = {
  prefixes: [],
  validateName: () => true,
  apiUrl: name => name,
  packageUrl: name => name,
  dataPath: "",
  postprocessUrl: url => url,
}

const npm /*:Processor*/ = Object.assign({}, base, {
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
  postprocessUrl: url => {
    const opts = { noGitPlus: true }
    const cleanUrl = npmHostedGitInfo.fromUrl(url, opts)

    return cleanUrl ? cleanUrl.https(opts) : null
  },
})
const composer /*:Processor*/ = Object.assign({}, base, {
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
  postprocessUrl: url => url,
})

module.exports = [npm, composer]
exports.base = base
