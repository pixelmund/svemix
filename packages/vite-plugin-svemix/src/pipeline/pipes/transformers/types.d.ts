export type Transformer = (args: {
  config: import("../../../").SvemixConfig;
  doc: import("../../types").PipeDocument;
}) => string;
