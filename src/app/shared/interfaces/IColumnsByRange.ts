import { INTERVAL_RANGE_IN_MINUTES } from '../consts'

export interface IColumnsByRange {
  [INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE]: Array<string>
  [INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY]: Array<string>
  [INTERVAL_RANGE_IN_MINUTES.EVERY_SIXTY]: Array<string>
}
