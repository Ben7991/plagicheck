import { Department } from './department.type';

export type Faculty = {
  id: number;
  name: string;
  departments: Department[];
};
