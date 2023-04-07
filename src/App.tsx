import {Component} from "solid-js";
import {Route, Routes} from "@solidjs/router";
import Map from "./Map";
import Login from "./routes/Login";

const App: Component = () => {
    return (
        <div>
            <Routes>
                <Route path={"/"} component={Login}/>
                <Route path={"/map/:id"} component={Map}/>
            </Routes>
        </div>
    );
};

export default App;
