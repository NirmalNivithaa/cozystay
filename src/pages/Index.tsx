
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { IndianRupee, Star, UtensilsCrossed, XCircle, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface RoomFeatures {
  size: string;
  bed: string;
  view: string;
  bathroom: string;
  workspace?: boolean;
  kitchenette?: boolean;
}

interface Room {
  id: string;
  room_type: string;
  price: number;
  room_no: string;
  Status: string;
  room_images: string[];
  amenities: string[];
  room_features: RoomFeatures;
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
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();

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

    const transformedRooms: Room[] = (data || []).map(room => ({
      ...room,
      room_features: typeof room.room_features === 'object' ? {
        size: String(room.room_features?.size || ''),
        bed: String(room.room_features?.bed || ''),
        view: String(room.room_features?.view || ''),
        bathroom: String(room.room_features?.bathroom || ''),
        workspace: Boolean(room.room_features?.workspace || false),
        kitchenette: Boolean(room.room_features?.kitchenette || false)
      } : {
        size: '',
        bed: '',
        view: '',
        bathroom: '',
        workspace: false,
        kitchenette: false
      }
    }));

    setRooms(transformedRooms);
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

  const handleCancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from("Booking")
      .update({ status: "Cancelled" })
      .eq("id", bookingId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Booking cancelled successfully",
    });

    if (user) {
      fetchUserBookings(user.id);
    }
  };

  const handleBookRoom = async (roomId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to book a room",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!checkInDate || !checkOutDate) {
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
          check_in: checkInDate.toISOString(),
          check_out: checkOutDate.toISOString(),
          status: "Pending Payment",
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

    navigate("/payment");
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
              <CardTitle>Select Check-in and Check-out Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in Date</label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={checkInDate ? format(checkInDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setCheckInDate(new Date(e.target.value))}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out Date</label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={checkOutDate ? format(checkOutDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setCheckOutDate(new Date(e.target.value))}
                      min={checkInDate ? format(checkInDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
                      className="w-full"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
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
                      <p className={`font-medium ${
                        booking.status === 'Cancelled' ? 'text-red-600' :
                        booking.status === 'Confirmed' ? 'text-green-600' :
                        'text-orange-600'
                      }`}>
                        Status: {booking.status}
                      </p>
                    </div>
                    {booking.status !== 'Cancelled' && (
                      <Button
                        onClick={() => handleCancelBooking(booking.id)}
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    )}
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
