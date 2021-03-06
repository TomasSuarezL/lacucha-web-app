import firebase from "firebase/app";
import "firebase/auth";
import { createContext, useContext, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import nookies from "nookies";
import { useError } from "./useError";
import { api } from "../services/api";
import { usuariosApi } from "../components/usuarios/Usuarios.api";
import { User, UserFirebase } from "../models/Usuario";

// Based on the example on https://usehooks.com/useAuth/

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

if (!firebase.apps.length) {
  firebase.initializeApp(config);
  typeof window !== "undefined" &&
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
}

const AuthContext = createContext<{
  user: User | UserFirebase;
  loading: Boolean;
  signout: () => Promise<void>;
}>(null);

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

interface UserState {
  user: User | UserFirebase;
  loading: Boolean;
}

const initialState = { user: null, loading: false };

function reducer(state: UserState, action: UserAction) {
  switch (action.type) {
    case "USER_SUCCESS":
      return { user: action.payload, loading: false };
    case "USER_NOT_REGISTERED":
      return { user: action.payload, loading: false };
    case "USER_LOGOUT":
      return { user: null, loading: false };
    default:
      throw new Error();
  }
}

interface UserAction {
  type: string;
  payload?: User | UserFirebase;
}

export const useFirebaseUser = () => {
  const router = useRouter();
  const error = useError();
  const [state, dispatch] = useReducer(reducer, initialState);

  const signout = async () => {
    await firebase.auth().signOut();
    dispatch({ type: "USER_LOGOUT" });
    router.push("/login");
  };

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = firebase.auth().currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    // listen for changes in IdToken and save it to cookies and set in axios defaults
    firebase.auth().onIdTokenChanged(async (user) => {
      if (!user) {
        dispatch({ type: "USER_LOGOUT" });
        nookies.set(undefined, "token", "", { path: "/" });
      } else {
        console.log("Id Token Changed");
        const userToken = await user.getIdToken();
        state.user &&
          dispatch({ type: "USER_SUCCESS", payload: { ...state.user, idToken: userToken } });
        api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        nookies.set(undefined, "token", userToken, { path: "/" });
      }
    });

    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        let userToken = await user.getIdToken();

        // Configure the token on the API wrapper: Because we need the token obtained in this call to the auth server
        // I found that is the simplest way withouth having to do some convoluted async logic
        api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;

        try {
          let _usuario = await usuariosApi.getUsuario(user.uid);
          dispatch({ type: "USER_SUCCESS", payload: { ...user, idToken: userToken, ..._usuario } });
        } catch (ex) {
          console.log(ex.message);
          error.setError({ message: ex.message, showContent: false, isError: true });
          dispatch({ type: "USER_NOT_REGISTERED", payload: { ...user, idToken: userToken } });
        }
      } else {
        router.push("/login");
      }
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return { user: state.user, loading: state.loading, signout };
};
