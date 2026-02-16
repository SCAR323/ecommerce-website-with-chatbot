import { useParams } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import productsData from "@/data/products.json";

const Category = () => {
  const { category } = useParams<{ category: string }>();

  const categoryProducts = productsData.filter(
    (product) => product.category === category
  );

  const categoryNames: Record<string, string> = {
    earbuds: "Earbuds",
    headphones: "Headphones",
    speakers: "Bluetooth Speakers",
    soundbars: "Soundbars",
    smartwatches: "Smartwatches",
    accessories: "Accessories",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">
        {categoryNames[category || ""] || "Products"}
      </h1>
      <p className="text-muted-foreground mb-8">
        Explore our collection of {categoryNames[category || ""]?.toLowerCase()}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {categoryProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No products found in this category</p>
        </div>
      )}
    </div>
  );
};

export default Category;
