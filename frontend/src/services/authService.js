import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "firebase/auth";

import { auth } from "../firebase/firebase";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async (role = "student") => {
    try {
        // Login Google popup
        const result = await signInWithPopup(auth, provider);

        const user = result.user;

        // Gửi lên backend
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/google-auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                role: role,
            }),
        });

        const data = await res.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        return { data: data.data, token: data.token };

    } catch (error) {
        console.error("Google Login Error:", error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
    }
};