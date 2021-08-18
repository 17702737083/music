export type SiteMapCardProp = {
  title: string;
  data: { name: string; children: { name: string; url: string }[] }[];
};
