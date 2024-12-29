import {Inter} from 'next/font/google'
import Screen from "@/components/screen"
import Input from "@/components/input"
import {useState} from "react";
import clsx from "clsx";
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import Head from "next/head";
import Link from "next/link";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    const [identifier, setIdentifier] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleOnSubmit(event).then(r => r);
        }
    }

    const handleOnSubmit = async (e) => {
        setLoading(true);
        // redirect to /worth if identifier is not null, before urlencoded the identifier
        if (identifier !== "") {

            // Send a request to the API method post
            const res = await fetch('/api/form?identifier=' + encodeURI(identifier));
            const data = await res.json();

            if (res.status === 401) {
                console.log('#################### API KEY IS NOT VALID ####################');
                alert('Its your first time here? API Key is not valid. Please check your API Key in the .env file. You can take a API Key from steamwebapi.com')
            }

            if (res.status === 429) {
                console.log('################# API LIMITS REACHED #################');
            }

            if (res.status === 404) {
                console.log('#################### PROFILE NOT FOUND ####################');
                setError(data.message);
            }

            if (res.status !== 200) {
                setLoading(false);
            }

            if (res.status === 200) {
                window.location.href = `/worth/${encodeURIComponent(data.steamid)}`;
            }
        }
    }

    return (
        <main
            className={`flex min-h-screen flex-col items-center ${inter.className}">
`}
        >
            <Head>
                <title>Steam Inventory Worth Calculator</title>
                <meta name="description" content="Steam Inventory Worth Calculator"/>
            </Head>
            <Screen loading={loading}>
                <div className="flex flex-col w-full gap-20 items-center">
                    <div className="flex justify-center w-full mt-20 ">
                        <div className="flex flex-col items-center justify-center gap-10">
                            <h1 className="text-4xl font-bold text-center text-white w-3/4">
                                Steam Inventory checker url
                            </h1>
                            {error !== null && (
                                <div className="bg-red-500 text-white p-4 rounded-lg">
                                    {error}
                                </div>
                            )}
                            <div className="w-full flex flex-col lg:flex-row gap-4 px-4">
                                <Input
                                    placeholder="Username, SteamId or Steam Profile Link"
                                    id="identifier"
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button
                                    className={clsx("btn btn-primary flex flex-row gap-1", loading && "loading")}
                                    onClick={(e) => handleOnSubmit(e)}
                                    disabled={loading}
                                >
                                    <MagnifyingGlassIcon className="w-6 h-6"/>
                                    CHECK
                                </button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </Screen>
        </main>
    )
}
