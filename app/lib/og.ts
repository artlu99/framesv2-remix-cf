import config from "~/config.json";

export const ogImageUrl = (fid: number) =>
  `${config.dynamicOgService.baseUrl}?mainText=${
    fid == config.fid ? config.dynamicOgService.params.mainText : fid
  }&description=${config.dynamicOgService.params.description}&footerText=${
    config.dynamicOgService.params.footerText
  }&style=${config.dynamicOgService.params.style}`;
