export type PetType = 'dog' | 'cat' | 'bird' | 'fish' | 'rabbit' | 'other';

export type ExpenseCategory =
  | 'food'
  | 'healthcare'
  | 'grooming'
  | 'toys'
  | 'training'
  | 'other';

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  photo?: string;
  dateAdded: string;
}

export interface Expense {
  id: string;
  petId: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  notes?: string;
}

export interface Budget {
  id: string;
  petId: string;
  category: ExpenseCategory;
  monthlyLimit: number;
}

export interface RecurringExpense {
  id: string;
  petId: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  startDate: string;
  paidThisMonth: boolean;
  lastPaidDate?: string;
}

export interface AnnualEstimate {
  id: string;
  petId: string;
  name: string;
  monthlyExpenses: Record<ExpenseCategory, number>;
  oneTimeExpenses: Record<string, number>;
  createdAt: string;
}

export const CATEGORY_CONFIG: Record<ExpenseCategory, { label: string; color: string; bgClass: string; borderClass: string }> = {
  food: {
    label: 'Food',
    color: 'hsl(36, 100%, 50%)', // Material Design 3 - Bright Orange
    bgClass: 'bg-category-food',
    borderClass: 'border-category-food'
  },
  healthcare: {
    label: 'Healthcare',
    color: 'hsl(4, 90%, 58%)', // Material Design 3 - Vibrant Red
    bgClass: 'bg-category-healthcare',
    borderClass: 'border-category-healthcare'
  },
  grooming: {
    label: 'Grooming',
    color: 'hsl(187, 100%, 38%)', // Material Design 3 - Bright Cyan
    bgClass: 'bg-category-grooming',
    borderClass: 'border-category-grooming'
  },
  toys: {
    label: 'Toys & Accessories',
    color: 'hsl(291, 64%, 42%)', // Material Design 3 - Vivid Purple
    bgClass: 'bg-category-toys',
    borderClass: 'border-category-toys'
  },
  training: {
    label: 'Training',
    color: 'hsl(207, 90%, 54%)', // Material Design 3 - Bright Blue
    bgClass: 'bg-category-training',
    borderClass: 'border-category-training'
  },
  other: {
    label: 'Other',
    color: 'hsl(200, 18%, 46%)', // Material Design 3 - Blue Gray
    bgClass: 'bg-category-other',
    borderClass: 'border-category-other'
  },
};

export const PET_TYPE_CONFIG: Record<PetType, { label: string; emoji: string; defaultImage: string }> = {
  dog: {
    label: 'Dog',
    emoji: '🐕',
    defaultImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpgejgI3DQGUNat4hRUxnY-WtsaM76wafz3Aqr8Nj4FNbJqFYsm3Mi5_u6VaF3UHRRAjwxXPXaeyDlXgS_SoqdM2RK6Ptr0GysFH0NK9uW-TmQMPH9nYVpsKg188NxzIcQdlHAYaYXcXORI4IOA0BkYa3UQI6Vek7CH-eOjPIPjk_TWmkwe_jC3dXWwvT6gIEHG19Uvt8EnfkDPpCFrQo53RsfNJ7ImvJVrgd1pbupPb_7OtedGHqhbXrBMlkCSIY66BeWOKfYoYs'
  },
  cat: {
    label: 'Cat',
    emoji: '🐱',
    defaultImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzsIFZiRIzg1XSCYlmpdySHhz6ZPZCc0JuqTV1fyErV45CDwv5idLpgfDf_bSMzNmJXbjFoi9jL9CJAredbh-lD6wovu86M1LBIk8bnpOP5vTZEUon_yoVLXdl4kHy8Rfo4-bPXJTaMlFRXic65-7-UlrpDaAYZAFiOKD0CheuGMA_8BQTrEYikC2txwez4FMCvHpS-yl4Q0TS0EqZsVoWhLLMX7leWt619ofLVurohENxGOdjbmt4-RaLZKfjlR2W0MwuJXCkGzI'
  },
  bird: {
    label: 'Bird',
    emoji: '🐦',
    defaultImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACJGaMXIkcziNXy6hbtxzgPiZAHkEMRjRHLMsVmGae-zRJYAc29ShMdZyE1gQ0y8cNspYR-rosD1sGeW184Dj1H4KBzRGO5UWLJaPsfZDKZW10k5NltqJlMJZJbmCTVGzQTL9f6LF-My7CoXfvyBtN7mfgBz2v75bM4Sj8W6hAPEopEVsJ02KKmQ6ejTwK4CMKMYMgde0GB1NdajE3q8m0Uqo5jbv9LAmqHtyleaCft3xaRWs25TBN00oKxPc_e4iICsrqhyPBYEQ'
  },
  fish: {
    label: 'Fish',
    emoji: '🐠',
    defaultImage: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400&h=400&fit=crop'
  },
  rabbit: {
    label: 'Rabbit',
    emoji: '🐰',
    defaultImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtGiJdeBklzicK7RmLuM-jk72iPcnBTyKg0Ose6o3c5tjbuc8OjIpRDzeZgGPAHUWQWBUa8Xl_CCWmBxABO42tBPydLa0MOVHCLeXrBOcL1WZv9USHS6vqiVg5S-ClkY8QU6HLl1fAyF8NaPXP84BK_3-VJKJR5esabZRkCr-Uw5Ywnls1f_ZN_WdOC4hOSJOlhdKbRcUBq_uxh20AF9zbH9Njog8B4bCC3nIwr5DGWrcshbYKrh6aXK7Ahw8jDYcX97oS88JK4aM'
  },
  other: {
    label: 'Other',
    emoji: '🐾',
    defaultImage: 'https://images.unsplash.com/photo-1599147569106-92d137b7dd2c?w=400&h=400&fit=crop'
  },
};
