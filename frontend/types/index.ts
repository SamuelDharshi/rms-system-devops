export type JobStatus         = 'OPEN' | 'CLOSED';
export type ApplicationStatus = 'PENDING' | 'SELECTED' | 'REJECTED';

export interface Job {
  id:               string;
  title:            string;
  description:      string;
  skillsRequired:   string[];
  location:         string;
  status:           JobStatus;
  postedDate:       string;
  recruiterId:      string;
  recruiterName:    string;
  companyName:      string;
  applicationCount: number;   // Java uses this — NOT _count.applications
}

export interface Applicant {
  id:              string;
  name:            string;
  email:           string;
  phone?:          string;
  profileDetails?: string;    // stored as a JSON string in Java
}

export interface Recruiter {
  id:          string;
  name:        string;
  email:       string;
  companyName: string;
}

// Java returns a flat object — no nested job/applicant
export interface Application {
  id:                string;
  applicationDate:   string;
  applicationStatus: ApplicationStatus;
  coverLetter?:      string;
  // flat job fields
  jobId:       string;
  jobTitle:    string;
  jobLocation: string;
  jobStatus:   string;
  companyName: string;
  // flat applicant fields (present when recruiter views)
  applicantId:    string;
  applicantName:  string;
  applicantEmail: string;
  applicantPhone?: string;
}