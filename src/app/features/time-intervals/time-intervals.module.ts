import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TimeIntervalsComponent } from './time-intervals.component'
import { SharedModule } from '../../shared/shared.module'
import { IntervalsTableComponent } from './components/intervals-table/intervals-table.component'

const entryComponents = [TimeIntervalsComponent, IntervalsTableComponent]

@NgModule({
  declarations: [...entryComponents],
  imports: [CommonModule, SharedModule],
  exports: [...entryComponents]
})
export class TimeIntervalsModule {}
