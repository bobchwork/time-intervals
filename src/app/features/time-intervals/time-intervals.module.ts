import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TimeIntervalsComponent } from './time-intervals.component'
import { NotFoundComponent } from '../not-found/not-found.component'
import { SharedModule } from '../../shared/shared.module'

const entryComponents = [TimeIntervalsComponent, NotFoundComponent]

@NgModule({
  declarations: [...entryComponents],
  imports: [CommonModule, SharedModule],
  exports: [...entryComponents]
})
export class TimeIntervalsModule {}
