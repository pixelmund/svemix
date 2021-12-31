process.env.NODE_ENV = "test";

import * as assert from "uvu/assert";
import { test } from "uvu";
import path from "path";

import Pipeline from "../src/pipeline/index.js";
import { getScripts } from "../src/pipeline/pipes/scripts.js";
import { ssrEndpointTemplate } from "../src/pipeline/pipes/transformers/ssr.js";

function removeWhitespace(code) {
  return code
    .replace(/(\r\n|\n|\r)/gm, "")
    .split(" ")
    .join("");
}

function assertStrings(string1, string2) {
  return assert.equal(removeWhitespace(string1), removeWhitespace(string2));
}

test("Ignores files that are not ending with .svelte", async () => {
  const MOCK_DOC = {
    filename: path.resolve("", "src", "routes", "index.js").replace(/\\/g, "/"),
    content: `let hello = 'world';`,
  };

  // Content / code should be the same because we skip the file entirely

  const result = await Pipeline({
    config: {},
    doc: {
      filename: MOCK_DOC.filename,
      content: MOCK_DOC.content,
      scripts: { arr: [] },
      functions: { action: false, loader: false, metadata: false },
      route: {},
    },
  });

  assert.equal(MOCK_DOC.content, result.code);
});

test("Ignores files that are not inside routes", async () => {
  const MOCK_DOC = {
    filename: path
      .resolve("", "src", "pages", "index.svelte")
      .replace(/\\/g, "/"),
    content: `<script>
    let hello = 'world';
    </script>`,
  };

  // Content / code should be the same because we skip the file entirely

  const result = await Pipeline({
    config: {},
    doc: {
      filename: MOCK_DOC.filename,
      content: MOCK_DOC.content,
      scripts: { arr: [] },
      functions: { action: false, loader: false, metadata: false },
      route: {},
    },
  });

  assert.equal(MOCK_DOC.content, result.code);
});

test("Can get all the scripts (instance, ssr, module)", async () => {
  const MOCK_DOC = {
    content: `
    <script context="module" ssr>
      import db from "$lib/db";
    </script>
    <script context="module">
      let client = true;
    </script>
    <script>
    let hello = 'world';
    </script>`,
  };

  const scripts = getScripts(MOCK_DOC.content);

  assert.equal(scripts.length, 3);
  assert.equal(scripts[0].attrs.context, "module");
  assert.equal(scripts[0].attrs.ssr, true);
  assert.equal(scripts[1].attrs.context, "module");
  assert.equal(scripts[1].attrs.ssr, undefined);
});

test("Replaces all server-side code and writes a loader with corresponding load function.", async () => {
  const MOCK_DOC = {
    filename: path
      .resolve("", "src", "routes", "index.svelte")
      .replace(/\\/g, "/"),
    content: `
           <script context="module" lang="ts" ssr>
              import database from "$lib/db";
              export const loader = () => {
                  return {
                      props: {
                          name: 'Mike'
                      }
                  }
              }
           </script>
          `,
  };

  const result = await Pipeline({
    config: {},
    doc: {
      filename: MOCK_DOC.filename,
      content: MOCK_DOC.content,
      scripts: { arr: [] },
      functions: { action: false, loader: false, metadata: false },
      route: {},
    },
  });

  // fs.writeFileSync(path.resolve(".", "mock.svelte"), result.code, "utf8");

  assertStrings(
    result.code,
    `
  <script context="module">
  import { loadHandler } from "svemix"

  export const prerender = false;

  export async function load(input) {
     const { params } = input;

     const queryString = input.url?.search || '';
 
     let routesName = \`/$__svemix__\`;
 
     if(queryString.length > 0){
         routesName = routesName + '?' + queryString;
     }
 
     const handleLoad = loadHandler({ routesName });

     return handleLoad(input)
   }
    
  </script>
 
   <script >
       import { Meta } from "svemix"; 
       
       export let _metadata = {};
   </script>
   
   <Meta _defaults={{}} {_metadata} />
  `
  );
});

