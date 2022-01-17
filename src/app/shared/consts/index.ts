export enum INTERVALS {
  FIVE_MINS = '5 Minutes',
  THIRTY_MINS = '30 Minutes',
  ONE_HOUR = '1 hour'
}

export enum INTERVAL_RANGE_IN_MINUTES {
  EVERY_FIVE = 5,
  EVERY_THIRTY = 30,
  EVERY_SIXTY = 60
}

export const ELEMENT_DATA: { position: number; name: string; weight: number; ['00:00 - 00:05']: string }[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, ['00:00 - 00:05']: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, ['00:00 - 00:05']: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, ['00:00 - 00:05']: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, ['00:00 - 00:05']: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, ['00:00 - 00:05']: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, ['00:00 - 00:05']: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, ['00:00 - 00:05']: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, ['00:00 - 00:05']: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, ['00:00 - 00:05']: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, ['00:00 - 00:05']: 'Ne' }
]

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
