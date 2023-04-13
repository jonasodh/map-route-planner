import {Component, createSignal} from "solid-js";
import createMap from "../core/components/createMap";
import {useNavigate} from "@solidjs/router";


const CreateMap: Component = () => {
    const [
        mapName,
        setMapName
    ] = createSignal("");
    const [mapImage, setMapImage] = createSignal<Blob>(new Blob());
    const navigate = useNavigate();

    const handleMapInput = (e: any) => {
        console.log(e.target.value);
        if (e.target.value !== "") {
            setMapName(e.target.value);
        }
    }

    const handleMapImage = (event: any) => {
        console.log(event.target.value);
        const target = event.target as HTMLInputElement;
        if (!target.files || target.files.length === 0) return;
        // @ts-ignore
        setMapImage(() => target.files[0]);
    }

    const handleCreateMap = () => {
        console.log("Creating map.. " + mapName());
        if (mapName() === "") return;
        createMap(mapName(), mapImage()).then((message: string) => {
            console.log(message);
            navigate("/map/" + mapName());
        })
    }

    return (
        <>
            <div class="container mx-auto">
                <label class="block">
                    <span
                        class="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                       Map name
                    </span>
                    <input type="text" name="text"
                           class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                           placeholder="Your map's name" required value={mapName()} onInput={(event) => {
                        handleMapInput(event);
                    }
                    }/>
                </label>

                <div class="flex items-center justify-between">
                    <div class="mt-5">
                        <span
                            class="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                       Map image
                    </span>
                        <input class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
      file:rounded-md file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-500 file:text-white
      hover:file:bg-blue-600
      file:border-b-4 file:border-blue-700 file:hover:border-blue-500 file:rounded
      file:cursor-pointer
    " type="file" accept="image/*" onChange={(event) => {
                            handleMapImage(event)
                        }} required/>
                    </div>
                    <button onClick={handleCreateMap}
                            class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mt-5">Create
                        Map
                    </button>
                </div>
            </div>
        </>
    );
};

export default CreateMap;
