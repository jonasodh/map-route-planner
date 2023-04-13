import {Component} from "solid-js";
import {Route, Routes} from "@solidjs/router";
import Map from "./routes/Map";
import Login from "./routes/Login";
import CreateMap from "./routes/CreateMap";
import './index.css';
import {signOut} from "firebase/auth";
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
    return (
        <div>
            <button
                class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                onClick={logout}>Logout
            </button>
            <br/>
            <Routes>
                <Route path={"/"} component={Login}/>
                <Route path={"/map/"} component={CreateMap}/>
                <Route path={"/map/:id"} component={Map}/>
            </Routes>
        </div>
    );
};

export default App;
