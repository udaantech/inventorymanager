import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface RequestStatus {
  id: string;
  requestNumber: string;
  status: "pending" | "approved" | "rejected" | "processing";
  date: string;
  items: number;
  totalValue: number;
}

interface StatusTrackerProps {
  requests?: RequestStatus[];
}

const StatusTracker = ({
  requests = [
    {
      id: "1",
      requestNumber: "REQ-001",
      status: "pending",
      date: "2024-03-20",
      items: 5,
      totalValue: 1250.0,
    },
    {
      id: "2",
      requestNumber: "REQ-002",
      status: "approved",
      date: "2024-03-19",
      items: 3,
      totalValue: 750.0,
    },
    {
      id: "3",
      requestNumber: "REQ-003",
      status: "rejected",
      date: "2024-03-18",
      items: 4,
      totalValue: 1000.0,
    },
    {
      id: "4",
      requestNumber: "REQ-004",
      status: "processing",
      date: "2024-03-17",
      items: 2,
      totalValue: 500.0,
    },
  ],
}: StatusTrackerProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "processing":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2">
        <h2 className="text-xl font-semibold">Request Status Tracker</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {requests.map((request) => (
            <TooltipProvider key={request.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {request.requestNumber}
                      </span>
                      {getStatusIcon(request.status)}
                    </div>
                    <div className="space-y-2">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </Badge>
                      <div className="text-sm text-gray-500">
                        <div>Date: {request.date}</div>
                        <div>Items: {request.items}</div>
                        <div>Value: ${request.totalValue.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to view request details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusTracker;
