import {onMount} from "solid-js";
import {auth, googleProvider} from "../firebase";
import {onAuthStateChanged, signInWithPopup} from "firebase/auth";
import {useNavigate} from "@solidjs/router";

const LoginComponent = () => {
    async function signInWithGoogle() {

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const navigate = useNavigate();
            console.log("User successfully logged in:", user);
            navigate("/map");
        } catch (error) {
            console.error("Error signing in:", error);
        }
    }

    onMount(() => {
        if (auth.currentUser) {
            console.log("User is logged in:", auth.currentUser);
            //redirect to map
            const navigate = useNavigate();
            navigate("/map");
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is logged in:", user);
                //redirect to map

            } else {
                console.log("User is logged out");
            }
        });

        return () => {
            unsubscribe();
        };
    });

    return (
        <div>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    );
};

export default LoginComponent;
