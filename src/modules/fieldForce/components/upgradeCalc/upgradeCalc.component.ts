import { Component, OnChanges, SimpleChange } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  InputBuilderDefinition,
  InputDetail,
  InputTypes,
  InputDetailSlider
} from '@ngscaffolding/models';
import { DataSourceService } from 'ngscaffolding-core';

class UpgradeModel {
  minimumMemory: number;
  minimumHardDrive: number;
  minimumProcessor: number;
  costMemory: number;
  costHardDrive: number;
  costProcessor: number;
  countMemory: number;
  countHardDrive: number;
  countProcessor: number;
  totalCostMemory: number;
  totalCostHardDrive: number;
  totalCostProcessor: number;
  countPassed: number;
  countFailed: number;

}

@Component({
  templateUrl: 'upgradeCalc.component.html',
  styles: ['upgradeCalc.component.scss']
})
export class UpgradeCalcComponent implements OnChanges {
  upgradeValuesModel: UpgradeModel = {
    minimumMemory: 2,
    minimumHardDrive: 64,
    minimumProcessor: 1,
    costMemory: 140,
    costHardDrive: 80,
    costProcessor: 220,

    countPassed: 0,
    countFailed: 0,

    countMemory: 0,
    countHardDrive: 0,
    countProcessor: 0,
    totalCostMemory: 0,
    totalCostHardDrive: 0,
    totalCostProcessor: 0
  };

  constructor(private dataSource: DataSourceService) {}

  resultsAvailable: boolean;

  upgradeInputs: InputBuilderDefinition = {
    inputDetails: [
      <InputDetailSlider>{
        label: 'Minimum Memory',
        name: 'minimumMemory',
        type: InputTypes.slider,
        min: 1,
        max: 64,
        help: 'Minimum Memory Required to work'
      },
      <InputDetailSlider>{
        label: 'Minimum HardDrive',
        name: 'minimumHardDrive',
        type: InputTypes.slider,
        min: 1,
        max: 128,
        help: 'Minimum HardDrive Required to work'
      },
      <InputDetailSlider>{
        label: 'Minimum Processor (Ghz)',
        name: 'minimumProcessor',
        type: InputTypes.slider,
        min: 1,
        max: 6,
        step: 0.2,
        help: 'Minimum Processor Required to work'
      },
      <InputDetail>{
        label: 'Cost Upgrade Memory',
        name: 'costMemory',
        type: InputTypes.number,
        help: 'Cost to upgrade memory'
      },
      <InputDetail>{
        label: 'Cost Upgrade HardDrive',
        name: 'costHardDrive',
        type: InputTypes.number,
        help: 'Cost to upgrade HardDrive'
      },
      <InputDetail>{
        label: 'Cost Upgrade Processor',
        name: 'costProcessor',
        type: InputTypes.number,
        help: 'Cost to upgrade Processor'
      }
    ],
    okButtonText: 'Calculate'
  };

  upgradeChanged(event: any) {}

  modelChanged(newValues: any) {
    this.upgradeValuesModel = newValues;
  }

  calculate() {
  this.resultsAvailable = false;

    forkJoin([
      this.dataSource.getData({name: 'Finder.CalculatorPassed', inputData: JSON.stringify(this.upgradeValuesModel)}),
      this.dataSource.getData({name: 'Finder.CalculatorFailed', inputData: JSON.stringify(this.upgradeValuesModel)})
    ]).subscribe(resultsCol => {
      const succeeded = JSON.parse(resultsCol[0].jsonData);
      const failed: Array<any> = JSON.parse(resultsCol[1].jsonData);

      this.upgradeValuesModel.countPassed = succeeded.length;
      this.upgradeValuesModel.countFailed = failed.length;

      this.upgradeValuesModel.countHardDrive = 0;
      this.upgradeValuesModel.countMemory = 0;
      this.upgradeValuesModel.countProcessor = 0;

      this.upgradeValuesModel.totalCostHardDrive = 0;
      this.upgradeValuesModel.totalCostMemory = 0;
      this.upgradeValuesModel.totalCostProcessor = 0;

      this.upgradeValuesModel.countHardDrive = failed.filter(computer => computer.HDDSize < (this.upgradeValuesModel.minimumHardDrive) * 1000000000).length;
      this.upgradeValuesModel.countMemory = failed.filter(computer => computer.TotalPhysicalMemory < (this.upgradeValuesModel.minimumMemory) * 1000000000).length;
      this.upgradeValuesModel.countProcessor = failed.filter(computer => computer.MaxClockSpeed < (this.upgradeValuesModel.minimumProcessor) * 1000).length;

      this.upgradeValuesModel.totalCostHardDrive = this.upgradeValuesModel.countHardDrive * this.upgradeValuesModel.costHardDrive;
      this.upgradeValuesModel.totalCostMemory = this.upgradeValuesModel.countMemory * this.upgradeValuesModel.costMemory;
      this.upgradeValuesModel.totalCostProcessor = this.upgradeValuesModel.countProcessor * this.upgradeValuesModel.costProcessor;

      this.resultsAvailable = true;
    });

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {}
}
