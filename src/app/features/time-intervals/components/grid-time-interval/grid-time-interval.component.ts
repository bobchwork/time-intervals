import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core'
import {INTERVAL_RANGE_IN_MINUTES} from '../../../../shared/consts'

@Component({
  selector: 'grid-time-interval',
  templateUrl: './grid-time-interval.component.html',
  styleUrls: ['./grid-time-interval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridTimeIntervalComponent implements OnInit, OnChanges {
  @Input() dataSource: Array<any> = []
  @Input() headings: Array<{}> = []
  @Input() intervalValue: INTERVAL_RANGE_IN_MINUTES

  public intervalsValues = INTERVAL_RANGE_IN_MINUTES
  public sourceData: any

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataSource) {
      this.sourceData = changes.dataSource.currentValue
    }
  }

  public isDataLoaded() {
    if (!this.headings || !this.sourceData) {
      return false
    }
    return this.headings.length > 0 && this.sourceData.length > 0
  }
  public isInterval(interval: INTERVAL_RANGE_IN_MINUTES) {
    return this.intervalValue === interval
  }
}
