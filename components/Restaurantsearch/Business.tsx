import Image from "next/image";
import { HeartIcon, ChatIcon } from "@heroicons/react/outline";
import Link from "next/link";

export default function Business(props: { business: any }) {
  const { business } = props;
  // console.log("problem", business);

  return (
    <div className=" w-full h-full my-5 flex justify-center items-center">
      <Link href={"/restaurant/" + business.id} prefetch={false}>
        <div className=" w-full relative pl-1 flex justify-center rounded-xl  cursor-pointer">
          {/* <!-- Tag Discount --> */}
          <div className="top-0 left-0 mt-3 px-2 rounded-lg absolute z-30 bg-green-500 text-gray-100 text-xs md:text-sm font-medium md:block">
            Rating {business.rating}
          </div>
          <div className="top-0 left-0 h-2 md:h-3 mt-5 px-2 absolute z-20 bg-green-500"></div>
          <div className="top-0 left-0 h-2 md:h-3 mt-6 pl-5 rounded-3xl absolute z-0 bg-green-600"></div>
          <div className="pb-2 w-full  bg-white border-grey-800 border-b border-l border-r rounded-xl shadow-xl z-10">
            <div className="relative">
              {/* <!-- :src="image.largeImageURL"     --> */}
              <img
                src={business.imageSrc}
                className=" h-52 w-full object-cover rounded-t-xl"
                alt=""
              />
              {/* <!-- Tag rekomendasi --> */}
              <div className="bottom-0 right-0 mb-2 mr-2 px-2 rounded-lg absolute bg-yellow-500 text-gray-100 text-xs font-medium">
                {business.category}
              </div>
            </div>
            <div className="px-2 py-1">
              {/* <!-- Product Title --> */}
              <div className="text-sm md:text-base font-bold pr-2">
                {business.name}
              </div>

              <p className="pb-2 md:pb-2 text-xs md:text-lg text-gray-500">
                {business.address} {business.city}
              </p>

              {/* <!-- Alamat --> */}

              {/* <!-- Tombol pesan --> */}
              <Link href={"/restaurant/" + business.id} prefetch={false}>
                <a className="inset-x-0 bottom-0 flex justify-center bg-blue-500 rounded-xl w-full p-1 text-gray-100 hover:bg-white text-sm md:text-base border hover:border-blue-500 hover:text-blue-900">
                  See or Recommended A Meal
                </a>
              </Link>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Business.propTypes = {
//   business: PropTypes.object.isRequired,
// };
