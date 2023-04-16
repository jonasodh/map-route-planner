import {Component, createEffect, createSignal, For, onCleanup, onMount} from "solid-js";
import {auth, database, storage} from "../firebase";
import {useLocation, useParams} from "@solidjs/router";
import {get, onValue, ref as dbRef, update} from "firebase/database";
import {getDownloadURL, ref as storageRef} from "firebase/storage";
import {Pin} from "../models/Pin";
import {findPinElement} from "../core/components/findPinElement";
import TopNavigation from "../core/components/TopNavigation";

const Map: Component = () => {
    const [scale, setScale] = createSignal(.2);
    const [position, setPosition] = createSignal({x: 470, y: 50});
    const [pins, setPins] = createSignal<Pin[]>([]);
    const [mapImage, setMapImage] = createSignal<string>("");
    let container!: HTMLDivElement;
    let isDragging = false;
    const params = useParams();
    const location = useLocation();
    onMount(() => {
        if (!auth.currentUser) {
            console.log("User is not logged in:", auth.currentUser);
        }
        getMapDataFromDatabase();
        observePinsFromDatabase();
    });
    const getMapDataFromDatabase = () => {
        const databaseRef = dbRef(database, "/maps/" + params.mapName);
        get(databaseRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const storageReference = storageRef(storage, `maps/${data.name}`);
                getDownloadURL(storageReference)
                    .then((url) => {
                        setMapImage(url);
                        container.style.backgroundImage = `url(${mapImage()})`;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                console.log("No data available");
                update(databaseRef, {pins: ""})
            }
        });
    };


    const handleClick = (e: MouseEvent) => {
        if (isDragging) return;
        const pinElement = findPinElement(e.target as HTMLElement);
        console.log(pinElement);
        if (pinElement) return;

        e.preventDefault();
        const rect = container.getBoundingClientRect();
        const pinWidth = 25;
        const pinHeight = 25;
        const offsetX = pinWidth / 2;
        const offsetY = pinHeight / 2;
        const x = (e.clientX - rect.left - position().x - offsetX) / scale();
        const y = (e.clientY - rect.top - position().y - offsetY) / scale();
        setPinsInDatabase([...pins(), {x, y}]);
    };

    const observePinsFromDatabase = () => {
        const databaseRef = dbRef(database, "/maps/" + params.mapName + "/pins");
        const onDataChange = (snapshot: any) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                if (typeof data === 'object') {
                    const pinsArray: Pin[] = Object.entries(data).map(([id, pinData]) => {
                        const typedPinData = pinData as Pin;
                        return {
                            id: id,
                            x: typedPinData.x,
                            y: typedPinData.y,
                        };
                    });

                    setPins(pinsArray);
                } else {
                    console.warn('Received data is not an object');
                }
            } else {
                console.log('No data available');
                const mapRef = dbRef(database, "/maps/" + params.mapName);
                setPins([])
                update(mapRef, {pins: ""})
            }
        };


        onValue(databaseRef, onDataChange);
        //clean up
        const unsubscribe = onValue(databaseRef, onDataChange);
        return () => {
            unsubscribe();
        };
    };


    const removePinFromDatabase = (index: number) => {
        console.log("Removing pin from database..")
        if (pins().length <= 1) {
            setPinsInDatabase([]);
            return;
        }
        const pinsCopy = [...pins()];
        pinsCopy.splice(index, 1);
        setPinsInDatabase(pinsCopy);
    }

    const setPinsInDatabase = (pins: Pin[]) => {
        console.log("Updating pins in database..")
        const databaseRef = dbRef(database, "/maps/" + params.mapName);
        update(databaseRef, {pins}).then(() => {
            console.log("Pins updated");
        });
    };
    createEffect(() => {
        console.log(location.pathname);
        getMapDataFromDatabase();
        observePinsFromDatabase();
        if (!container) return;

        const handleMouseDown = (e: MouseEvent) => {
            e.preventDefault();

            isDragging = false;
            const startX = e.clientX - position().x;
            const startY = e.clientY - position().y;

            const onMouseMove = (e: MouseEvent) => {
                isDragging = true;
                setPosition({x: e.clientX - startX, y: e.clientY - startY});
            };

            const onMouseUp = () => {
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
            };

            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            const delta = e.deltaY < 0 ? 1.1 : 0.9;
            const newScale = scale() * delta;

            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const newPosition = {
                x: (position().x - x) * delta + x,
                y: (position().y - y) * delta + y,
            };

            setScale(newScale);
            setPosition(newPosition);
        };

        container.addEventListener("mousedown", handleMouseDown);
        container.addEventListener("wheel", handleWheel);
        container.addEventListener("click", handleClick);

        onCleanup(() => {
            container.removeEventListener("mousedown", handleMouseDown);
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("click", handleClick);
        });
    });

    return (
        <>
            <TopNavigation/>
            <div
                ref={container}
                style={{
                    "position": "relative",
                    "overflow": "hidden",
                    "width": "4096px",
                    "height": "4096px",
                    "background-size": `${scale() * 100}%`,
                    "background-repeat": "no-repeat",
                    "background-position": `${position().x}px ${position().y}px`,
                }}
            >
                <For each={pins()}>{(pin) => (
                    <div
                        data-pin="true"
                        onClick={(e: MouseEvent) => {
                            e.stopPropagation();
                            removePinFromDatabase(pins().indexOf(pin));
                        }}
                        style={{
                            "position": "absolute",
                            "left": `${(pin.x * scale() + position().x)}px`,
                            "top": `${(pin.y * scale() + position().y)}px`,
                            "width": "25px",
                            "height": "25px",
                            "background-color": "red",
                            "border-radius": "50%",
                            "background-size": `${scale() * 100}%`,
                            "background-repeat": "no-repeat",
                            "background-position": `${position().x}px ${position().y}px`,
                        }}
                    ></div>
                )}</For>
            </div>
        </>
    );
};

export default Map;
