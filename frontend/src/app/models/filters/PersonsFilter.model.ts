import { Role } from "../Person.model";

export interface PersonsFilter {
    query: string;
    role: Role
}

export const DEFAULT_PERSONS_FILTERS: PersonsFilter = {
  query: '',
  role: Role.None
};