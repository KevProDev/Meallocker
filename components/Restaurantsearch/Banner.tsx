import { useState, useEffect } from "react";
import { useAppContext } from "../../context/store";
import NextImage from "next/image";
import { SearchIcon } from "@heroicons/react/solid";

function Banner() {
  const appState = useAppContext();
  const {
    term,
    location,
    sortBy,
    searchBusinesses,
    clearBusinesses,
    setSearchParams,
  } = appState;

  useEffect(() => {
    // console.log("Banner useEffect for TERM");
    setState({ ...state, term: term });
  }, [term]);

  const [state, setState] = useState({
    term: term,
    location: location,
    sortBy: sortBy,
  });

  // enter on search trigger
  useEffect(() => {
    const locationInput = document.getElementById("locationInput");

    locationInput?.addEventListener("keyup", function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        document.getElementById("searchbutton")?.click();
      }
    });
  }, []);
  const handleInputChange = (e: { target: { name: any; value: any } }) =>
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });

  const handleSearch = (e: { preventDefault: () => void }) => {
    clearBusinesses();
    if (state.location === "" || (state.term === "" && state.location === ""))
      return;
    setSearchParams({
      term: state.term,
      location: state.location,
      sortBy: state.sortBy,
    });
    searchBusinesses(state.term, state.location, state.sortBy, 0);
    e.preventDefault();
  };

  // useEffect(() => {
  //   clearBusinesses();
  //   // if (state.location === "" || (state.term === "" && state.location === ""))
  //   //   return;
  //   setSearchParams({
  //     term: "restaurant",
  //     location: "chicago",
  //     sortBy: state.sortBy,
  //   });
  //   searchBusinesses("restaurant", "chicago", state.sortBy, 0);
  //   // e.preventDefault();
  // }, []);

  return (
    <div className="relative w-full h-[400px] sm:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]">
      <div className=" bg-black absolute w-full h-full z-10 opacity-40 "></div>
      <NextImage
        src="https://images.squarespace-cdn.com/content/v1/551aba82e4b06ddeea1f4958/1636043991946-NN53WAVJ8A68H2AU8TU8/CHIUB-Brunch-Table-Cindys.jpg"
        layout="fill"
        objectFit="cover"
        priority={true}
      />

      <div className=" min-h-full flex flex-col items-center justify-center py-4 px-4 sm:px-6 lg:px-8 relative z-20">
        <h1 className=" text-3xl md:text-4xl lg:text-6xl font-bold text-white ">
          Share and discover meals people love
        </h1>
        <div className="max-w-md w-full space-y-8">
          <form className="mt-8 space-y-6 " action="#" method="POST">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  name="term"
                  onChange={handleInputChange}
                  value={state.term}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border-2 border-gray-200 placeholder-gray-500 text-gray-900 rounded-t-md focus:bg-white focus:outline-none focus:border-blue-500 focus:z-10 text-xl"
                  placeholder="Restaurant name
                  "
                />
              </div>
              <div>
                <input
                  id="locationInput"
                  name="location"
                  onChange={handleInputChange}
                  value={state.location}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border-2 border-gray-200 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:border-blue-500 focus:z-10 text-xl"
                  placeholder="City"
                />
              </div>
            </div>

            <div>
              <button
                id="searchbutton"
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-500"
                onClick={handleSearch}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <SearchIcon
                    className="h-5 w-5 text-white group-hover:text-white"
                    aria-hidden="true"
                  />
                </span>
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Banner;
