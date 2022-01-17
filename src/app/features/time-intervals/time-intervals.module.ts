import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TimeIntervalsComponent } from './time-intervals.component'
import { SharedModule } from '../../shared/shared.module'
import {GridTimeIntervalComponent} from "./components/grid-time-interval/grid-time-interval.component";

const entryComponents = [TimeIntervalsComponent, GridTimeIntervalComponent]

@NgModule({
  declarations: [...entryComponents],
  imports: [CommonModule, SharedModule],
  exports: [...entryComponents]
})
export class TimeIntervalsModule {}
