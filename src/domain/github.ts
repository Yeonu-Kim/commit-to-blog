export type ContributionDay = {
  date: string;
  contributionCount: number;
  color: string;
  weekday: number;
};

export type Week = {
  contributionDays: ContributionDay[];
};

export type Month = {
  name: string;
  year: number;
  firstDay: string;
  totalWeeks: number;
};

export type Commit = {
  message: string;
  url: string;
  sha: string;
};

type ProjectActivity = {
  projectId: string;
  commits: Commit[];
};

export type DayActivity = {
  date: string;
  totalCount: number;
  summary: string[];
  projects: ProjectActivity[];
};
