import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GridTimeIntervalComponent } from './grid-time-interval.component'

describe('GridTimeIntervalComponent', () => {
  let component: GridTimeIntervalComponent
  let fixture: ComponentFixture<GridTimeIntervalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridTimeIntervalComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(GridTimeIntervalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
  it('should  display the class five-min if 5 min is selected', () => {
    expect(component).toBeTruthy()
  })
  it('should  display the class thirty-min if 30 min is selected', () => {
    expect(component).toBeTruthy()
  })
  it('should  display the class sixty-min if 60 min is selected', () => {
    expect(component).toBeTruthy()
  })
})
