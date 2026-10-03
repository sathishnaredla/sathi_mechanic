import { initialMessages, mechanic } from "./data.js";

export const mechanicService = {
  findMechanic: () =>
    new Promise((resolve) => {
      window.setTimeout(() => resolve(mechanic), 6500);
    }),
};

export const trackingService = {
  getLocation: (progress) => ({
    progress,
    eta: progress > 0.68 ? "4 min" : progress > 0.34 ? "8 min" : "12 min",
    distance: progress > 0.68 ? "0.8 km" : progress > 0.34 ? "1.6 km" : "2.4 km",
  }),
};

export const chatService = {
  getMessages: () => [...initialMessages],
  sendMessage: (text) => ({
    id: Date.now(),
    from: "customer",
    text,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }),
};
