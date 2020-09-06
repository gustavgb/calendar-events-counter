#! /usr/bin/env node

const { countEvents } = require('..')

const version = require('../package.json').version
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const flags = require('node-flag')

const SETTINGS_PATH = path.join(os.homedir(), '.calendar-counter-settings', 'settings.json')
// eslint-disable-next-line
const URL_REG = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/

flags.assign({
  n: 'name',
  f: 'forward',
  b: 'back'
})

fs.ensureFile(SETTINGS_PATH)
  .then(() => fs.readFile(SETTINGS_PATH))
  .then(res => {
    try {
      return JSON.parse(res)
    } catch (e) {
      return {}
    }
  })
  .then(settings => {
    if (process.argv[2] === '--help') {
      console.log(
        'Calendar Counter v' + version + '\n\n',
        'Available commands:\n',
        '> calendar-counter --set-link ICAL-LINK\n',
        '> calendar-counter --set-name EVENT-NAME\n',
        '> calendar-counter'
      )
    } else if (flags.get('set-link')) {
      const arg = flags.get('set-link')
      if (!URL_REG.test(arg)) {
        console.log('Invalid link provided. Aborting')
        return
      }
      fs.ensureFile(SETTINGS_PATH)
        .then(() => fs.writeJSON(
          SETTINGS_PATH,
          {
            ...settings,
            link: arg
          }
        ))
        .then(() => console.log('Link saved'))
    } else if (flags.get('set-name')) {
      fs.ensureFile(SETTINGS_PATH)
        .then(() => fs.writeJSON(
          SETTINGS_PATH,
          {
            ...settings,
            name: flags.get('set-name')
          }
        ))
        .then(() => console.log('Name saved'))
    } else {
      const name = flags.get('name') || settings.name
      const forward = parseInt(flags.get('forward'), 10) || 0
      const back = parseInt(flags.get('back'), 10) || 0
      const offset = forward - back

      console.log('Getting events ' + (offset !== 0 ? offset + ' weeks from now' : 'from this week') + ' matching "' + name + '"')

      if (!settings.link || !name) {
        console.log('Setup not completed.\nRun --set-link and --set-name to set iCal link and event name.\nRun --help to learn more.')
        return
      }
      countEvents(settings.link, name, offset)
    }
  })
