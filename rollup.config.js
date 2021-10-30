import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import css from "rollup-plugin-css-only";

const isProduction = !process.env.ROLLUP_WATCH;

function createConfig(filename, useSvelte = false) {
  return {
    input: `src/${filename}.js`,
    output: {
      format: "iife",
      file: `dist/build/${filename}.js`
    },
    plugins: [
      useSvelte && css({ output: "popup.css" }),
      useSvelte &&
      svelte({
        compilerOptions: {
          dev: !isProduction
        },
        preprocess: sveltePreprocess()
      }),
      resolve({
        dedupe: ["svelte"]
      }),
      commonjs(),
      isProduction && terser()
    ],
    watch: {
      clearScreen: true
    }
  };
}

export default [
  createConfig("scripts/ytsc-content-script"),
  createConfig("popup/popup", true)
];
