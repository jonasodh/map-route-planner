import {Component, createEffect, createSignal, For, onCleanup, onMount} from "solid-js";
import {auth, database, storage} from "../firebase";
import {useNavigate} from "@solidjs/router";
import {get, ref} from "firebase/database";
import {getDownloadURL, ref as storageRef} from "firebase/storage";

const Map: Component = () => {
    const [scale, setScale] = createSignal(1);
    const [position, setPosition] = createSignal({x: 0, y: 0});
    const [pins, setPins] = createSignal<Array<{ x: number; y: number }>>([]);
    const [mapImage, setMapImage] = createSignal<string>("");
    let container!: HTMLDivElement;
    let isDragging = false;
    const navigate = useNavigate();
    onMount(() => {
        if (!auth.currentUser) {
            console.log("User is not logged in:", auth.currentUser);
            //redirect to map
            // navigate("/");
        }
        getMapDataFromDatabase();
    });

    const getMapDataFromDatabase = () => {
        const mapName = window.location.pathname.split("/")[2];
        console.log(mapName);
        const dbRef = ref(database, "/maps/" + mapName);
        get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                // setPins(data.pins);
                console.log(data);
                const storageReference = storageRef(storage, `maps/${data.name}`);
                getDownloadURL(storageReference)
                    .then((url) => {
                        setMapImage(url);
                        console.log(url);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                console.log("No data available");
            }
        });
    };

    const handleClick = (e: MouseEvent) => {
        if (isDragging) return;

        e.preventDefault();
        const rect = container.getBoundingClientRect();
        const pinWidth = 25;
        const pinHeight = 25;
        const offsetX = pinWidth / 2;
        const offsetY = pinHeight / 2;
        const x = (e.clientX - rect.left - position().x - offsetX) / scale();
        const y = (e.clientY - rect.top - position().y - offsetY) / scale();
        setPins([...pins(), {x, y}]);
    };
    createEffect(() => {
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
