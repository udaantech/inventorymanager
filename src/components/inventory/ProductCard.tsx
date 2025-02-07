import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { MinusIcon, PlusIcon, AlertCircle } from "lucide-react";
import { Product } from "@/lib/products";

interface ProductCardProps extends Partial<Product> {
  onRequestChange: (quantity: number) => void;
}

const ProductCard = ({
  id = "1",
  name = "Sample Product",
  image = "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  description = "A high-quality product for your inventory needs",
  stock_level = 100,
  max_request_limit = 50,
  price = 29.99,
  unit = "units",
  onRequestChange = () => {},
}: ProductCardProps) => {
  const [requestQuantity, setRequestQuantity] = React.useState(0);

  const handleIncrement = () => {
    if (requestQuantity < max_request_limit) {
      const newQuantity = requestQuantity + 1;
      setRequestQuantity(newQuantity);
      onRequestChange(newQuantity);
    }
  };

  const handleDecrement = () => {
    if (requestQuantity > 0) {
      const newQuantity = requestQuantity - 1;
      setRequestQuantity(newQuantity);
      onRequestChange(newQuantity);
    }
  };

  const getStockLevelColor = () => {
    if (stock_level > 50) return "bg-green-100 text-green-800";
    if (stock_level > 20) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card className="w-[280px] bg-white">
      <CardHeader className="p-4">
        <div className="aspect-square w-full overflow-hidden rounded-lg">
          <img src={image} alt={name} className="h-full w-full object-cover" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <Badge variant="secondary" className={getStockLevelColor()}>
            {stock_level} {unit}
          </Badge>
        </div>
        <p className="mt-2 text-lg font-bold">${price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={requestQuantity === 0}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center">{requestQuantity}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleIncrement}
                    disabled={requestQuantity >= max_request_limit}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Max request: {max_request_limit} {unit}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {requestQuantity >= max_request_limit && (
          <div className="flex items-center text-yellow-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">Limit reached</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
