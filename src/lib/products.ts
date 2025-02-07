import { supabase } from "./supabase";

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  stock_level: number;
  max_request_limit: number;
  unit: string;
}

export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as Product[];
};

export const createInventoryRequest = async (
  userId: string,
  items: { productId: string; quantity: number }[],
) => {
  // Start a Supabase transaction
  const { data: request, error: requestError } = await supabase
    .from("inventory_requests")
    .insert([{ user_id: userId }])
    .select()
    .single();

  if (requestError) throw requestError;

  // Insert all items
  const { error: itemsError } = await supabase
    .from("inventory_request_items")
    .insert(
      items.map((item) => ({
        request_id: request.id,
        product_id: item.productId,
        quantity: item.quantity,
      })),
    );

  if (itemsError) throw itemsError;

  // Create a notification for the request
  const { error: notificationError } = await supabase
    .from("notifications")
    .insert([
      {
        user_id: userId,
        title: "New Inventory Request",
        message: `Your inventory request #${request.id} has been submitted and is pending approval.`,
        status: "pending",
      },
    ]);

  if (notificationError) throw notificationError;

  return request;
};
