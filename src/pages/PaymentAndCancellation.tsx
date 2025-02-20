
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IndianRupee, Calendar, Clock, AlertCircle, CreditCard, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentDetails {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  upiId?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

export default function PaymentAndCancellation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({});
  const [processing, setProcessing] = useState(false);

  const validatePaymentDetails = (): boolean => {
    if (!selectedPayment) return false;

    switch (selectedPayment) {
      case "Credit Card":
      case "Debit Card":
        return !!(
          paymentDetails.cardNumber?.length === 16 &&
          paymentDetails.cardHolder &&
          paymentDetails.expiryDate &&
          paymentDetails.cvv?.length === 3
        );
      case "UPI":
        return !!(paymentDetails.upiId && paymentDetails.upiId.includes("@"));
      case "Net Banking":
        return !!(
          paymentDetails.bankName &&
          paymentDetails.accountNumber &&
          paymentDetails.ifscCode
        );
      default:
        return false;
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      if (!validatePaymentDetails()) {
        toast({
          title: "Validation Error",
          description: "Please fill all required payment details",
          variant: "destructive",
        });
        return;
      }

      // Simulate payment processing
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        // Update booking status in database
        const { error } = await supabase
          .from("Booking")
          .update({ status: "Confirmed" })
          .eq("status", "Pending Payment")
          .single();

        if (error) throw error;

        toast({
          title: "Payment Successful",
          description: "Your booking has been confirmed!",
          variant: "default",
        });
        navigate("/payment-success");
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again or use a different payment method",
        variant: "destructive",
      });
      navigate("/payment-failed");
    } finally {
      setProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    switch (selectedPayment) {
      case "Credit Card":
      case "Debit Card":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <Input
                type="text"
                maxLength={16}
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber || ""}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Card Holder Name</label>
              <Input
                type="text"
                placeholder="JOHN DOE"
                value={paymentDetails.cardHolder || ""}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, cardHolder: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={paymentDetails.expiryDate || ""}
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <Input
                  type="password"
                  maxLength={3}
                  placeholder="123"
                  value={paymentDetails.cvv || ""}
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, cvv: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        );

      case "UPI":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">UPI ID</label>
              <Input
                type="text"
                placeholder="username@upi"
                value={paymentDetails.upiId || ""}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, upiId: e.target.value })
                }
              />
            </div>
          </div>
        );

      case "Net Banking":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bank Name</label>
              <Input
                type="text"
                placeholder="Enter your bank name"
                value={paymentDetails.bankName || ""}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, bankName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Account Number</label>
              <Input
                type="text"
                placeholder="Enter account number"
                value={paymentDetails.accountNumber || ""}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">IFSC Code</label>
              <Input
                type="text"
                placeholder="Enter IFSC code"
                value={paymentDetails.ifscCode || ""}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, ifscCode: e.target.value })
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
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
                <CreditCard className="w-6 h-6 text-blue-500" />
                Payment Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {["Credit Card", "Debit Card", "UPI", "Net Banking"].map((method) => (
                  <div
                    key={method}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPayment === method
                        ? "border-blue-500 bg-blue-50"
                        : "hover:border-blue-200"
                    }`}
                    onClick={() => {
                      setSelectedPayment(method);
                      setPaymentDetails({});
                    }}
                  >
                    <h3 className="font-semibold">{method}</h3>
                  </div>
                ))}
              </div>

              {renderPaymentForm()}

              <Button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500"
                disabled={!validatePaymentDetails() || processing}
              >
                {processing ? "Processing..." : "Proceed to Pay"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-orange-500" />
                Payment Status Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-700">Payment Success</h3>
                    <p className="text-sm text-gray-600">
                      Your booking will be confirmed immediately after successful payment
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-700">Payment Failure</h3>
                    <p className="text-sm text-gray-600">
                      Don't worry if payment fails. You can try again with the same or different payment method
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold mb-2">Important Notes:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Your payment information is secure and encrypted</li>
                  <li>No additional charges will be applied</li>
                  <li>24/7 customer support available</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
