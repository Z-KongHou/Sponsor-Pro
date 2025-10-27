export interface info {
  id: number;
  title: string;
  type: string;
  categories?: string;
  position?: string;
  time_from: string;
  time_end: string;
  amount: number;
  description?: string;
  initiatorId: number;
  receiverId?: number;
}

export interface detailinfo {
  id: number;
  title: string;
  type: string;
  categories?: string;
  position?: string;
  time_from: string;
  time_end: string;
  amount: number;
  description?: string;
  initiatorId: number;
  receiverId?: number;
  initiatorIdToUser:{
    avatarurl?: string;
    email: string;
    name: string;
    phone: string;
  }
}
