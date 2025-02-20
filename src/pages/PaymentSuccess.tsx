
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate("/hotel");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0EA5E9] via-[#F2FCE2] to-[#FEC6A1] flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your booking has been confirmed. Thank you for choosing our service.
          </p>
          <Button
            onClick={() => navigate("/hotel")}
            className="bg-green-500 hover:bg-green-600 text-white w-full"
          >
            Return to Bookings
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Auto-redirecting to bookings page in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
