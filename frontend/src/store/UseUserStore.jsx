import axios from "axios";
import {create} from "zustand";

export const useUserStore = create((set)=>({
    user: null,
    setUser: (userData)=>set({user: userData}),
    loading: true,
    fetchUser: async ()=>{
        const { loading } = useUserStore.getState();
        if (!loading) return; // 👈 prevents double fetch

        const token = localStorage.getItem("accessToken");

        if (!token) {
            set({ loading: false });
            return;
        }

        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/user/user-profile`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            console.log("Fetched user:", res.data.data);
            set({ user: res.data.data });
        } catch (err) {
            console.error("Profile fetch error:",err.response?.data || err.message);
            localStorage.removeItem("accessToken");
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },
    logout: () => {
        localStorage.removeItem("accessToken");
        set({ user: null });
    },
}))