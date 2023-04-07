import {database} from "../../firebase";
import {get, ref, update} from "firebase/database";

const createMap = (name: string) => {
    const reference = ref(database, "maps/" + name);
    get(reference).then((snapshot) => {
        if (!snapshot.exists()) {
            update(reference, {name: name}).then(() => {
                console.log("Map created successfully");
            });
        } else {
            console.log("Map already exists");
        }
    });
};

export default createMap;
