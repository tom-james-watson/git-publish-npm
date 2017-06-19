#! /usr/bin/env node

const fs = require('fs')
const path = require('path')

const shell = require('shelljs')

const argv = require('minimist')(process.argv.slice(2))

if (argv.h || argv.help) {
  console.log('Usage:\n')
  console.log('git-publish-npm <github repo> <version/tag> [--help] [--http] [-v]')
  console.log('\ne.g. git-publish-npm tom-james-watson/gitpublish-npm 0.1.0')
  process.exit(0)
}

const fullRepo = argv._[0]
const repo = fullRepo.split('/')[1]
const version = argv._[1]

const checkoutPath = path.resolve(process.env.HOME, '.git-publish-npm')
const repoPath = path.join(checkoutPath, repo)
const pJsonPath = path.join(checkoutPath, repo, 'package.json')

if (!argv.v) {
  shell.config.silent = true
}
shell.config.fatal = true

function checkoutTag() {
  shell.cd(repoPath)

  console.log('Checking out tag ' + version)

  try {
    shell.exec('git checkout ' + version)
  } catch(e) {
    console.error('Failed to checkout tag ' + version);
    process.exit(1)
  }

  const pJson = require(pJsonPath)

  if (pJson.version !== version) {
    throw 'package.json version does not match tag ' + version
  }
}

function fetchTags() {
  shell.cd(repoPath)

  process.stdout.write('Fetching latest tags...')

  try {
    shell.exec('git fetch --tags')
  } catch(e) {
    console.error('Failed to fetch tags');
    process.exit(1)
  }

  process.stdout.write(' Done.\n')
}

function cloneRepo() {
  shell.cd(checkoutPath)

  let repoUrl

  if (argv.http) {
    repoUrl = 'https://github.com/' + fullRepo
  } else {
    repoUrl = 'git@github.com:' + fullRepo + '.git'
  }

  console.log('Cloning ' + repoUrl)

  try {
    shell.exec('git clone ' + repoUrl)
  } catch(e) {
    console.error('Failed to clone ' + repoUrl);
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
  console.log('\nPublishing ' + repo + '@' + version + '\n')

  shell.config.silent = false

  try {
    shell.exec('npm publish')
  } catch(e) {
    process.exit(1)
  }
  console.log('\nSuccessfully published!')
}

function ensureRepo() {
  if (!fs.existsSync(repoPath)) {
    shell.mkdir('-p', checkoutPath)
    cloneRepo()
    checkoutTag()
  } else {
    fetchTags()
    checkoutTag()
  }
}

function run() {
  ensureRepo()
  installDependencies()
  publish()
}

run()
