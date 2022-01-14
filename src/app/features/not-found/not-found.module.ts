import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NotFoundComponent } from './not-found.component'
import { SharedModule } from '../../shared/shared.module'

const entryComponents = [NotFoundComponent]
@NgModule({
  declarations: [...entryComponents],
  imports: [CommonModule, SharedModule],
  exports: [...entryComponents]
})
export class NotFoundModule {}
