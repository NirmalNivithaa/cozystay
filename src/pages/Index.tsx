
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Room {
  id: string;
  room_type: string;
  price: number;
  room_no: string;
  Status: string;
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

    fetchRooms();
    if (user) {
      fetchUserBookings(user.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Luxury Hotel Bookings</h1>
          {!user ? (
            <Button onClick={() => navigate("/auth")}>Login / Register</Button>
          ) : (
            <Button onClick={() => supabase.auth.signOut()}>Logout</Button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
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

          <Card>
            <CardHeader>
              <CardTitle>Available Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-4 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold">{room.room_type}</h3>
                      <p className="text-sm text-gray-500">Room {room.room_no}</p>
                      <p className="text-lg font-bold">${room.price}/night</p>
                    </div>
                    <Button onClick={() => handleBookRoom(room.id)}>
                      Book Now
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {user && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 border rounded-lg"
                  >
                    <p className="font-semibold">Booking ID: {booking.id}</p>
                    <p>Check-in: {new Date(booking.check_in).toLocaleDateString()}</p>
                    <p>Check-out: {new Date(booking.check_out).toLocaleDateString()}</p>
                    <p className="text-green-600">Status: {booking.status}</p>
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
