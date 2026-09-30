import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetHeader,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const NavBar = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="w-full border-b overflow-x-hidden">
        <div className="hidden mx-auto md:flex max-w-7xl items-center justify-between px-4 sm:px-6 pb-3">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-4">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink
                    to="/"
                    className="whitespace-nowrap overflow-hidden text-center text-ellipsis"
                  >
                    Dashboard
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {user && (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/speaks"
                        className="whitespace-nowrap overflow-hidden text-center text-ellipsis"
                      >
                        Speaks
                      </NavLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem></NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/debates"
                        className="whitespace-nowrap overflow-hidden text-center text-ellipsis"
                      >
                        Debates
                      </NavLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/tournaments"
                        className="whitespace-nowrap overflow-hidden text-center text-ellipssis"
                      >
                        Tournaments
                      </NavLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/import"
                        className="whitespace-nowrap overflow-hidden text-center text-ellipssis"
                      >
                        Import Tab
                      </NavLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="whitespace-nowrap text-center"
              >
                {user ? user.email : "Account"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 max-w-full">
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <div onClick={handleSignOut}>Sign out</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/help">Help</NavLink>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <NavLink to="/signin">Log in</NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/signup">Register</NavLink>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-rcenter justify-end p-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col h-full">
              <SheetHeader className="text-left">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-6 flex-1 ml-6">
                <SheetClose asChild>
                  <NavLink
                    to="/"
                    className="text-base font-medium hover:text-primary"
                  >
                    Dashboard
                  </NavLink>
                </SheetClose>
                <SheetClose asChild>
                  <NavLink
                    to="/speaks"
                    className="text-base font-medium hover:text-primary"
                  >
                    Speaks
                  </NavLink>
                </SheetClose>
                <SheetClose asChild>
                  <NavLink
                    to="/debates"
                    className="text-base font-medium hover:text-primary"
                  >
                    Debates
                  </NavLink>
                </SheetClose>
                <SheetClose asChild>
                  <NavLink
                    to="/tournaments"
                    className="text-base font-medium hover:text-primary"
                  >
                    Tournaments
                  </NavLink>
                </SheetClose>
                <SheetClose asChild>
                  <NavLink
                    to="/add"
                    className="text-base font-medium hover:text-primary"
                  >
                    Add Debate
                  </NavLink>
                </SheetClose>
                <SheetClose asChild>
                  <NavLink
                    to="/add-tournaments"
                    className="text-base font-medium hover:text-primary"
                  >
                    Add Tournament
                  </NavLink>
                </SheetClose>
                <SheetClose asChild>
                  <NavLink
                    to="/import"
                    className="text-base font-medium hover:text-primary"
                  >
                    Import Tab
                  </NavLink>
                </SheetClose>
              </div>

              <div className="border-t pt-4 mt-auto mb-6 mr-2">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground mb-2 px-1">
                      Signed in as {user.email}
                    </p>
                    <SheetClose asChild>
                      <Button
                        onClick={handleSignOut}
                        variant="destructive"
                        className="w-full"
                      >
                        Sign Out
                      </Button>
                    </SheetClose>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <SheetClose asChild>
                      <Button asChild className="w-full">
                        <NavLink to="/signin">Log in</NavLink>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="outline" asChild className="w-full">
                        <NavLink to="/signup">Register</NavLink>
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default NavBar;
