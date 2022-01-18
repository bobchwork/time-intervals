import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TimeIntervalsComponent } from './time-intervals.component'

describe('TimeIntervalsComponent', () => {
  let component: TimeIntervalsComponent
  let fixture: ComponentFixture<TimeIntervalsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeIntervalsComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeIntervalsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
  describe('Filters', () => {
    it('should return value 5 when every five is selected', () => {})
    it('should return value 30 when every thirty is selected', () => {})

    it('should return value 60 when every hour is selected', () => {})

    it('should return 11 when December is selected ', () => {})

    it('should call the function generateMockData when the button is clicked ', () => {})
  })
  describe('Functions', () => {
    it('should not return anything when generateMockData is called if the data for one month was already stored', () => {})
    it('should return sorted data from low to high when generateMockData is called', () => {})
    it('should return an array with the headings/intervals when renderIntervalsHeadings is called with five mins', () => {})
    it('should return an array with the headings/intervals when renderIntervalsHeadings is called with five mins', () => {})
  })
})
