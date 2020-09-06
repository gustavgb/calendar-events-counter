# calendar-events-counter

CLI to fetch iCal calendar events and count the duration of certain events within this week.

Built to count the hours of weekly planned work sessions.

## Usage

**Installation**

`npm i -g calendar-events-counter`

**Setup**

`calendar-counter --set-link ICAL_LINK`

`calendar-counter --set-name EVENT_NAME`

> Note that the event name only needs to match partially. "Work" will match: "Work from home", "work", "Work", "Work a lot".

> Settings are saved to *$HOME/.calendar-counter-settings/settings.json*

**Usage**

`calendar-counter`

> Use the optional `--name NAME` flag to override the name setting temporarily.

> Use the optional `--forward WEEKS` and `--back WEEKS` flags to select other weeks.

## License

See `LICENSE`. The project is distributed under the MIT license. Do as you please.
