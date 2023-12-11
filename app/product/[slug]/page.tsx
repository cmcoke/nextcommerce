import ImageGallery from "@/app/components/ImageGallery";
import { fullProduct } from "@/app/interface";
import { client } from "@/app/lib/sanity";
import { Button } from "@/components/ui/button";
import { Star, Truck } from "lucide-react";

// fetches data for a specific product from the Sanity Studio based on its slug.
const getData = async (slug: string) => {
  /**
   *  *[_type == "product" && slug.current == "${slug}"][0] - Select a single product where: _type is equal to "product" and slug.current matches the provided slug
   *
   *  _id: Retrieves the document ID of the product.
   *
   *  price: Retrieves the price of the product.
   *
   *  name: Retrieves the name of the product.
   *
   *  description:  Retrieves the description of the product
   *
   *  "slug": slug.current : Uses the slug field's current value as a new field named slug.
   *
   *  "categoryName": category->name: Uses the category field's reference to retrieve the name of the category and stores it as categoryName.
   *
   *  price_id:
   */
  const query = `*[_type == "product" && slug.current == "${slug}"][0] {
        _id,
          images,
          price,
          name,
          description,
          "slug": slug.current,
          "categoryName": category->name,
          price_id
      }`;

  const data = await client.fetch(query); // calls the fetch method on the client object, passing the query as an argument. This function fetches the data from Sanity and waits for the response before moving on.

  return data; // returns the data variable, which contains the hero image data retrieved from Sanity.
};

/**
 *
 * { params }: { params: { slug: string } } --
 *
 *  This line destructures the params object from the props object passed to the ProductPage component.
 *
 *  It defines a type annotation for the params object, specifying that it should contain a property named slug of type string.
 *
 *  This ensures that the component receives the correct data from its parent and prevents potential errors due to incorrect data types.
 *
 */
const ProductPage = async ({ params }: { params: { slug: string } }) => {
  const data: fullProduct = await getData(params.slug); // This code snippet destructures the received props to access the "slug" parameter and uses it to fetch product data from the "getData" function. The retrieved data is then stored safely in the "data" variable with the appropriate type.

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <ImageGallery images={data.images} />

          <div className="md:py-8">
            <div className="mb-2 md:mb-3">
              <span className="mb-0.5 inline-block text-gray-500">{data.categoryName}</span>
              <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">{data.name}</h2>
            </div>

            <div className="mb-6 flex items-center gap-3 md:mb-10">
              <Button className="rounded-full gap-x-2">
                <span className="text-sm">4.2</span>
                <Star className="h-5 w-5" />
              </Button>

              <span className="text-sm text-gray-500 transition duration-100">56 Ratings</span>
            </div>

            <div className="mb-4">
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-gray-800 md:text-2xl">${data.price}</span>
                <span className="mb-0.5 text-red-500 line-through">${data.price + 30}</span>
              </div>

              <span className="text-sm text-gray-500">Incl. Vat plus shipping</span>
            </div>

            <div className="mb-6 flex items-center gap-2 text-gray-500">
              <Truck className="w-6 h-6" />
              <span className="text-sm">2-4 Day Shipping</span>
            </div>

            <div className="flex gap-2.5">
              <Button>Add To Bag</Button>
              <Button variant={"secondary"}>Checkout now</Button>
            </div>

            <p className="mt-12 text-base text-gray-500 tracking-wide">{data.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
