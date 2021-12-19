export type SvemixConfig = {
  routes?: string;
  prerender?: boolean;
  seoDefaults?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
};

export default function SvemixVitePlugin(config: SvemixConfig): any;
