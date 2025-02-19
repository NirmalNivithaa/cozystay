
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { IndianRupee, Star, UtensilsCrossed, XCircle } from "lucide-react";

interface Room {
  id: string;
  room_type: string;
  price: number;
  room_no: string;
  Status: string;
  room_images: string[];
  amenities: string[];
  room_features: {
    size: string;
    bed: string;
    view: string;
    bathroom: string;
    workspace?: boolean;
    kitchenette?: boolean;
  };
}

interface Booking {
  id: string;
  check_in: string;
  check_out: string;
  status: string;
  room_id: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<any>(null);
  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    fetchRooms();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user);
    if (session?.user) {
      fetchUserBookings(session.user.id);
    }
  };

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from("Room")
      .select("*")
      .eq("Status", "Available");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch rooms",
        variant: "destructive",
      });
      return;
    }

    setRooms(data || []);
  };

  const fetchUserBookings = async (userId: string) => {
    const { data, error } = await supabase
      .from("Booking")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
      return;
    }

    setBookings(data || []);
  };

  const handleBookRoom = async (roomId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to book a room",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDates.from || !selectedDates.to) {
      toast({
        title: "Error",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from("Booking")
      .insert([
        {
          room_id: roomId,
          user_id: user.id,
          check_in: selectedDates.from.toISOString(),
          check_out: selectedDates.to.toISOString(),
          status: "Confirmed",
        },
      ]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to book room",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Room booked successfully",
    });

    // Send confirmation email (you'll need to implement this)
    // This would typically be handled by a Supabase Edge Function

    fetchRooms();
    if (user) {
      fetchUserBookings(user.id);
    }
  };

  const calculateNights = () => {
    if (selectedDates.from && selectedDates.to) {
      const diffTime = Math.abs(selectedDates.to.getTime() - selectedDates.from.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-pink-50">
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Luxury Hotel Bookings</h1>
            <p className="text-xl">Experience unparalleled comfort and elegance</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-20">
        <div className="flex justify-end mb-8">
          {!user ? (
            <Button onClick={() => navigate("/auth")} className="bg-purple-600 hover:bg-purple-700">
              Login / Register
            </Button>
          ) : (
            <Button onClick={() => supabase.auth.signOut()} variant="outline">
              Logout
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle>Select Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="range"
                selected={selectedDates}
                onSelect={(range: any) => setSelectedDates(range)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5" />
                Restaurant & Amenities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1592861956120-e524fc739696?q=80&w=2070&auto=format&fit=crop" 
                  alt="Restaurant" 
                  className="rounded-lg w-full h-48 object-cover"
                />
                <div className="space-y-2">
                  <h3 className="font-semibold">Multicuisine Restaurant</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>International Cuisine</li>
                    <li>24/7 Room Service</li>
                    <li>Special Dietary Options</li>
                    <li>Premium Bar</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card key={room.id} className="bg-white shadow-xl hover:shadow-2xl transition-shadow">
                <div className="relative h-48">
                  <img
                    src={room.room_images?.[0] || "https://images.unsplash.com/photo-1611892440504-42a792e24d32"}
                    alt={room.room_type}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">4.5</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{room.room_type}</h3>
                  <div className="flex items-center gap-1 text-xl font-bold text-purple-600 mb-2">
                    <IndianRupee className="w-5 h-5" />
                    {room.price.toLocaleString('en-IN')}
                    <span className="text-sm text-gray-500">/night</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">Room {room.room_no}</p>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities?.map((amenity, index) => (
                        <span key={index} className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleBookRoom(room.id)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {user && bookings.length > 0 && (
          <Card className="mt-8 bg-white shadow-xl">
            <CardHeader>
              <CardTitle>Your Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">Booking ID: {booking.id}</p>
                      <p>Check-in: {new Date(booking.check_in).toLocaleDateString()}</p>
                      <p>Check-out: {new Date(booking.check_out).toLocaleDateString()}</p>
                      <p className="text-green-600">Status: {booking.status}</p>
                    </div>
                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
