#! /usr/bin/env node

const { countEvents } = require('..')

const flag = process.argv[2]
const arg = process.argv[3]
const version = require('../package.json').version
const fs = require('fs-extra')
const os = require('os')
const path = require('path')

const SETTINGS_PATH = path.join(os.homedir(), '.calendar-counter-settings', 'settings.json')
// eslint-disable-next-line
const URL_REG = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/

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
    switch (flag) {
      case '--help':
        console.log(
          'Calendar Counter v' + version + '\n\n',
          'Available commands:\n',
          '> calendar-counter --set-link ICAL-LINK\n',
          '> calendar-counter --set-name EVENT-NAME\n',
          '> calendar-counter'
        )
        break
      case '--set-link':
        if (!arg) {
          console.log('No link provided. Aborting')
          break
        } else if (!URL_REG.test(arg)) {
          console.log('Invalid link provided. Aborting')
          break
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
        break
      case '--set-name':
        if (!arg) {
          console.log('No name provided. Aborting')
          break
        }
        fs.ensureFile(SETTINGS_PATH)
          .then(() => fs.writeJSON(
            SETTINGS_PATH,
            {
              ...settings,
              name: arg
            }
          ))
          .then(() => console.log('Name saved'))
        break
      case undefined:
        if (!settings.link || !settings.name) {
          console.log('Setup not completed.\nRun --set-link and --set-name to set iCal link and event name.\nRun --help to learn more.')
          break
        }
        countEvents(settings.link, settings.name)
        break
      default:
        console.log('Unknown command.\nRun --help to learn more.')
        break
    }
  })
