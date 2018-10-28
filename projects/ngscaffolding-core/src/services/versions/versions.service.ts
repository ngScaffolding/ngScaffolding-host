import { Injectable } from '@angular/core';
import { LoggingService } from '../logging/logging.service';

export class SoftwareVersion {
  module: string;
  version: string;
  isAppModule: boolean;
}


@Injectable()
export class VersionsService {
  private versions: SoftwareVersion[];

  constructor(private logging: LoggingService) {
    this.versions = [];
  }
  addVersion(module: string, version: string, isAppModule = false) {
    this.logging.info(`Loading Module ${module} Version ${version} IsAppModule ${isAppModule}`);
    this.versions.push({
      module: module,
      version: version,
      isAppModule: isAppModule
    });
  }
  getVersions(): SoftwareVersion[] {
    return this.versions;
  }
}
