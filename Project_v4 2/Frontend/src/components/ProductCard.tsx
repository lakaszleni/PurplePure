import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Star } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { AddToCart, addFavorite, removeFavorite } from "@/API";

import { useToast } from "@/components/ui/use-toast";

const ProductCard = (props: any) => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleAddFavorite = async (product_id: any) => {
    const data = {
      action: "add",
      product_id: product_id,
    };
    const response = await addFavorite(data);
    if (response.status === 200) {
      let products = [
        ...props.products.map((obj: any) => {
          if (obj.id === props.id) {
            return { ...obj, favorite: true };
          } else {
            return { ...obj };
          }
        }),
      ];
      props.setProducts(products);
      toast({
        title: "Sikeres hozzáadás",
        description: "A termék sikeresen hozzáadva a kedvencekhez",
      });
    } else {
      toast({
        title: "Hiba",
        description: "Ismeretlen hiba",
      });
    }
    12;
  };

  const handleRemoveFavorite = async (product_id: any) => {
    const data = {
      action: "delete",
      product_id: product_id,
    };
    const response = await removeFavorite(data);
    if (response.status === 200) {
      let products = [
        ...props.products.map((obj: any) => {
          if (obj.id === props.id) {
            return { ...obj, favorite: false };
          } else {
            return { ...obj };
          }
        }),
      ];
      props.setProducts(products);
      toast({
        title: "Sikeres törlés",
        description: "A termék sikeresen törölve a kedvencekből",
      });
    } else {
      toast({
        title: "Hiba",
        description: "Ismeretlen hiba",
      });
    }
  };

  const handleAddToCart = async () => {
    if (quantity < 1 || quantity > 99) {
      toast({
        title: "Hiba",
        description: "1 és 99 közötti mennyiség adható a kosárhoz",
      });
      return;
    }
    const data = {
      action: "add",
      product_id: props.id,
      quantity: quantity,
    };
    const response = await AddToCart(data);
    if (response.status === 200) {
      toast({
        title: "Sikeres hozzáadás",
        description: "A termék sikeresen hozzáadva a kosárhoz",
      });
    } else if (response.status === 409) {
      toast({
        title: "Hiba",
        description: "Nincs elegendő termék készleten",
      });
    } else {
      toast({
        title: "Hiba",
        description: "Ismeretlen hiba",
      });
    }
  };

  return (
    <Card className="w-full">
      <img
        className="w-full h-48 object-cover"
        src={"http://127.0.0.1:8000/products/" + props.image}
      />
      <CardHeader>
        <CardTitle>{props.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {props.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} HUF
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Részletek</Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl">
            <div className="grid grid-flow-col grid-cols-2">
              <img
                className="w-full h-full object-cover"
                src={"http://127.0.0.1:8000/products/" + props.image}
              />
              <div className="flex flex-col justify-between px-4 pt-4">
                <div>
                  <h1 className="text-2xl font-bold">{props.name}</h1>
                  <p className="text-md">{props.description}</p>
                  <h3 className="mt-2 text-lg font-semibold">
                    {props.price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                    HUF
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="quantity" className="w-2/12">
                    Mennyiség
                  </Label>
                  <Input
                    className="w-4/12"
                    id="quantity"
                    type="number"
                    min={1}
                    max={99}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  />
                  <DialogClose asChild>
                    <Toggle
                      defaultChecked={props.favorite}
                      pressed={props.favorite}
                      variant="outline"
                      className="w-14"
                      onClick={() => {
                        if (!props.favorite) {
                          handleAddFavorite(props.id);
                        } else {
                          handleRemoveFavorite(props.id);
                        }
                      }}
                    >
                      <Star className="h-4 w-4" />
                    </Toggle>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      className="w-6/12"
                      onClick={() => handleAddToCart()}
                    >
                      Kosárba
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
