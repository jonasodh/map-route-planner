import {createEffect, createSignal, For, onCleanup} from "solid-js";

interface MapProps {
}

const Map = (props: MapProps) => {
    const [scale, setScale] = createSignal(1);
    const [position, setPosition] = createSignal({x: 0, y: 0});
    const [pins, setPins] = createSignal<Array<{ x: number; y: number }>>([]);
    let container!: HTMLDivElement;
    let isDragging = false;

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

    const handleFileChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === "string") {
                    container.style.backgroundImage = `url(${result})`;
                }
            };
            reader.readAsDataURL(target.files[0]);
        }
    };
    return (
        <>
            <input type="file" accept="image/*" onChange={handleFileChange}/>
            <div
                ref={container}
                style={{
                    "position": "relative",
                    "overflow": "hidden",
                    "width": "100vw",
                    "height": "100vh",
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
