#! /usr/bin/env node

const fs = require('fs')
const path = require('path')

const shell = require('shelljs')
shell.config.fatal = true
shell.config.silent = true

const argv = require('minimist')(process.argv.slice(2))
const fullRepo = argv._[0]
const repo = fullRepo.split('/')[1]
const version = argv._[1]

const checkoutPath = path.resolve('~', '.git-publish-npm')
const repoPath = path.join(checkoutPath, repo)
const pJsonPath = path.join(checkoutPath, repo, 'package.json')

function checkoutTag() {
  shell.cd(repoPath)

  console.info('Checking out tag ' + version + '')
  try {
    shell.exec('git checkout ' + version)
  } catch(e) {
    console.error(e)
    process.exit(1)
  }

  const pJson = require(pJsonPath)

  if (pJson.version !== version) {
    throw 'package.json version does not match tag ' + version
  }
}

function cloneRepo() {
  shell.cd(checkoutPath)

  let repoUrl

  if (argv.http) {
    repoUrl = 'https://github.com/' + fullRepo
  } else {
    repoUrl = 'git@github.com:' + fullRepo + '.git'
  }

  console.info('\nCloning ' + repoUrl + '')
  try {
    shell.exec('git clone ' + repoUrl)
  } catch(e) {
    console.error(e);
    process.exit(1)
  }
}

function installDependencies() {
  process.stdout.write('\nInstalling package dependencies...')
  try {
    shell.exec('npm install')
  } catch(e) {
    console.error(e);
    process.exit(1)
  }
  process.stdout.write(' Done.\n')
}

function publish() {
  console.info('\nPublishing ' + repo + '@' + version + '\n')
  shell.config.silent = false
  shell.exec('npm publish')
  console.info('\nSuccessfully published!')
}

function ensureRepo() {
  if (!fs.existsSync(repoPath)) {
    shell.mkdir('-p', checkoutPath)
    cloneRepo()
    checkoutTag()
  } else {
    checkoutTag()
  }
}

function run() {
  ensureRepo()
  installDependencies()
  publish()
}

run()