test("Can have normal and server module scripts", async () => {
  const MOCK_DOC = {
    filename: path
      .resolve("", "src", "routes", "index.svelte")
      .replace(/\\/g, "/"),
    content: `
           <script context="module" lang="ts" ssr>
              import database from "$lib/db";
              export const loader = () => {
                  return {
                      props: {
                          name: 'Mike'
                      }
                  }
              }
           </script>
           <script context="module" lang="ts">
              let client = true;
           </script>
          `,
  };

  const result = await Pipeline({
    config: {},
    doc: {
      filename: MOCK_DOC.filename,
      content: MOCK_DOC.content,
      scripts: { arr: [] },
      functions: { action: false, loader: false, metadata: false },
      route: {},
    },
  });

  // fs.writeFileSync(path.resolve(".", "mock.svelte"), result.code, "utf8");

  assertStrings(
    result.code,
    `
  <script context="module">
  import { loadHandler } from "svemix"

  export const prerender = false;

  let client = true;

  export async function load(input) {
     const { params } = input;

     const queryString = input.url?.search || '';
 
     let routesName = \`/$__svemix__\`;
 
     if(queryString.length > 0){
         routesName = routesName + '?' + queryString;
     }
 
     const handleLoad = loadHandler({ routesName });

     return handleLoad(input)
   }
    
  </script>
 
   <script >
       import { Meta } from "svemix"; 
       
       export let _metadata = {};
   </script>
   
   <Meta _defaults={{}} {_metadata} />
  `
  );
});

test("Generates corresponding endpoint file for ssr modules", async () => {
  const MOCK_DOC = {
    filename: path
      .resolve("", "src", "routes", "index.svelte")
      .replace(/\\/g, "/"),
    content: `
           <script context="module" lang="ts" ssr>
              import database from "$lib/db";
              export const loader = () => {
                  return {
                      props: {
                          name: 'Mike'
                      }
                  }
              }
           </script>
          `,
  };

  const scripts = getScripts(MOCK_DOC.content);

  const code = ssrEndpointTemplate({
    ssrContent: scripts[0].content,
    doc: {
      route: {
        path: "",
        name: "",
      },
      scripts: {
        ssr: scripts[0].content,
      },
      content: scripts[0].content,
      functions: {
        loader: true,
        action: false,
        metadata: false,
      },
    },
  });

  assertStrings(
    code,
    `
  import { getHandler, postHandler } from "svemix/server";

  import database from "$lib/db";
  export const loader = () => {
    return {
      props: {
         name: 'Mike'
        }
      }
    }

  export const get = getHandler({
    hasMeta: false,
    loader: loader,
    metadata: () => ({})
  });
  `
  );
});

test("Pre-rendering enabled ignores search query", async () => {
  const MOCK_DOC = {
    filename: path
      .resolve("", "src", "routes", "index.svelte")
      .replace(/\\/g, "/"),
    content: `
           <script context="module" lang="ts" ssr>
              import database from "$lib/db";

              export const prerender = true;

              export const loader = () => {
                  return {
                      props: {
                          name: 'Mike'
                      }
                  }
              }
           </script>
          `,
  };

  const result = await Pipeline({
    config: {},
    doc: {
      filename: MOCK_DOC.filename,
      content: MOCK_DOC.content,
      scripts: { arr: [] },
      functions: { action: false, loader: false, metadata: false },
      route: {},
    },
  });

  // fs.writeFileSync(path.resolve(".", "mock.svelte"), result.code, "utf8");

  assertStrings(
    result.code,
    `
  <script context="module">
  import { loadHandler } from "svemix"

  export const prerender = true;

  export async function load(input) {
     const { params } = input;

     let routesName = \`/$__svemix__\`;
 
     const handleLoad = loadHandler({ routesName });

     return handleLoad(input)
   }
    
  </script>
 
   <script >
       import { Meta } from "svemix"; 
       
       export let _metadata = {};
   </script>
   
   <Meta _defaults={{}} {_metadata} />
  `
  );
});

test.run();
