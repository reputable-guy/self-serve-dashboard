/**
 * Role-based access system for Reputable platform
 *
 * Admin: Reputable internal team - can create studies, manage brands
 * Brand: Customer accounts - can view their studies and results
 */

export type UserRole = 'admin' | 'brand';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  brandId?: string; // Only for brand users
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  contactEmail: string;
  contactName: string;
  createdAt: Date;
  studyCount: number;
  activeStudyCount: number;
}

// Mock current user - in production this would come from auth
export function getCurrentUser(): User {
  // Default to admin for development
  return {
    id: 'user-1',
    email: 'admin@reputable.health',
    name: 'Admin User',
    role: 'admin',
  };
}

// Check if user has admin access
export function isAdmin(user: User): boolean {
  return user.role === 'admin';
}

// Check if user can access a specific brand's data
export function canAccessBrand(user: User, brandId: string): boolean {
  if (user.role === 'admin') return true;
  return user.brandId === brandId;
}

// Get display name for role
export function getRoleDisplayName(role: UserRole): string {
  return role === 'admin' ? 'Reputable Admin' : 'Brand';
}

// Mock brands data
export const MOCK_BRANDS: Brand[] = [
  {
    id: 'brand-acme',
    name: 'Acme Supplements',
    slug: 'acme-supplements',
    logoUrl: undefined,
    contactEmail: 'john@acme-supplements.com',
    contactName: 'John Smith',
    createdAt: new Date('2024-06-15'),
    studyCount: 3,
    activeStudyCount: 2,
  },
  {
    id: 'brand-zenwell',
    name: 'ZenWell',
    slug: 'zenwell',
    logoUrl: undefined,
    contactEmail: 'sarah@zenwell.co',
    contactName: 'Sarah Johnson',
    createdAt: new Date('2024-08-20'),
    studyCount: 2,
    activeStudyCount: 1,
  },
  {
    id: 'brand-vitality',
    name: 'Vitality Labs',
    slug: 'vitality-labs',
    logoUrl: undefined,
    contactEmail: 'mike@vitalitylabs.com',
    contactName: 'Mike Chen',
    createdAt: new Date('2024-10-05'),
    studyCount: 1,
    activeStudyCount: 1,
  },
  {
    id: 'brand-naturasleep',
    name: 'NaturaSleep',
    slug: 'naturasleep',
    logoUrl: undefined,
    contactEmail: 'emma@naturasleep.com',
    contactName: 'Emma Davis',
    createdAt: new Date('2024-11-12'),
    studyCount: 1,
    activeStudyCount: 0,
  },
];

// Get all brands (admin only)
export function getAllBrands(): Brand[] {
  return MOCK_BRANDS;
}

// Get brand by ID
export function getBrandById(id: string): Brand | undefined {
  return MOCK_BRANDS.find(b => b.id === id);
}

// Get brand by slug
export function getBrandBySlug(slug: string): Brand | undefined {
  return MOCK_BRANDS.find(b => b.slug === slug);
}
