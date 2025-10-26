export interface User {
  id: number
  open_id?: string
  name: string
  email: string
  phone: string
  role: string
  ClubMember?: ClubMember
  CompanyMember?: CompanyMember
  Teacher?: Teacher
}

export interface ClubMember {
  id: number
  userId: number
  category: string
  clubName: string
  school: string
  description: string
  User?: User
}

export interface CompanyMember {
  id: number
  userId: number
  industry: string
  companyName: string
  description: string
  User?: User
}

export interface Teacher {
  id: number
  subject: string
  department: string
  school: string
  userId: number
  User?: User
}
