export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Maturity = 'concept' | 'production';
export type PublicationStatus = 'draft' | 'published' | 'archived';
export type ProjectType =
  | 'web_app'
  | 'pwa'
  | 'saas'
  | 'ecommerce'
  | 'landing_page'
  | 'portfolio'
  | 'customizable'
  | 'saas_candidate';

export interface GalleryItem {
  path: string;
  alt: string;
  caption?: string;
}

export interface BuildLogEntry {
  date: string;
  text: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  problem: string | null;
  content: string | null;
  features: string[];
  limitations: string | null;
  tech_stack: string[];
  tags: string[];
  maturity: Maturity;
  publication_status: PublicationStatus;
  project_type: ProjectType;
  cover_path: string | null;
  cover_alt: string | null;
  gallery: GalleryItem[];
  build_log: BuildLogEntry[];
  demo_url: string | null;
  source_url: string | null;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  cover_path: string | null;
  cover_alt: string | null;
  publication_status: PublicationStatus;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostProject {
  post_id: string;
  project_id: string;
}

export interface Admin {
  user_id: string;
}

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: {
          id?: string;
          title: string;
          slug: string;
          summary: string;
          problem?: string | null;
          content?: string | null;
          features?: string[] | Json;
          limitations?: string | null;
          tech_stack?: string[];
          tags?: string[];
          maturity: Maturity;
          publication_status?: PublicationStatus;
          project_type: ProjectType;
          cover_path?: string | null;
          cover_alt?: string | null;
          gallery?: GalleryItem[] | Json;
          build_log?: BuildLogEntry[] | Json;
          demo_url?: string | null;
          source_url?: string | null;
          is_featured?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          summary?: string;
          problem?: string | null;
          content?: string | null;
          features?: string[] | Json;
          limitations?: string | null;
          tech_stack?: string[];
          tags?: string[];
          maturity?: Maturity;
          publication_status?: PublicationStatus;
          project_type?: ProjectType;
          cover_path?: string | null;
          cover_alt?: string | null;
          gallery?: GalleryItem[] | Json;
          build_log?: BuildLogEntry[] | Json;
          demo_url?: string | null;
          source_url?: string | null;
          is_featured?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: Post;
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          tags?: string[];
          cover_path?: string | null;
          cover_alt?: string | null;
          publication_status?: PublicationStatus;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          tags?: string[];
          cover_path?: string | null;
          cover_alt?: string | null;
          publication_status?: PublicationStatus;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      post_projects: {
        Row: PostProject;
        Insert: PostProject;
        Update: Partial<PostProject>;
        Relationships: [
          {
            foreignKeyName: 'post_projects_post_id_fkey';
            columns: ['post_id'];
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_projects_project_id_fkey';
            columns: ['project_id'];
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          }
        ];
      };
      admins: {
        Row: Admin;
        Insert: Admin;
        Update: Partial<Admin>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
};
