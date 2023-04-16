import {auth, database, storage} from "../../firebase";
import {get, ref, update} from "firebase/database";
import {ref as storageRef, uploadBytes} from "firebase/storage";

const createMap = (name: string, file: Blob, isPublic: boolean): Promise<string> => {
    return new Promise((resolve, reject) => {
        const user = auth.currentUser;
        console.log(user?.uid)
        const databaseRef = ref(database, `maps/${name}`);
        const userRef = ref(database, `users/${user?.uid}/maps`);
        get(databaseRef)
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    console.log("Creating map")
                    const storageReference = storageRef(
                        storage,
                        `maps/${name}`
                    );
                    uploadBytes(storageReference, file)
                        .then((e) => {
                            update(databaseRef, {
                                name: name,
                                image: e.metadata.fullPath,
                                owner: user?.uid,
                                pins: "",
                                public: isPublic
                            }).then(() => {
                                update(userRef, {
                                    [name]: true
                                }).then(() => {
                                    resolve("Map added to user");
                                }).catch((error) => {
                                    console.error("Error updating user:", error);
                                    reject(error);
                                });
                            })
                                .catch((error) => {
                                    console.error("Error updating map:", error);
                                    reject(error);
                                });

                            resolve("Map created and file uploaded successfully");
                        })
                        .catch((error) => {
                            console.error("Error uploading file:", error);
                            reject(error);
                        });

                } else {
                    console.log("Could not create map");
                    resolve("Could not create map");
                }
            })
            .catch((error) => {
                console.error("Error getting map:", error);
                reject(error);
            });
    });
};

export default createMap;
