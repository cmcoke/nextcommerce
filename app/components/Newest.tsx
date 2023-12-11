import Link from "next/link";
import { simplifiedProduct } from "../interface";
import { client } from "../lib/sanity";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

// fetches data for the first 4 latest products from the Sanity Studio.
const getData = async () => {
  /**
   *  [_type == "product"]: Selects all documents with the _type field equal to "product".
   *
   *  [0...4]: Limits the number of documents retrieved to the first 4.
   *
   *  | order(_createdAt desc): Orders the results in descending order based on their _createdAt field.
   *
   *  _id: Retrieves the document ID of each product.
   *
   *  price: Retrieves the price of each product.
   *
   *  name: Retrieves the name of each product.
   *
   *  "slug": slug.current : Uses the slug field's current value as a new field named slug.
   *
   *  "categoryName": category->name: Uses the category field's reference to retrieve the name of the category and stores it as categoryName.
   *
   *  "imageUrl": images[0].asset->url: Retrieves the URL of the first image associated with each product through the images and asset references and stores it as imageUrl.
   *
   */
  const query = `*[_type == "product"][0...4] | order(_createdAt desc) {
    _id,
      price,
    name,
      "slug": slug.current,
      "categoryName": category->name,
      "imageUrl": images[0].asset->url
  }`;

  const data = await client.fetch(query); // calls the fetch method on the client object, passing the query as an argument. This function fetches the data from Sanity and waits for the response before moving on.

  return data; // returns the data variable, which contains the hero image data retrieved from Sanity.
};

const Newest = async () => {
  const data: simplifiedProduct[] = await getData(); // stores the retrieved product data as an array of simplifiedProduct objects. simplifiedProduct is an interface created in the app/interface.ts file.

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Newest products</h2>

          <Link className="text-primary flex items-center gap-x-1" href="/all">
            See All{" "}
            <span>
              <ArrowRight />
            </span>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.map(product => (
            <div key={product._id} className="group relative">
              <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
                <Image src={product.imageUrl} alt="Product image" className="w-full h-full object-cover object-center lg:h-full lg:w-full" width={300} height={300} />
              </div>

              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link href={`/product/${product.slug}`}>{product.name}</Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.categoryName}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Newest;
