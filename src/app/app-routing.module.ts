import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TimeIntervalsModule } from './features/time-intervals/time-intervals.module'
import { TimeIntervalsComponent } from './features/time-intervals/time-intervals.component'
import { NotFoundComponent } from './features/not-found/not-found.component'

const routes: Routes = [
  { path: '', component: TimeIntervalsComponent },
  { path: '**', component: NotFoundComponent }
]

@NgModule({
  imports: [TimeIntervalsModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
