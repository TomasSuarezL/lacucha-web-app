import Router from "next/router";
import firebase from "firebase/app";
import "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Usuario } from "../components/usuarios/Usuario.type";
import { useError } from "./useError";

// Based on the example on https://usehooks.com/useAuth/

interface User extends firebase.User, Usuario {
  idToken: string;
}

// Configure Firebase.
const config = {
  apiKey: "AIzaSyD98jGZGIKFVLBQGgZi9MCdJeGho4zIlgI",
  authDomain: "lacucha-c4139.firebaseapp.com",
  projectId: "lacucha-c4139",
  storageBucket: "lacucha-c4139.appspot.com",
  messagingSenderId: "1096899864851",
  appId: "1:1096899864851:web:cec32d6ac233a7439592e6",
  measurementId: "G-QKB7JT11D3",
};

if (!firebase.apps.length) firebase.initializeApp(config);

const AuthContext = createContext<{ user: User; loading: Boolean; signout: () => Promise<void> }>(null);

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useFirebaseUser();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext);
};

export const useFirebaseUser = () => {
  const error = useError();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
        Router.push("/login");
      });
  };

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        let userToken = await user.getIdToken();

        try {
          let response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/usuarios/Oueo4BZj6iZPFyXFV04o8n7rVc83`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          console.log(response.data);
          setUser({ ...user, idToken: userToken, ...response.data });
        } catch (ex) {
          console.log(ex.message);
          error.setError("Acceso Restringido");
        }
      } else {
        Router.push("/login");
      }
      setLoading(false);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return { user, loading, signout };
};
