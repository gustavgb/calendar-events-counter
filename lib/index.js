const fetch = require('node-fetch')
const ical = require('ical')
const { isThisWeek, format } = require('date-fns')
const HumanizeDuration = require('humanize-duration')

exports.countEvents = function (icalLink, name) {
  if (!icalLink || !name) {
    throw new Error('Invalid arguments')
  }

  const pattern = new RegExp(name, 'i')
  return fetch(icalLink)
    .then(res => res.text())
    .then(body => ical.parseICS(body))
    .then(body => Object.entries(body)
      .filter(([, event]) =>
        event.type === 'VEVENT' &&
        pattern.test(event.summary) &&
        isThisWeek(event.start, { weekStartsOn: 1 })
      )
      .map(([, event]) => ({
        summary: event.summary,
        date: format(event.start, 'MMM d'),
        duration: event.end.getTime() - event.start.getTime()
      }))
      .sort((a, b) => {
        if (a.date < b.date) {
          return -1
        } else if (a.date > b.date) {
          return 1
        }
        return 0
      })
      .reduce(
        (acc, event, index, arr) => {
          acc[index] = event
          if (!acc[arr.length]) {
            acc[arr.length] = {
              duration: 0,
              summary: 'Total'
            }
          }
          acc[arr.length].duration += event.duration
          return acc
        },
        []
      )
      .map(event => ({
        ...event,
        duration: HumanizeDuration(event.duration)
      }))
    )
    .then(console.table)
    .catch(err => err.code === 'EAI_AGAIN' ? console.log('No internet') : console.log(err.message))
}
