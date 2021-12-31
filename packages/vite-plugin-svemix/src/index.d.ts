export type SvemixConfig = {
  prerenderAll?: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
};

export default function SvemixVitePlugin(): any;
