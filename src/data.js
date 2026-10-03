export const mechanic = {
  id: "M001",
  name: "Rajesh Kumar",
  photo: `${import.meta.env.BASE_URL}assets/mechanic-photo.png`,
  rating: "4.9",
  jobs: "320+ jobs",
  verified: true,
  experience: "8+ years",
  distance: "2.4 km",
  eta: "12 min",
  phone: "+911234567890",
};

export const booking = {
  id: "ONR-2025-78432",
  service: "Battery Jump Start",
  vehicle: "Hyundai Creta",
  plate: "TS 09 AB 7843",
  vehicleColor: "White",
  location: "IKEA Hitec City, Hyderabad",
  address: "Survey No. 64, Hitec City, Hyderabad, TS 500081",
};

export const initialMessages = [
  {
    id: 1,
    from: "mechanic",
    text: "Hi! This is Rajesh Kumar. I'm on my way to your location for the battery jump start. I'll reach in about 12 minutes.",
    time: "10:16 AM",
  },
  {
    id: 2,
    from: "customer",
    text: "Thanks, Rajesh. I'm near IKEA Hitec City, in the parking area.",
    time: "10:17 AM",
  },
  {
    id: 3,
    from: "mechanic",
    text: "Got it! I'm currently 2.4 km away. Please stay near your vehicle and I'll be there shortly.",
    time: "10:18 AM",
  },
];
