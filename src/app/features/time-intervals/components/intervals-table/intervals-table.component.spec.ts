import { ComponentFixture, TestBed } from '@angular/core/testing'

import { IntervalsTableComponent } from './intervals-table.component'

describe('IntervalsTableComponent', () => {
  let component: IntervalsTableComponent
  let fixture: ComponentFixture<IntervalsTableComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntervalsTableComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervalsTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
