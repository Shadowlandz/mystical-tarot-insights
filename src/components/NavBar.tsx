import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NavBar = () => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="fixed z-10 w-full bg-[rgba(10,10,20,0.85)] backdrop-blur-md text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold flex items-center">
              <span className="text-purple-300">Mystic</span>
              <span className="ml-1">Tarot</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`hover:text-purple-300 transition-colors ${
                location.pathname === "/" ? "text-purple-300" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/tarot"
              className={`hover:text-purple-300 transition-colors ${
                location.pathname === "/tarot" ? "text-purple-300" : ""
              }`}
            >
              Tarot
            </Link>
            <Link
              to="/acervo"
              className={`hover:text-purple-300 transition-colors ${
                location.pathname.includes("/acervo") ? "text-purple-300" : ""
              }`}
            >
              Acervo
            </Link>
            <Link
              to="/routines"
              className={`hover:text-purple-300 transition-colors ${
                location.pathname === "/routines" ? "text-purple-300" : ""
              }`}
            >
              Rotinas
            </Link>
            <Link
              to="/sobre"
              className={`hover:text-purple-300 transition-colors ${
                location.pathname === "/sobre" ? "text-purple-300" : ""
              }`}
            >
              Sobre
            </Link>

            {/* Auth Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src="" alt={user.email || ""} />
                    <AvatarFallback className="bg-purple-700 text-white">
                      {user.email ? user.email[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium">{user.email}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer w-full">Meu perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/routines" className="cursor-pointer w-full">Minhas rotinas</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-500"
                  >
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth"
                className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-md transition-colors"
              >
                Entrar
              </Link>
            )}

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
