import {Component, onMount} from "solid-js";
import {Route, Routes} from "@solidjs/router";
import Map from "./routes/Map";
import Login from "./routes/Login";
import CreateMap from "./routes/CreateMap";
import './index.css';
import {onAuthStateChanged, signOut} from "firebase/auth";
import {auth} from "./firebase";

const logout = () => {
    console.log("Logging out")
    signOut(auth).then(() => {
        console.log("User successfully signed out")
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
}

const App: Component = () => {

    onMount(() => {
        if (auth.currentUser) {
            console.log("User is logged in:", auth.currentUser);
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
            <br/>
            <Routes>
                <Route path={"/"} component={Login}/>
                <Route path={"/map/"} component={CreateMap}/>
                <Route path={"/maps/:mapName"} component={Map}/>
            </Routes>
        </div>
    );
};

export default App;
