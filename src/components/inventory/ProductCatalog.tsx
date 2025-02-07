import React from "react";
import ProductCard from "./ProductCard";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Filter } from "lucide-react";
import { Product, fetchProducts, createInventoryRequest } from "@/lib/products";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  productId: string;
  quantity: number;
}

interface ProductCatalogProps {
  onRequestChange: (productId: string, quantity: number) => void;
}

const ProductCatalog = ({
  onRequestChange = () => {},
}: ProductCatalogProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  React.useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleRequestSubmit = async () => {
    if (!user || cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      await createInventoryRequest(user.id, cartItems);
      setCartItems([]);
      toast({
        title: "Request Submitted",
        description: "Your inventory request has been submitted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-lg border shadow-sm p-6">
      {cartItems.length > 0 && (
        <div className="mb-6 p-4 bg-primary/5 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Cart ({cartItems.length} items)</h3>
              <p className="text-sm text-gray-500">
                Review your items before submitting the request
              </p>
            </div>
            <Button onClick={handleRequestSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </div>
      )}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onRequestChange={(quantity) =>
              onRequestChange(product.id, quantity)
            }
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No products found matching your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
