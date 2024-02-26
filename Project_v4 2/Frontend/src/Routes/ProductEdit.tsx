import { useState, useEffect } from "react";

import Navbar from "@/components/NavBar";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

import {
  AddNewProduct,
  AddNewCategory,
  getCategories,
  DeleteCategory,
  DeleteProduct,
  getProducts,
  ModifyProduct,
  getCoupons,
  NewCoupon,
  DeleteCoupon,
  ModifyCoupon,
} from "@/API";

const ProductEdit = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [showed, setShowed] = useState<any>(true);
  const [picture, setPicture] = useState<File | null>(null);

  const [coupons, setCoupons] = useState<any[]>([]);
  const [newCoupon, setNewCoupon] = useState<any>({ code: "", discount: "" });
  const [modifyCoupon, setModifyCoupon] = useState<any>({
    code: "",
    discount: "",
  });

  const [avaiableCategories, setAvaiableCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const [avaiableProducts, setAvaiableProducts] = useState<any[]>([]);

  const [modifyProduct, setModifyProduct] = useState({
    id: 0,
    name: "",
    description: "",
    price: "",
    quantity: "",
    showed: true as any,
    categories: [] as string[],
  });

  const { toast } = useToast();

  useEffect(() => {
    const getData = async () => {
      const categories = await getCategories();
      const products = await getProducts();
      const coupons = await getCoupons();

      if (
        categories?.status === 200 &&
        products?.status === 200 &&
        coupons?.status === 200
      ) {
        setAvaiableCategories(categories?.data);
        setAvaiableProducts(products?.data);
        setCoupons(coupons?.data);
      } else {
        toast({
          title: "Hiba",
          description: "Sikertelen adatlekérés",
        });
      }
    };
    getData();
  }, []);

  const handleAddNewProduct = async () => {
    if (!name || !description || !price || !quantity || !picture) {
      toast({
        title: "Hiányzó adatok",
        description: "Töltse ki az összes mezőt",
      });
      return;
    }

    const formData = new FormData();

    formData.append("action", "new");
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("showed", showed);
    formData.append("quantity", quantity);
    formData.append("categories", JSON.stringify(categories));

    if (picture) {
      formData.append("picture", picture);
    }

    const response = await AddNewProduct(formData);

    if (response.status === 200) {
      setAvaiableProducts([...avaiableProducts, response?.data]);
      toast({
        title: "Sikeresen hozzáadva",
        description: "Sikeresen hozzáadta az új terméket",
      });
    } else {
      toast({
        title: "Hiba",
        description: "Sikertelen hozzáadás",
      });
    }
  };

  const handleAddNewCoupon = async () => {
    const data = {
      action: "new",
      code: newCoupon.code,
      discount: newCoupon.discount,
    };
    const response = await NewCoupon(data);
    if (response.status === 200) {
      setCoupons([...coupons, response.data]);
      toast({
        title: "Sikeresen hozzáadva",
        description: "Sikeresen hozzáadta az új kupont",
      });
    } else if (response.status === 409) {
      toast({
        title: "Létező kód",
        description: "Ez a kód már létezik",
      });
    } else {
      toast({
        title: "Hiba",
        description: "Sikertelen hozzáadás",
      });
    }
  };

  const handleDeleteCoupon = async (coupon_id: number) => {
    const data = {
      action: "delete",
      coupon_id: coupon_id,
    };
    const response = await DeleteCoupon(data);
    if (response.status === 200) {
      setCoupons(coupons.filter((item) => item.id !== coupon_id));
      toast({
        title: "Sikeresen törölve",
        description: "Sikeresen törölte a kupont",
      });
    } else {
      toast({
        title: "Hiba",
        description: "Sikertelen törlés",
      });
    }
  };

  const handleModifyCoupon = async () => {
    const data = {
      action: "edit",
      coupon_id: modifyCoupon.id,
      code: modifyCoupon.code,
      discount: modifyCoupon.discount,
    };

    const response = await ModifyCoupon(data);
    if (response.status === 200) {
      setCoupons([
        ...coupons.map((item) => {
          if (item.id !== modifyCoupon.id) {
            return { ...item };
          } else {
            return { ...modifyCoupon };
          }
        }),
      ]);
      toast({
        title: "Sikeresen módosítva",
        description: "Sikeresen módosította a kupont",
      });
    } else {
      toast({
        title: "Hiba",
        description: "Sikertelen módosítás",
      });
    }
  };

  const handleAddNewCategory = async () => {
    const data = {
      action: "new",
      name: newCategory,
    };
    const response = await AddNewCategory(data);
    if (response.status === 200) {
      setAvaiableCategories([...avaiableCategories, newCategory]);
      toast({
        title: "Sikeresen hozzáadva",
        description: "Sikeresen hozzáadta az új kategóriát",
      });
    } else if (response.status === 409) {
      toast({
        title: "Létező kategória",
        description: "Ez a kategória már létezik",
      });
    } else {
      toast({
        title: "Hiba",
        description: "Sikertelen hozzáadás",
      });
    }
    setNewCategory("");
  };

  const handleDeleteCategory = async (category: string) => {
    const data = {
      action: "delete",
      name: category,
    };
    const response = await DeleteCategory(data);
    if (response.status === 200) {
      setAvaiableCategories(
        avaiableCategories.filter((item) => item !== category)
      );
      toast({
        title: "Sikeresen törölve",
        description: "Sikeresen törölte a kategóriát",
      });
    } else {
      toast({
        title: "Hiba",
        description: "Sikertelen törlés",
      });
    }
  };

  const handleDeleteProduct = async (product_id: number) => {
    const data = {
      action: "delete",
      product_id: product_id,
    };
    const response = await DeleteProduct(data);
    if (response.status === 200) {
      setAvaiableProducts(
        avaiableProducts.filter((item) => item.id !== product_id)
      );
      toast({
        title: "Sikeresen törölve",
        description: "Sikeresen törölte a terméket",
      });
    } else {
      toast({
        title: "Hiba",
        description: "Sikertelen törlés",
      });
    }
  };

  const handleModifyProduct = async () => {
    const data = {
      action: "edit",
      product_id: modifyProduct.id,
      name: modifyProduct.name,
      description: modifyProduct.description,
      price: modifyProduct.price,
      quantity: modifyProduct.quantity,
      showed: modifyProduct.showed,
      categories: JSON.stringify(modifyProduct.categories),
    };

    const response = await ModifyProduct(data);
    if (response.status === 200) {
      setAvaiableProducts([
        ...avaiableProducts.map((item) => {
          if (item.id !== modifyProduct.id) {
            return { ...item };
          } else {
            return { ...modifyProduct };
          }
        }),
      ]);
      toast({
        title: "Sikeresen módosítva",
        description: "Sikeresen módosította a terméket",
      });
    } else {
      toast({
        title: "Hiba",
        description: "Sikertelen módosítás",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-1 w-screen h-full">
        <Card className="w-full m-2 ">
          <CardHeader>
            <CardTitle>Termékek kezelése</CardTitle>
            <CardDescription>
              Hozzon létre, módosítsa vagy törölje a termékeket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 rounded-md border">
              {avaiableProducts.map((product) => (
                <div key={product.id}>
                  <div className="m-4 flex justify-between items-center">
                    <div className="flex items-center gap-x-4">
                      <img
                        className="w-10 h-10"
                        src={
                          "http://127.0.0.1:8000/products/" + product.images[0]
                        }
                      />
                      <div className="text-md">
                        {product.name}
                        {!product.showed ? " (elrejtve)" : ""}
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => setModifyProduct(product)}>
                          Módosítás
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[650px]">
                        <DialogHeader>
                          <DialogTitle>Termék módosítása</DialogTitle>
                          <DialogDescription>
                            Módosítsa a már meglévő terméket
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid w-full items-center gap-4">
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="name">Termék neve</Label>
                            <Input
                              type="text"
                              id="name"
                              placeholder="Termék neve"
                              value={modifyProduct.name}
                              onChange={(e) =>
                                setModifyProduct({
                                  ...modifyProduct,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="description">Termék leírása</Label>
                            <Textarea
                              placeholder="Termék leírása"
                              id="description"
                              value={modifyProduct.description}
                              onChange={(e) =>
                                setModifyProduct({
                                  ...modifyProduct,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="price">Termék ára</Label>
                            <Input
                              type="number"
                              id="price"
                              placeholder="Termék ára"
                              value={modifyProduct.price}
                              onChange={(e) =>
                                setModifyProduct({
                                  ...modifyProduct,
                                  price: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="quantity">Termék darabszáma</Label>
                            <Input
                              type="number"
                              id="quantity"
                              placeholder="Termék darabszáma"
                              value={modifyProduct.quantity}
                              onChange={(e) =>
                                setModifyProduct({
                                  ...modifyProduct,
                                  quantity: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="category">Termék kategóriája</Label>
                            <ScrollArea
                              id="category"
                              className="h-56 rounded-md border"
                            >
                              {avaiableCategories.map((category) => (
                                <div
                                  key={category}
                                  className="flex items-center space-x-2 m-4"
                                >
                                  <Checkbox
                                    id="category"
                                    checked={modifyProduct.categories.includes(
                                      category
                                    )}
                                    onCheckedChange={(value) => {
                                      if (value) {
                                        setModifyProduct({
                                          ...modifyProduct,
                                          categories: [
                                            ...modifyProduct.categories,
                                            category,
                                          ],
                                        });
                                      } else {
                                        setModifyProduct({
                                          ...modifyProduct,
                                          categories:
                                            modifyProduct.categories.filter(
                                              (item) => item !== category
                                            ),
                                        });
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
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="showed"
                              checked={modifyProduct.showed}
                              onCheckedChange={(e) => {
                                setModifyProduct({
                                  ...modifyProduct,
                                  showed: e,
                                });
                              }}
                            />
                            <Label htmlFor="showed">Termék megjelenítése</Label>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <div className="flex flex-1 justify-between">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Törlés
                              </Button>
                              <Button
                                type="button"
                                onClick={() => handleModifyProduct()}
                              >
                                Módosítás
                              </Button>
                            </div>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Új termék létrehozása</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                  <DialogTitle>Termék létrehozása</DialogTitle>
                  <DialogDescription>
                    Hozzon létre új terméket
                  </DialogDescription>
                </DialogHeader>
                <div className="grid w-full items-center gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="name">Termék neve</Label>
                    <Input
                      type="text"
                      id="name"
                      placeholder="Termék neve"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="description">Termék leírása</Label>
                    <Textarea
                      placeholder="Termék leírása"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="price">Termék ára</Label>
                    <Input
                      type="number"
                      id="price"
                      placeholder="Termék ára"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="quantity">Termék darabszáma</Label>
                    <Input
                      type="number"
                      id="quantity"
                      placeholder="Termék darabszáma"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="category">Termék kategóriája</Label>
                    <ScrollArea
                      id="category"
                      className="h-56 rounded-md border"
                    >
                      {avaiableCategories.map((category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-2 m-4"
                        >
                          <Checkbox
                            id="category"
                            checked={categories.includes(category)}
                            onCheckedChange={(value) => {
                              if (value) {
                                setCategories([...categories, category]);
                              } else {
                                setCategories(
                                  categories.filter((item) => item !== category)
                                );
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
                  <div className="grid w-full items-center gap-1.5">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showed"
                        checked={showed}
                        onCheckedChange={(e) => setShowed(e)}
                      />
                      <Label htmlFor="showed">Termék megjelenítése</Label>
                    </div>
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="picture">Termék képe</Label>
                    <Input
                      id="picture"
                      type="file"
                      onChange={(e) => {
                        if (e.target.files) {
                          setPicture(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" onClick={() => handleAddNewProduct()}>
                      Létrehozás
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        <Card className="w-full m-2">
          <CardHeader>
            <CardTitle>Kategóriák kezelése</CardTitle>
            <CardDescription>
              Hozzon létre új kategóriákat vagy törölje őket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 rounded-md border">
              {avaiableCategories.map((category) => (
                <div key={category}>
                  <div className="m-4 flex justify-between items-center">
                    <div className="text-md">{category}</div>
                    <Button onClick={() => handleDeleteCategory(category)}>
                      Törlés
                    </Button>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Új kategória létrehozása</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Kategória létrehozása</DialogTitle>
                  <DialogDescription>
                    Hozzon létre új kategóriát
                  </DialogDescription>
                </DialogHeader>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="new_category">Kategória neve</Label>
                  <Input
                    id="new_category"
                    type="text"
                    placeholder="Kategória neve"
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      onClick={() => handleAddNewCategory()}
                    >
                      Létrehozás
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
      <div className="flex flex-1 w-1/2 h-full">
        <Card className="w-full m-2 ">
          <CardHeader>
            <CardTitle>Kuponok kezelése</CardTitle>
            <CardDescription>
              Hozzon létre, módosítsa vagy törölje a kuponokat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 rounded-md border">
              {coupons.map((coupon) => (
                <div key={coupon.id}>
                  <div className="m-4 flex justify-between items-center">
                    <div className="text-md">
                      {coupon.code} ({coupon.discount} %)
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => setModifyCoupon(coupon)}>
                          Módosítás
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Kupon módosítása</DialogTitle>
                          <DialogDescription>
                            Módosítsa a már meglévő kupont
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="coupon_code">Kupon kód</Label>
                            <Input
                              id="coupon_code"
                              type="text"
                              placeholder="Kupon kód"
                              value={modifyCoupon.code}
                              onChange={(e) =>
                                setModifyCoupon({
                                  ...modifyCoupon,
                                  code: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="coupon_discount">
                              Kedvezmény (%)
                            </Label>
                            <Input
                              id="coupon_discount"
                              type="number"
                              min={0}
                              max={100}
                              placeholder="Kedvezmény (%)"
                              value={modifyCoupon.discount}
                              onChange={(e) =>
                                setModifyCoupon({
                                  ...modifyCoupon,
                                  discount: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <div className="flex flex-1 justify-between">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleDeleteCoupon(coupon.id)}
                              >
                                Törlés
                              </Button>
                              <Button
                                type="button"
                                onClick={() => handleModifyCoupon()}
                              >
                                Módosítás
                              </Button>
                            </div>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Új kupon létrehozása</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Kupon létrehozása</DialogTitle>
                  <DialogDescription>Hozzon létre új kupont</DialogDescription>
                </DialogHeader>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="new_code">Kupon kód</Label>
                  <Input
                    id="new_code"
                    type="text"
                    placeholder="Kupon kód"
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, code: e.target.value })
                    }
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="new_discount">Kedvezmény (%)</Label>
                  <Input
                    id="new_discount"
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Kedvezmény (%)"
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, discount: e.target.value })
                    }
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" onClick={() => handleAddNewCoupon()}>
                      Létrehozás
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default ProductEdit;
