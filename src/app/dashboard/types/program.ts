// Dashboard Program Types
export interface Program {
  id: number;
  group_name: string;
  program_short: string;
  program_long: string;
}

export interface GroupedPrograms {
  name: string;
  programs: Program[];
}
