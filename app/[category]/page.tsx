import { simplifiedProduct } from "@/app/interface";
import { client } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";

// fetches the categories (men, women & teens) that was created in Sanity Studio
const getData = async (cateogry: string) => {
  /**
   * *[_type == "product" && category->name == "${cateogry}"] - Groq query selects all documents where: _type is equal to "product" and category->name matches the provided category string
   *
   *  _id - // Retrieves the document ID of each product.
   *
   *  "imageUrl": images[0].asset->url - // Retrieves the URL of the first image associated with each product through the images and asset references and stores it as imageUrl.
   *
   *  price - // Retrieves the price of each product.
   *
   *  name - // Retrieves the name of each product.
   *
   *  "slug": slug.current - // Uses the slug field's current value as a new field named slug.
   *
   *  "categoryName": category->name - // Uses the category field's reference to retrieve the name of the category and stores it as categoryName
   */
  const query = `*[_type == "product" && category->name == "${cateogry}"] {
        _id,
          "imageUrl": images[0].asset->url,
          price,
          name,
          "slug": slug.current,
          "categoryName": category->name
      }`;

  const data = await client.fetch(query); // Fetches the product data based on the defined query.

  return data; // Returns the retrieved product data.
};

// sets the dynamic property for the current Next.js page to "force-dynamic". This means that Next.js will always render the page as a server-side rendered (SSR) page, even if it could potentially be rendered as a static page.
export const dynamic = "force-dynamic";

/**
 *
 * { params }: { params: { category: string } } --
 *
 *  This destructures the props object passed to the Category component.
 *
 *  It expects an object with a 'params' key that contains another object with a 'category' key of type string.
 *
 *  This type annotation ensures that the component receives the correct data from its parent.
 *
 */
const Category = async ({ params }: { params: { category: string } }) => {
  const data: simplifiedProduct[] = await getData(params.category); // This line fetches the product data for the requested category by calling the getData function and passing the category parameter.

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 sm:px-6  lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Products for {params.category}</h2>
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
export default Category;
