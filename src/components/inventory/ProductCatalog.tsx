import React from "react";
import ProductCard from "./ProductCard";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Filter } from "lucide-react";

interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  stockLevel: number;
  maxRequestLimit: number;
  price: number;
  unit: string;
}

interface ProductCatalogProps {
  products?: Product[];
  onRequestChange?: (productId: string, quantity: number) => void;
}

const ProductCatalog = ({
  products = [
    {
      id: "1",
      name: "Office Paper",
      image: "https://images.unsplash.com/photo-1589330694653-ded6df03f754",
      description: "High-quality A4 printer paper, 500 sheets per ream",
      stockLevel: 150,
      maxRequestLimit: 50,
      price: 4.99,
      unit: "reams",
    },
    {
      id: "2",
      name: "Ballpoint Pens",
      image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd",
      description: "Medium point blue ink pens, pack of 12",
      stockLevel: 75,
      maxRequestLimit: 30,
      price: 3.99,
      unit: "packs",
    },
    {
      id: "3",
      name: "Sticky Notes",
      image: "https://images.unsplash.com/photo-1586892477838-2b96e85e0f96",
      description: "3x3 inch yellow sticky notes, pack of 100",
      stockLevel: 25,
      maxRequestLimit: 20,
      price: 2.49,
      unit: "packs",
    },
    {
      id: "4",
      name: "Stapler",
      image: "https://images.unsplash.com/photo-1612613524827-904fa4ef1834",
      description: "Desktop stapler with 20-sheet capacity",
      stockLevel: 45,
      maxRequestLimit: 10,
      price: 8.99,
      unit: "units",
    },
  ],
  onRequestChange = () => {},
}: ProductCatalogProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredProducts, setFilteredProducts] = React.useState(products);

  React.useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  return (
    <div className="w-full h-full bg-gray-50 p-6">
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
