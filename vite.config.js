import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [glsl(
        exclude = undefined,                         // RegExp | RegExp[] of file paths/extentions to ignore
        include = /\.(glsl|wgsl|vert|frag|vs|fs)$/i, // RegExp | RegExp[] of file paths/extentions to import
        defaultExtension = 'glsl'                    // Shader import suffix when no extension is specified
    )]
});