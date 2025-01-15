import {
  RiBlueskyLine,
  RiExternalLinkLine,
  RiGithubLine,
  RiHome4Line,
  RiInstagramLine,
  RiLinkedinLine,
  RiMailSendLine,
  RiPlantLine,
  RiRadarLine,
  RiRssLine,
  RiTelegram2Line,
  RiTwitterXLine,
  RiUserLine,
  RiYoutubeLine,
} from "@remixicon/react";
import type { Link } from "~/type/linktreeTypes";

export const makeLinktree = (links: Link[]) =>
  links.map((link) => ({
    ...link,
    icon:
      link.link_type === "Home page" ? (
        <RiHome4Line />
      ) : link.link_type === "Github" ? (
        <RiGithubLine />
      ) : link.link_type === "Twitter" || link.link_type === "X" ? (
        <RiTwitterXLine />
      ) : link.link_type === "Instagram" ? (
        <RiInstagramLine />
      ) : link.link_type === "LinkedIn" ? (
        <RiLinkedinLine />
      ) : link.link_type === "Telegram" ? (
        <RiTelegram2Line />
      ) : link.link_type === "Bluesky" ? (
        <RiBlueskyLine />
      ) : link.link_type === "Lens" ? (
        <RiPlantLine />
      ) : link.link_type === "YouTube" ? (
        <RiYoutubeLine />
      ) : link.link_type === "Email" ? (
        <RiMailSendLine />
      ) : link.link_type === "Profile" ? (
        <RiUserLine />
      ) : link.link_type === "Channel" ? (
        <RiRadarLine />
      ) : link.link_type === "RSS" ? (
        <RiRssLine />
      ) : (
        <RiExternalLinkLine />
      ),
  }));
