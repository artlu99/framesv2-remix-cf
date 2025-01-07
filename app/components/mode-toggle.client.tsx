import { RiMoonLine, RiSunLine } from "@remixicon/react";
import { useEffect } from "react";
import { Theme, useTheme } from "remix-themes";
import { Button } from "~/components/ui/button";

export function ModeToggle() {
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    setTheme(Theme.DARK);
  }, [setTheme]);

  const toggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  return (
    <Button variant="ghost" size="icon" onClick={() => toggleTheme()}>
      {theme === Theme.LIGHT ? (
        <RiSunLine className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      ) : (
        <RiMoonLine className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      )}
    </Button>
  );
}
