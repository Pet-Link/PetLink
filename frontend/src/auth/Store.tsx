import { create } from 'zustand';

// Define the shape of your store's state
interface UserState {
    userType: string;
    setUserType: (uType: string) => void;
    // userID: string;
    // setUserID: (uID: string) => void;
}
  
// Create the store using Zustand
export const useUserStore = create<UserState>((set) => ({
    userType: "", 
    setUserType: (uType) => set((state) => ({ ...state, userType: uType })), // action to update the state
}));

