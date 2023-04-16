import {Component, createSignal, For, onMount} from "solid-js";
import {auth, database} from "../../firebase";
import {onValue, ref as dbRef} from "firebase/database";
import * as path from "path";
import {A, useNavigate} from "@solidjs/router";
import {onAuthStateChanged} from "firebase/auth";

const TopNavigation: Component = () => {
    const [maps, setMaps] = createSignal<string[]>([]);
    const navigate = useNavigate();
    const getUserMaps = () => {

        const databaseRef = dbRef(database, "/users/" + auth?.currentUser?.uid + "/maps");

        if (databaseRef) {
            onValue(databaseRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setMaps(Object.keys(data));
                    console.log(maps())
                }
            });
        }

    }

    const handleAuthStateChanged = (user: any) => {
        if (user) {
            getUserMaps();
        }
    };

    onMount(() => {
        const unsubscribe = onAuthStateChanged(auth, handleAuthStateChanged);
        return () => unsubscribe(); // Clean up the subscription when the component is unmounted
    });

    const redirectToMap = (mapName: string) => {
        navigate("/maps/" + mapName);
    }

    return (
        <>
            <header class="bg-white fixed top-0 z-10 w-full">
                <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div class="flex lg:flex-1">
                        <a href="#" class="-m-1.5 p-1.5">
                            <span class="sr-only">Maps</span>
                            <img class="h-8 w-auto"
                                 src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt=""/>
                        </a>
                    </div>
                    <div class="flex lg:hidden">
                        <button type="button"
                                class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                            <span class="sr-only">Open main menu</span>
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                            </svg>
                        </button>
                    </div>
                    <div class="hidden lg:flex lg:gap-x-12">
                        <div class="relative group">
                            <button type="button"
                                    class="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
                                    aria-expanded="false">
                                Projects
                                <svg class="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor"
                                     aria-hidden="true">
                                    <path fill-rule="evenodd"
                                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                          clip-rule="evenodd"/>
                                </svg>
                            </button>
                            <div class="group-hover:block  hidden">
                                <div
                                    class=" absolute -left-8 top-full z-10 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                                    <div class="p-4  ">
                                        <For each={maps()}>{(userMap) => (
                                            <div
                                                class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
                                                <div
                                                    class="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                    <svg class="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                                                         fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                         stroke="currentColor" aria-hidden="true">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                              d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"/>
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                              d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"/>
                                                    </svg>
                                                </div>
                                                <div class="flex-auto">
                                                    <div onClick={() => {
                                                        redirectToMap(userMap)
                                                    }}
                                                         class="block font-semibold text-gray-900">
                                                        {userMap}
                                                        <span class="absolute inset-0"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}</For>
                                    </div>
                                    <div class="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                        <a href="#"
                                           class="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100">
                                            <svg class="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20"
                                                 fill="currentColor" aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                            All projects
                                        </a>

                                    </div>
                                </div>
                            </div>
                        </div>


                        <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Public maps</a>
                    </div>
                    <div class="hidden lg:flex lg:flex-1 lg:justify-end">
                        <A href="/map"
                           class="bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded ">Create
                            map</A>
                    </div>
                </nav>
                <div class="lg:hidden" role="dialog" aria-modal="true">
                    <div class="fixed inset-0 z-10"></div>
                    <div
                        class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div class="flex items-center justify-between">
                            <a href="#" class="-m-1.5 p-1.5">
                                <span class="sr-only">Your Company</span>
                                <img class="h-8 w-auto"
                                     src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt=""/>
                            </a>
                            <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700">
                                <span class="sr-only">Close menu</span>
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                     stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div class="mt-6 flow-root">
                            <div class="-my-6 divide-y divide-gray-500/10">
                                <div class="space-y-2 py-6">
                                    <div class="-mx-3">
                                        <button type="button"
                                                class="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 hover:bg-gray-50"
                                                aria-controls="disclosure-1" aria-expanded="false">
                                            Product
                                            <svg class="h-5 w-5 flex-none" viewBox="0 0 20 20" fill="currentColor"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </button>
                                        <div class="mt-2 space-y-2" id="disclosure-1">
                                            <a href="#"
                                               class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Analytics</a>

                                            <a href="#"
                                               class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Engagement</a>

                                            <a href="#"
                                               class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Security</a>

                                            <a href="#"
                                               class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Integrations</a>

                                            <a href="#"
                                               class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Automations</a>

                                            <a href="#"
                                               class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Watch
                                                demo</a>

                                            <a href="#"
                                               class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Contact
                                                sales</a>
                                        </div>
                                    </div>
                                    <a href="#"
                                       class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Features</a>
                                    <a href="#"
                                       class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Marketplace</a>
                                    <a href="#"
                                       class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Company</a>
                                </div>
                                <div class="py-6">
                                    <a href="#"
                                       class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Log
                                        in</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )

};

export default TopNavigation;
