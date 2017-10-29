# git-publish-npm

[![npm](https://img.shields.io/npm/dt/git-publish-npm.svg?style=flat-square)](https://www.npmjs.com/package/git-publish-npm)
[![npm](https://img.shields.io/npm/dm/git-publish-npm.svg?style=flat-square)](https://www.npmjs.com/package/git-publish-npm)
[![npm](https://img.shields.io/npm/v/git-publish-npm.svg?style=flat-square)](https://www.npmjs.com/package/git-publish-npm)
[![npm](https://img.shields.io/npm/l/git-publish-npm.svg?style=flat-square)](https://www.npmjs.com/package/git-publish-npm)

CLI tool for publishing a GitHub repository to NPM for a specific tag/version.

NOTE - this tool expects a git tag to exist with the exact semver version of the NPM version you wish to publish. For example, a git tag `0.1.0` should exist to publish NPM version `0.1.0`.

### Installation

```
npm install -g git-publish-npm
```

### Usage

```
git-publish-npm <github repo> <version/tag> [--http] [-v]
```

For example, to publish version `0.1.0` of this repository

```
git-publish-npm tom-james-watson/git-publish-npm 0.1.1
```

### Options

`--http`: Clone via HTTP. Default is SSH.

`-v`: Verbose mode. Show all output.
