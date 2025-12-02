import { LucideIcon } from 'lucide-react';

export type ToolCategory = 'All' | 'Finance' | 'Text' | 'Developer' | 'Content' | 'PDF' | 'Image' | 'Utility' | 'Office' | 'WebDev' | 'SEO' | 'Analytics' | 'Crypto' | 'Email' | 'DataScience' | 'Security';

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  isNew?: boolean;
  popular?: boolean;
}

export type ViewState = 'HOME' | 'TOOL_VIEW';

export interface NavItem {
  label: string;
  id: string;
}

export interface AiResponse {
  text: string;
  error?: string;
}