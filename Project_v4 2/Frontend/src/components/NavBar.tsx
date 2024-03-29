import { useState, useEffect } from "react";

import { Moon, Sun } from "lucide-react";
import { jwtDecode } from "jwt-decode";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";

import { Link } from "react-router-dom";

const Navbar = () => {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt_token");
    if (jwtToken) {
      const decodedToken: any = jwtDecode(jwtToken);
      setIsAnonymous(decodedToken.is_anonymous);
      setIsAdmin(decodedToken.is_admin);
    }
  }, []);

  return (
    <div className="flex flex-1 m-2 mr-3 justify-between align-middle">
      <div className="flex items-center gap-x-1">
        <h3 className="inline-block mx-2 text-lg font-bold">PurplePure</h3>
        <Button variant="ghost" asChild>
          <Link to="/products">Termékek</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/cart">Kosár</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/orders">Rendelések</Link>
        </Button>
        {isAdmin && (
          <>
            <Button variant="ghost" asChild>
              <Link to="/edit-products">Admin Termékek</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/shippings">Admin Rendelések</Link>
            </Button>
          </>
        )}
        <Button variant="ghost" asChild>
          <Link to="/settings">Beállítások</Link>
        </Button>
      </div>
      <div className="flex items-center gap-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Sun className="mr-2 h-4 w-4 inline-block dark:hidden" />
              <Moon className="mr-2 h-4 w-4 hidden dark:inline-block" />
              Téma
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Világos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Sötét
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              Rendszer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {isAnonymous ? (
          <>
            <Button variant="outline" asChild>
              <Link to="/register">Regisztráció</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Belépés</Link>
            </Button>
          </>
        ) : (
          <Button variant="outline" asChild>
            <Link to="/logout">Kijelentkezés</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
