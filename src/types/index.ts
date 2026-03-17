export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
}

export interface Complainant {
  id: string;
  name: string;
  address: string;
  contact: string;
  gender: string;
  age: number;
}

export interface Respondent {
  id: string;
  name: string;
  address: string;
  contact: string;
  gender: string;
  age: number;
}

export type CaseStatus = 'Pending' | 'Ongoing' | 'Settled';

export interface Case {
  id: string;
  docketNo: string;
  officialReceipt?: string;
  complainantId: string; // ID if existing, or just name
  complainantName: string;
  complainantAddress: string;
  complainantAge: string;
  complainantContact: string;
  respondentId: string; // ID if existing, or just name
  respondentName: string;
  respondentAddress: string;
  respondentAge: string;
  respondentContact: string;
  complaintType: string;
  description: string;
  incidentLocation: string;
  dateFiled: string;
  timeFiled: string;
  dispositionDate?: string;
  remarksComplainant?: string;
  remarksRespondent?: string;
  status: CaseStatus;
  luponMember?: string;
}

export interface Hearing {
  id: string;
  caseId: string;
  hearingDate: string;
  hearingTime: string;
  luponMember: string;
  notes: string;
}

export interface Settlement {
  id: string;
  caseId: string;
  agreementDetails: string;
  settlementDate: string;
  result: 'Settled' | 'Unresolved';
}
