import { motion } from "framer-motion";
import { ModeToggle } from "~/components/mode-toggle.client";

interface TopNavBarProps {
  title: string;
}

const TopNavBar = (props: TopNavBarProps) => {
  const { title } = props;

  return (
    <nav className="flex justify-between bg-base-200 p-2">
      <div className="flex items-center flex-shrink-0">
        <a href="/nerds">
          <img
            className="h-8 w-auto"
            src="/assets/farcaster.svg"
            alt="Farcaster"
          />
        </a>
        <span className="ml-3 text-sm">
          {title.split("").map((el, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 2,
                delay: i / 10,
                repeat: Infinity,
                repeatType: "loop",
              }}
              key={i}
            >
              {el}
            </motion.span>
          ))}
        </span>
      </div>
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </nav>
  );
};

export default TopNavBar;
