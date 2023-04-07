import {createEffect, createSignal, onCleanup} from "solid-js";

interface MapProps {
}

const Map = (props: MapProps) => {
    const [scale, setScale] = createSignal(1);
    const [position, setPosition] = createSignal({x: 0, y: 0});
    let container: HTMLDivElement;

    createEffect(() => {
        if (!container) return;

        const handleMouseDown = (e: MouseEvent) => {
            e.preventDefault();

            const startX = e.clientX - position().x;
            const startY = e.clientY - position().y;

            const onMouseMove = (e: MouseEvent) => {
                setPosition({x: e.clientX - startX, y: e.clientY - startY});
            };

            const onMouseUp = () => {
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
            };

            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);

            onCleanup(() => {
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
            });
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            const delta = e.deltaY < 0 ? 1.1 : 0.9;
            const newScale = scale() * delta;

            const x = e.clientX;
            const y = e.clientY;

            const newPosition = {
                x: (position().x - x) * delta + x,
                y: (position().y - y) * delta + y,
            };

            setScale(newScale);
            setPosition(newPosition);
        };

        container.addEventListener("mousedown", handleMouseDown);
        container.addEventListener("wheel", handleWheel);

        onCleanup(() => {
            container.removeEventListener("mousedown", handleMouseDown);
            container.removeEventListener("wheel", handleWheel);
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
                    position: "relative",
                    overflow: "hidden",
                    width: "100vw",
                    height: "100vh",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    transform: `translate(${position().x}px, ${position().y}px) scale(${scale()})`,
                    cursor: "move",
                }}
            ></div>
        </>
    );
};

export default Map;
