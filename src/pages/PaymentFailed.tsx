
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0EA5E9] via-[#F2FCE2] to-[#FEC6A1] flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6">
            We couldn't process your payment. Please try again or use a different payment method.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/payment")}
              className="bg-blue-500 hover:bg-blue-600 text-white w-full"
            >
              Try Again
            </Button>
            <Button
              onClick={() => navigate("/hotel")}
              variant="outline"
              className="w-full"
            >
              Return to Bookings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
