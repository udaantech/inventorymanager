export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: "branch_manager" | "hq_admin";
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: "branch_manager" | "hq_admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "branch_manager" | "hq_admin";
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          status: "pending" | "approved" | "rejected" | "processing";
          created_at: string;
          read: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          status: "pending" | "approved" | "rejected" | "processing";
          created_at?: string;
          read?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          status?: "pending" | "approved" | "rejected" | "processing";
          created_at?: string;
          read?: boolean;
        };
      };
    };
  };
}
