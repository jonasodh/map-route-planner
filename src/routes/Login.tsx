import {onMount} from "solid-js";
import {auth, googleProvider} from "../firebase";
import {onAuthStateChanged, signInWithPopup} from "firebase/auth";
import {useNavigate} from "@solidjs/router";

const LoginComponent = () => {
    const navigate = useNavigate();

    async function signInWithGoogle() {

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log("User successfully logged in:", user);
            navigate("/map");
        } catch (error) {
            console.error("Error signing in:", error);
        }
    }

    onMount(() => {
        if (auth.currentUser) {
            console.log("User is logged in:", auth.currentUser);
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is logged in:", user);
                //redirect to map
                navigate("/map");
            } else {
                console.log("User is logged out");
            }
        });

        return () => {
            unsubscribe();
        };
    });

    return (
        <div class="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
            <h1 class="text-5xl font-bold">Map creator</h1>
            <button
                class="bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mt-5"
                onClick={signInWithGoogle}>Sign in with Google
            </button>
        </div>
    );
};

export default LoginComponent;
