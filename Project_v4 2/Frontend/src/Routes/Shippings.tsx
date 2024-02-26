import { useState, useEffect } from "react";

import { getShippings, DoneShipping } from "@/API";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import Navbar from "@/components/NavBar";
import { useToast } from "@/components/ui/use-toast";

const Shippings = () => {
  const [shippings, setShippings] = useState<any>([]);
  const { toast } = useToast();

  useEffect(() => {
    const getData = async () => {
      const response = await getShippings();
      if (response.status === 200) {
        setShippings(response.data);
      } else {
        toast({
          title: "Hiba",
          description: "Ismeretlen hiba",
        });
      }
    };

    getData();
  }, []);

  const handleShipping = async (id: number) => {
    const data = {
      order_id: id,
    };

    const response = await DoneShipping(data);
    if (response.status === 200) {
      const newShippings = shippings.filter((ship: any) => ship.id !== id);
      setShippings(newShippings);
      toast({
        title: "Sikeres",
        description: "Sikeresen teljesítetted a rendelést",
      });
    } else {
      toast({
        title: "Hiba",
        description: "Ismeretlen hiba",
      });
    }
  };

  return (
    <>
      <Navbar />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Megrendelő neve</TableHead>
            <TableHead className="text-center">Megrendelő címe</TableHead>
            <TableHead className="text-center">Megrendelő email címe</TableHead>
            <TableHead className="text-center">
              Megrendelő telefonszáma
            </TableHead>
            <TableHead className="text-center">Termékek száma </TableHead>
            <TableHead className="text-center">Termékek ára</TableHead>
            <TableHead className="text-center">Művelet</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shippings.map((ship: any) => (
            <TableRow key={ship.id}>
              <TableCell className="text-left">
                {ship?.profile?.first_name} {ship?.profile?.last_name}
              </TableCell>
              <TableCell className="text-center">
                {ship?.address?.country} {ship?.address?.city}{" "}
                {ship?.address?.street} {ship?.address?.house_number}{" "}
                {ship?.address?.flat_number}
              </TableCell>
              <TableCell className="text-center">
                {ship?.profile?.email}
              </TableCell>
              <TableCell className="text-center">
                {ship?.profile?.phone_number}
              </TableCell>
              <TableCell className="text-center">
                {ship.products.reduce(
                  (acc: number, curr: { quantity: number }) =>
                    acc + curr.quantity,
                  0
                )}
              </TableCell>
              <TableCell className="text-center">
                {(
                  ship.products.reduce(
                    (
                      total: number,
                      product: { price: number; quantity: number }
                    ) => total + product.price * product.quantity,
                    0
                  ) *
                  (1 - ship.discount / 100)
                )
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                HUF
              </TableCell>
              <TableCell className="text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Termékek</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-left">
                            Termék képe
                          </TableHead>
                          <TableHead className="text-center">
                            Termék neve
                          </TableHead>
                          <TableHead className="text-center">
                            Termék ára / db
                          </TableHead>
                          <TableHead className="text-center">
                            Termék ára
                          </TableHead>
                          <TableHead className="text-center">
                            Mennyiség
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ship?.products?.map((product: any) => (
                          <TableRow key={product.id}>
                            <TableCell className="text-center">
                              <img
                                className="w-24 h-24"
                                src={
                                  "http://127.0.0.1:8000/products/" +
                                  product.images[0]
                                }
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              {product.name}
                            </TableCell>
                            <TableCell className="text-center">
                              {product.price
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                              HUF
                            </TableCell>
                            <TableCell className="text-center">
                              {(product.quantity * product.price)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                              HUF
                            </TableCell>
                            <TableCell className="text-center">
                              {product.quantity}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={1} className="text-right">
                            Kedvezmény:
                          </TableCell>
                          <TableCell className="text-center">
                            {ship.discount} %
                          </TableCell>
                          <TableCell className="text-right">
                            Összesen:
                          </TableCell>
                          <TableCell className="text-center">
                            {(
                              ship.products.reduce(
                                (
                                  total: number,
                                  product: { price: number; quantity: number }
                                ) => total + product.price * product.quantity,
                                0
                              ) *
                              (1 - ship.discount / 100)
                            )
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                            HUF
                          </TableCell>
                          <TableCell>
                            <DialogClose asChild>
                              <Button
                                className="w-full"
                                onClick={() => handleShipping(ship?.id)}
                              >
                                Véglegesítés
                              </Button>
                            </DialogClose>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Shippings;
