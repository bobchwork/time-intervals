import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MaterialModule } from '../material.module'
import { ReactiveFormsModule } from '@angular/forms'
import { ToolbarComponent } from './components/toolbar/toolbar.component'
import { RouterModule } from '@angular/router'

const entryComponents = [ToolbarComponent]

@NgModule({
  declarations: [...entryComponents],
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, RouterModule],
  exports: [MaterialModule, ReactiveFormsModule, CommonModule, ...entryComponents]
})
export class SharedModule {}
