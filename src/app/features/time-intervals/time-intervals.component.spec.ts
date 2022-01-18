import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { TimeIntervalsComponent } from './time-intervals.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { INTERVAL_RANGE_IN_MINUTES, INTERVALS, MONTHS } from '../../shared/consts'
import { MatSelectHarness } from '@angular/material/select/testing'
import { SharedModule } from '../../shared/shared.module'
import { MatButtonHarness } from '@angular/material/button/testing'
import { MockDataGeneratorService } from '../../shared/services/mock-data-generator.service'
import * as moment from 'moment'

describe('TimeIntervalsComponent', () => {
  let component: TimeIntervalsComponent
  let loader: HarnessLoader
  let spy: any
  let fixture: ComponentFixture<TimeIntervalsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeIntervalsComponent],
      imports: [SharedModule, BrowserAnimationsModule],
      providers: [MockDataGeneratorService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeIntervalsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    loader = TestbedHarnessEnvironment.loader(fixture)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
  describe('Filters', () => {
    it('should return  the default value 5 when the app is loaded', async () => {
      const select = await loader.getHarness(MatSelectHarness)
      await select.open()
      const res = await select.getValueText()

      expect(res).toBe(INTERVALS.FIVE_MINS)
      expect(component.intervalControl.value).toBe(INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE)
    })
    it('should return value 30 when every thirty is selected', async () => {
      const select = await loader.getHarness(MatSelectHarness)
      await select.open()
      const option = await select.getOptions()
      await option[1].click()
      const res = await select.getValueText()

      expect(res).toBe(INTERVALS.THIRTY_MINS)
      expect(component.intervalControl.value).toBe(INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY)
    })

    it('should return value 60 when every hour is selected', async () => {
      const select = await loader.getHarness(MatSelectHarness)
      await select.open()
      const option = await select.getOptions()
      await option[2].click()
      const res = await select.getValueText()

      expect(res).toBe(INTERVALS.ONE_HOUR)
      expect(component.intervalControl.value).toBe(INTERVAL_RANGE_IN_MINUTES.EVERY_SIXTY)
    })

    it('should return 11 when December is selected ', async () => {
      const select = await loader.getHarness(MatSelectHarness.with({ selector: '#month-select mat-select' }))
      await select.open()
      const option = await select.getOptions()
      await option[option.length - 1].click()
      const res = await select.getValueText()

      expect(res).toBe(MONTHS[MONTHS.length - 1])
      expect(component.monthControl.value).toBe(11)
    })

    it('should call the function generateMockData when the button "re-generate mockdata" is clicked ', async () => {
      const button = await loader.getHarness(MatButtonHarness.with({ selector: '#time-selector button' }))
      spyOn(component, 'generateMockData')
      await button.click()
      expect(component.generateMockData).toHaveBeenCalled()
    })
  })
  describe('Functions', () => {
    beforeEach(async () => {
      const button = await loader.getHarness(MatButtonHarness.with({ selector: '#time-selector button' }))
      spyOn(component, 'generateMockData')
      await button.click()
    })
    it('should assign values to rowsMonthMockData[selectedMonth] when generateMockData and no values were stored', async () => {
      expect(component.generateMockData).toHaveBeenCalled()
      expect(component.rowsMonthMockData[0].length).toBeGreaterThan(0)
    })
    it('should set sorted data from low to high int rowsMonthMockData when generateMockData is called', async () => {
      expect(component.generateMockData).toHaveBeenCalled()
      let lowest1 = moment('01-01-2022 00:00').unix()
      let highest1 = moment('01-01-2022 00:05').unix()
      let isBetween1 = moment(component.rowsMonthMockData[0][0].time).isBetween(lowest1, highest1)

      let lowest2 = moment('01-01-2022 00:05').unix()
      let highest2 = moment('01-01-2022 00:10').unix()
      let isBetween2 = moment(component.rowsMonthMockData[0][1].time).isBetween(lowest2, highest2)

      let lowest3 = moment('01-01-2022 00:10').unix()
      let highest3 = moment('01-01-2022 00:15').unix()
      let isBetween3 = moment(component.rowsMonthMockData[0][2].time).isBetween(lowest3, highest3)

      let isBetween4 = moment(component.rowsMonthMockData[0][3].time).isBetween(lowest1, highest1)
      let isBetween = isBetween1 && isBetween2 && isBetween3 && !isBetween4
      expect(isBetween).toBeTrue()
    })
  })
})
