import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GridTimeIntervalComponent } from './grid-time-interval.component'
import { INTERVAL_RANGE_IN_MINUTES } from '../../../../shared/consts'
import { TEST_DATA } from '../../../../shared/consts/test-data'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('GridTimeIntervalComponent', () => {
  let component: GridTimeIntervalComponent
  let fixture: ComponentFixture<GridTimeIntervalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridTimeIntervalComponent],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
    component.headings = TEST_DATA.FIVE_MINS_DISPLAYED_COLUMNS
    component.intervalValue = INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE
    component.sourceData = TEST_DATA.FIVE_MINS_DATA_SOURCE
    fixture.detectChanges()
    const element = fixture.debugElement.nativeElement
    expect(element.querySelector('.five-min')).toBeTruthy()
  })
  it('should  display the class thirty-min if 30 min is selected', () => {
    component.headings = TEST_DATA.THIRTY_MINS_DISPLAYED_COLUMNS
    component.intervalValue = INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY
    component.sourceData = TEST_DATA.THIRTY_MINS_DATA_SOURCE
    fixture.detectChanges()
    const element = fixture.debugElement.nativeElement
    expect(element.querySelector('.thirty-min')).toBeTruthy()
  })
  it('should  display the class sixty-min if 60 min is selected', () => {
    component.headings = TEST_DATA.SIXTY_MINS_DISPLAYED_COLUMNS
    component.intervalValue = INTERVAL_RANGE_IN_MINUTES.EVERY_SIXTY
    component.sourceData = TEST_DATA.SIXTY_MINS_DATA_SOURCE
    fixture.detectChanges()
    const element = fixture.debugElement.nativeElement
    expect(element.querySelector('.sixty-min')).toBeTruthy()
  })
  it('should  display 288 columns if 5 min is selected', () => {
    component.headings = TEST_DATA.FIVE_MINS_DISPLAYED_COLUMNS
    component.sourceData = TEST_DATA.FIVE_MINS_DATA_SOURCE
    component.intervalValue = INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE
    fixture.detectChanges()
    const element = fixture.debugElement.nativeElement
    expect(element.querySelectorAll('th').length).toBe(288)
  })
  it('should  display 48 columns if 30 min is selected', () => {
    component.headings = TEST_DATA.THIRTY_MINS_DISPLAYED_COLUMNS
    component.sourceData = TEST_DATA.THIRTY_MINS_DATA_SOURCE
    component.intervalValue = INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY
    fixture.detectChanges()
    const element = fixture.debugElement.nativeElement
    expect(element.querySelectorAll('th').length).toBe(48)
  })
  it('should  display 24 columns if 60 min is selected', () => {
    component.headings = TEST_DATA.SIXTY_MINS_DISPLAYED_COLUMNS
    component.sourceData = TEST_DATA.SIXTY_MINS_DATA_SOURCE
    component.intervalValue = INTERVAL_RANGE_IN_MINUTES.EVERY_SIXTY
    fixture.detectChanges()
    const element = fixture.debugElement.nativeElement
    expect(element.querySelectorAll('th').length).toBe(24)
  })
  it('should  display 31 rows if there are 31 items in the data source', () => {
    component.headings = TEST_DATA.FIVE_MINS_DISPLAYED_COLUMNS
    component.sourceData = TEST_DATA.FIVE_MINS_DATA_SOURCE
    fixture.detectChanges()
    const element = fixture.debugElement.nativeElement
    expect(element.querySelectorAll('.content-row').length).toBe(31)
  })
  it('should  display the spinner if the data is not loaded', () => {
    component.headings = TEST_DATA.FIVE_MINS_DISPLAYED_COLUMNS
    fixture.detectChanges()
    const element = fixture.debugElement.nativeElement
    expect(element.querySelector('.loading')).toBeTruthy()
  })
})
