import { useState, useEffect } from "react";

import Navbar from "@/components/NavBar";
import ProductCard from "@/components/ProductCard";

import { getCategories, getProducts } from "../API";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const Products = () => {
  const [products, setProducts] = useState<any>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [favoritesEnabled, setFavoritesEnabled] = useState<boolean>(false);
  const [productSearch, setProductSearch] = useState<string>("");

  const { toast } = useToast();

  useEffect(() => {
    const getData = async () => {
      const products = await getProducts();
      const categories = await getCategories();

      if (products?.status === 200 && categories?.status === 200) {
        setProducts(products?.data);
        setCategories([...categories?.data]);
      } else {
        toast({
          title: "Hiba",
          description: "Ismeretlen hiba",
        });
      }
    };
    getData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-row">
        <div className="basis-1/6 mx-2 h-2/3">
          <Label className="text-xl font-bold" htmlFor="category">
            Termék kategóriája
          </Label>
          <ScrollArea
            id="category"
            className="h-full rounded-md border mt-[6px]"
          >
            <div className="flex items-center space-x-2 m-4">
              <Checkbox
                id="category"
                checked={favoritesEnabled}
                onCheckedChange={(value) => {
                  if (value) {
                    setFavoritesEnabled(true);
                  } else {
                    setFavoritesEnabled(false);
                  }
                }}
              />
              <label
                htmlFor="category"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Kedvencek
              </label>
            </div>
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2 m-4">
                <Checkbox
                  id="category"
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(value) => {
                    if (value) {
                      setSelectedCategories([...selectedCategories, category]);
                    } else {
                      setSelectedCategories([
                        ...selectedCategories.filter((c) => c !== category),
                      ]);
                    }
                  }}
                />
                <label
                  htmlFor="category"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category}
                </label>
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="basis-5/6">
          <div className="grid w-1/4 items-center gap-1.5 ml-4">
            <Label className="text-xl font-bold" htmlFor="search">
              Termék keresése
            </Label>
            <Input
              type="text"
              className="w-full"
              id="search"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Termék keresése"
            />
          </div>
          <div className="grid grid-cols-6 gap-4 p-4">
            {products
              .filter((product: any) => product.showed)
              .filter((product: any) =>
                selectedCategories.every((category) =>
                  product.categories.includes(category)
                )
              )
              .filter((product: any) =>
                favoritesEnabled ? product.favorite : true
              )
              .filter((product: any) =>
                product.name.toLowerCase().includes(productSearch.toLowerCase())
              )
              .map((product: any) => (
                <ProductCard
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  image={product.images[0]}
                  favorite={product.favorite}
                  products={products}
                  setProducts={setProducts}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
