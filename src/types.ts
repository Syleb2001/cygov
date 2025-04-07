// CSA Framework Types
export interface Requirement {
  id: string;
  title: string;
  description: string;
  cyfunLevel: 'basic' | 'important' | 'essential';
  subcategoryId: string;
  guidance: string[];
  references: Reference[];
}

export interface Subcategory {
  id: string;
  title: string;
  description: string;
  requirements: Requirement[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  subcategories: Subcategory[];
}

export interface Function {
  id: string;
  name: string;
  description: string;
  categories: Category[];
}

// Other types
export interface User {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cyfunLevel: 'basic' | 'important' | 'essential';
  twoFactorSecret?: string;
  twoFactorEnabled?: boolean;
  isAdmin?: boolean;
  isActive?: boolean; // New field to track if user has completed setup
}

export interface POI {
  id: string;
  controlId: string;
  userId: string;
  type: 'text' | 'image' | 'link';
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reference {
  name: string;
  clause?: string;
}

export interface Note {
  id: string;
  controlId: string;
  userId: string;
  companyId: string;
  content: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Deadline {
  id: string;
  controlId: string;
  userId: string;
  companyId: string;
  dueDate: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'deadline' | 'status' | 'poi' | 'note';
  title: string;
  message: string;
  controlId?: string;
  read: boolean;
  createdAt: string;
}

// Add types for admin panel
export interface AdminStats {
  totalUsers: number;
  totalControls: number;
  totalNotes: number;
  totalDeadlines: number;
  totalPois: number;
}