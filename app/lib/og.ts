import config from "~/config.json";

export const ogImageUrl = () =>
  `${config.dynamicOgService.baseUrl}?mainText=${config.dynamicOgService.params.mainText}&description=${config.dynamicOgService.params.description}&footerText=${config.dynamicOgService.params.footerText}&style=${config.dynamicOgService.params.style}`;
