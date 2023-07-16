import type { BenchmarkId } from './api.js';
import type {
  AvailableProfile,
  CriterionData,
  Environment,
  RevisionData
} from '../backend/db/types.js';
import type { ComparisonStatistics, SummaryStatsWithUnit } from './stats.js';

declare type DataFormat = typeof import('./data-format.js');
declare type ViewHelpers = typeof import('./helpers.js');

/** Summary statistics for the overall comparison. */
export interface StatsSummary {
  stats: Record<string, SummaryStatsWithUnit>;

  /** The URL to a PNG with the overview statistics. */
  overviewPngUrl: string;

  /** The URLs to SVGs with the overview statistics. */
  overviewSvgUrls: string[];

  numRunConfigs: number;
}

export interface StatsSummaryPartial extends StatsSummary {
  config: ReportConfig;
  dataFormatters: DataFormat;
}

/** Types for the Compare Partials */

export type CompareStatsTableHeader = Record<string, CriterionData>;

export interface CompareStatsTableHeaderPartial {
  criteria: CompareStatsTableHeader;
  criteriaOrder: string[];
  dataFormatters: DataFormat;
  isAcrossExes: boolean;
}

export interface CompareStatsRowAcrossExes {
  exeName: string;
  criteria: Record<string, ComparisonStatistics>;
}

export interface CompareStatsRowAcrossExesPartial {
  exes: CompareStatsRowAcrossExes[];
  dataFormatters: DataFormat;
  viewHelpers: ViewHelpers;
  criteriaOrder: string[];
  criteria: CompareStatsTableHeader;
}

export type CompareStatsRowAcrossVersions = Record<
  string,
  ComparisonStatistics
>;

export interface CompareStatsRowAcrossVersionsPartial {
  stats: CompareStatsRowAcrossVersions;
  dataFormatters: DataFormat;
  criteriaOrder: string[];
  criteria: CompareStatsTableHeader;
}

/**
 * Identifies the set of measurements of a specific run, i.e., a concrete
 * benchmark execution, and a experiment.
 */
export interface DataSeriesId {
  commitId: string; // this one is a bit redundant, it's implied by the trialId
  expId: number;
}

export interface DataSeriesVersionComparison {
  runId: number;
  base: DataSeriesId;
  change: DataSeriesId;
}

export interface RunDetails {
  cmdline: string;

  envId: number;

  hasWarmup: boolean;

  profileBase: AvailableProfile | false;
  profileChange: AvailableProfile | false;

  dataSeries?: DataSeriesVersionComparison;

  /** Number of VarValues */
  numV: number;

  /** Number of Cores */
  numC: number;

  /** Number of Input Sizes */
  numI: number;

  /** Number of Extra Argument */
  numEa: number;

  /** Number of Environments */
  numEnv: number;
}

export interface MissingData {
  /* Commit hash for which the data is missing. */
  commitId: string;

  /* Criterion for which the data is missing. */
  criterion: CriterionData;
}

export interface CompareStatsRow {
  benchId: BenchmarkId;
  details: RunDetails;
  argumentsForDisplay: string;

  missing?: MissingData[];

  inlinePlot?: string;

  /** Statistics per criterion, comparing base and change. */
  versionStats?: CompareStatsRowAcrossVersions;
  exeStats?: CompareStatsRowAcrossExes[];
}

export interface CompareStatsRowPartial {
  stats: CompareStatsRow;
  environments: Environment[];
  dataFormatters: DataFormat;
  viewHelpers: ViewHelpers;
  config: ReportConfig;
  criteriaOrder: string[];
  criteria: CompareStatsTableHeader;
}

export interface ButtonsAdditionalInfoPartial {
  details: RunDetails;
  benchId: BenchmarkId;
  environments: Environment[];
  dataFormatters: DataFormat;
}

export interface CompareStatsTable {
  criteria: CompareStatsTableHeader;
  benchmarks: CompareStatsRow[];
  overviewSvgUrl?: string;
  baselineExeName?: string;
}

export interface CompareStatsTablePartial extends CompareStatsTable {
  environments: Environment[];
  dataFormatters: DataFormat;
  viewHelpers: ViewHelpers;
  config: ReportConfig;
  isAcrossExes: boolean;
}

export interface CompareNavPartial {
  nav: { exeName: string; suites: string[] }[];
  navExeComparison: { suites: string[] };
}

export type BySuiteComparison = Map<string, CompareStatsTable>;
export type ByExeSuiteComparison = Map<string, BySuiteComparison>;

export interface AllStats {
  acrossVersions: {
    summary: StatsSummary;
    allMeasurements: ByExeSuiteComparison;
  };
  acrossExes: BySuiteComparison;
}

export interface CompareStats extends AllStats {
  environments: Environment[];
}

export interface CompareVersionsPartial extends CompareStats {
  dataFormatters: DataFormat;
  viewHelpers: ViewHelpers;
  config: ReportConfig;
}

export interface RefreshMenuPartial {
  /* Name of the project. */
  project: string;

  /* Full commit hash of the base commit. */
  baselineHash: string;

  /* Full commit hash of the change commit. */
  changeHash: string;
}

export interface CompareViewBasics {
  /** Name of the project. */
  project: string;

  baselineHash: string;
  changeHash: string;

  baselineHash6: string;
  changeHash6: string;
}

export interface CompareViewWithoutData extends CompareViewBasics {
  revisionFound: false;
}

export interface CompareViewWithData extends CompareViewBasics {
  revisionFound: true;

  noData: boolean;
  notInBoth: any; // TODO

  base: RevisionData;
  change: RevisionData;

  navigation: CompareNavPartial;

  stats: CompareStats;
  config: ReportConfig;

  hasExeComparison: boolean;
}

export interface ReportConfig {
  /** The URL part where reports are stored, and publicly accessible. */
  reportsUrl: string;
  overviewPlotWidth: number;
}

export type CompareView = CompareViewWithoutData | CompareViewWithData;

export interface WarmupDataPerCriterion {
  criterion: string;
  unit: string;
  values: number[][];
}

export interface WarmupDataForTrial {
  trialId: number;
  warmup: number;
  data: WarmupDataPerCriterion[];
}

export interface WarmupData {
  trial1: WarmupDataForTrial;
  trial2: WarmupDataForTrial;
}
