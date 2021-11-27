import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";
import typescript from "@rollup/plugin-typescript";
import sveltePreprocess from "svelte-preprocess";

const isProduction = !process.env.ROLLUP_WATCH;

function createConfig(filename, useSvelte = false) {
  return {
    input: `src/${filename}.ts`,
    output: {
      format: "cjs",
      file: `dist/build/${filename}.js`,
      sourcemap: false
    },
    plugins: [
      typescript(),
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

function createConfigCss(filename) {
  return {
    input: `src/styles-injected/${filename}.css`,
    output: { // This one is controlling the output
      file: `dist/build/styles-injected/${filename}.css`
    },
    plugins: [css({ output: `${filename}.css` })],
    watch: {
      clearScreen: true
    }
  };
}

export default [
  createConfig("scripts/ytsc-content-script-initialize"),
  createConfig("popup/popup", true),
  createConfigCss("main")
];
