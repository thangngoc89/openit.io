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
  apiUrl: name => "https://repository.npmjs.org/" + name.replace("/", "%2f"),
  packageUrl: name => "https://www.npmjs.com/package/" + name,
  dataPath: "repository.url",
  postprocessUrl: url => {
    const cleanUrl = hostedGitInfo.fromUrl(url, { noGitPlus: true })
    return cleanUrl ? cleanUrl : null
  },
})

module.exports = [npm]
exports.base = base
