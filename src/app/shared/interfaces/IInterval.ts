// for columns
import { Moment } from 'moment'

export interface IInterval {
  start: string | Moment
  end: string | Moment
  intervalName: string | ''
}
