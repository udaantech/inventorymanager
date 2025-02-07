import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/lib/products";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";

interface InventoryTableProps {
  products: Product[];
  onInventoryChange: () => void;
}

export default function InventoryTable({
  products,
  onInventoryChange,
}: InventoryTableProps) {
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAdjustment = async (
    productId: string,
    type: "add" | "remove" | "adjust",
  ) => {
    if (!user) return;

    const amount = adjustments[productId] || 0;
    if (amount === 0) return;

    setLoading((prev) => ({ ...prev, [productId]: true }));

    try {
      const { error } = await supabase.from("inventory_management").insert({
        product_id: productId,
        user_id: user.id,
        change_amount: type === "remove" ? -amount : amount,
        type,
        notes: `${type} ${amount} units`,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inventory updated successfully",
      });

      setAdjustments((prev) => ({ ...prev, [productId]: 0 }));
      onInventoryChange();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Adjust Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>
                {product.stock_level} {product.unit}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="0"
                    value={adjustments[product.id] || ""}
                    onChange={(e) =>
                      setAdjustments((prev) => ({
                        ...prev,
                        [product.id]: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-24"
                  />
                  <span className="text-sm text-gray-500">{product.unit}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdjustment(product.id, "add")}
                    disabled={loading[product.id] || !adjustments[product.id]}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdjustment(product.id, "remove")}
                    disabled={loading[product.id] || !adjustments[product.id]}
                  >
                    Remove
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
