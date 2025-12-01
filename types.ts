

export interface TrivyVulnerability {
  VulnerabilityID?: string;
  PkgName?: string;
  PkgID?: string;
  FixedVersion?: string;
  PrimaryURL?: string;
  Title?: string;
  Description?: string;
  CweIDs?: string[];
}

export interface TrivyScan {
  scanId: string;
  image: string;
  Vulnerability: TrivyVulnerability[];
}


