import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

type Settings = {
  shop_name: string;
  currency_symbol: string;
};

type Auth = {
  user: {
    id: number;
    name: string;
    email: string;
    // agrega otros campos si los usas
  } | null;
};

export interface SharedData {
  auth: Auth;
  settings: Settings;
  modules: any[]; // o define mejor si conoces su forma
  userPermissions: string[];
  ziggy: Config & { location: string };
  [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
