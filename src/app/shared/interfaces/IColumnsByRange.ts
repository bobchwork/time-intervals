import { INTERVAL_RANGE_IN_MINUTES } from '../consts'
import { IInterval } from './IInterval'

export interface IColumnsByRange {
  [INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE]: Array<IInterval>
  [INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY]: Array<IInterval>
  [INTERVAL_RANGE_IN_MINUTES.EVERY_SIXTY]: Array<IInterval>
}
