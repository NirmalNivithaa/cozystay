
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee, Calendar, Clock, AlertCircle } from "lucide-react";

export default function PaymentAndCancellation() {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<string>("");

  const handlePayment = () => {
    // Implement payment logic here
    console.log("Processing payment:", selectedPayment);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0EA5E9] via-[#F2FCE2] to-[#FEC6A1]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Payment & Cancellation</h1>
          <Button
            onClick={() => navigate("/hotel")}
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
          >
            Back to Bookings
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-6 h-6 text-blue-500" />
                Payment Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Credit Card", "Debit Card", "UPI", "Net Banking"].map((method) => (
                <div
                  key={method}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPayment === method
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-blue-200"
                  }`}
                  onClick={() => setSelectedPayment(method)}
                >
                  <h3 className="font-semibold">{method}</h3>
                </div>
              ))}
              <Button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500"
                disabled={!selectedPayment}
              >
                Proceed to Pay
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-orange-500" />
                Cancellation Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-orange-700">48 Hours Before Check-in</h3>
                    <p className="text-sm text-gray-600">Full refund, no questions asked</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-yellow-700">24-48 Hours Before Check-in</h3>
                    <p className="text-sm text-gray-600">50% refund of total amount</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-700">Less than 24 Hours</h3>
                    <p className="text-sm text-gray-600">No refund available</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold mb-2">Important Notes:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>All times are calculated in local hotel time</li>
                  <li>Refunds are processed within 5-7 business days</li>
                  <li>Special events and peak season may have different policies</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
