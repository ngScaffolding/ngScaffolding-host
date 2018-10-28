import { Component, OnInit } from '@angular/core';
import { VersionsService, SoftwareVersion } from 'ngscaffolding-core';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  appModules: SoftwareVersion[];
  modules: SoftwareVersion[];

  constructor(private versions: VersionsService) {}

  ngOnInit() {
    const versions = this.versions.getVersions();

    this.appModules = new Array<SoftwareVersion>();
    this.modules = new Array<SoftwareVersion>();

    versions.forEach(version => {
      if (version.isAppModule) {
        this.appModules.push(version);
      } else {
        this.modules.push(version);
      }
    });
  }
}
