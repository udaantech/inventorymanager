import { supabase } from "./supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface Notification {
  id: string;
  title: string;
  message: string;
  status: "pending" | "approved" | "rejected" | "processing";
  created_at: string;
  read: boolean;
}

export const subscribeToNotifications = (
  userId: string,
  onNotification: (notification: Notification) => void,
): RealtimeChannel => {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const notification = payload.new as Notification;
        onNotification(notification);
      },
    )
    .subscribe();

  return channel;
};

export const fetchNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Notification[];
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);

  if (error) throw error;
};
