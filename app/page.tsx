import Hero from "./components/Hero";
import Newest from "./components/Newest";

// sets the dynamic property for the current Next.js page to "force-dynamic". This means that Next.js will always render the page as a server-side rendered (SSR) page, even if it could potentially be rendered as a static page.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="bg-white pb-6 sm:pb-8 lg:pb-12">
      <Hero />
      <Newest />
    </div>
  );
}
