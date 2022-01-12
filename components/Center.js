import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playListIdState, playListState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-gray-500",
  "from-yellow-400",
  "from-green-500",
  "from-blue-400",
  "from-purple-500",
  "from-pink-400",
];

function Center() {
  const { data: session } = useSession();
  const spotifyAPI = useSpotify();
  const [color, setColor] = useState(null);
  const playListId = useRecoilValue(playListIdState);
  const [playList, setPlayList] = useRecoilState(playListState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playListId]);

  useEffect(() => {
    spotifyAPI
      .getPlaylist(playListId)
      .then((data) => {
        setPlayList(data.body);
      })
      .catch((err) => console.log("Something went wrong!", err));
  }, [spotifyAPI, playListId]);

  console.log(playList);

  return (
    <div className="flex-grow h-screen scrollbar-hide overflow-y-scroll">
      <div className="sticky top-0">
        <header className="absolute top-5 right-8">
          <div
            className="flex items-center bg-black text-gray-100 space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
            onClick={signOut}
          >
            <img
              className="rounded-full w-10 h-10"
              src={session?.user.image}
              alt=""
            />
            <h2>{session?.user.name}</h2>
            <ChevronDownIcon className="h-5 w-5" />
          </div>
        </header>

        <section
          className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black h-80 text-white p-8 `}
        >
          <img
            className="h-32 w-32 md:h-44 md:w-44 shadow-2xl"
            src={playList?.images?.[0]?.url}
            alt=""
          />

          <div>
            <p>PLAYLIST</p>
            <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
              {playList?.name}
            </h1>
            <p className="text-xs font-light mt-2">
              followers : {playList?.followers.total} -{" "}
              {playList?.tracks.items.length} Songs
            </p>
          </div>
        </section>
      </div>

      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Center;
