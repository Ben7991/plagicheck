import { Faculty } from '../../../util/types/faculty.type';

export type FacultyState = {
  hasData: boolean;
  data: Faculty[];
  count: number;
};
