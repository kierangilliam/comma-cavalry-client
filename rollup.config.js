import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import path from "path"
import autoPreprocess from 'svelte-preprocess'
import { createRollupConfigs } from './scripts/base.config.js'

const production = !process.env.ROLLUP_WATCH

const aliasEntries = [
    {
        find: "@types",
        replacement: path.resolve(__dirname, "src/types")
    },
    {
        find: "@gql",
        replacement: path.resolve(__dirname, "src/lib/gql")
    },
    {
        find: "@components",
        replacement: path.resolve(__dirname, "src/components")
    },
    {
        find: "@lib/*",
        replacement: path.resolve(__dirname, "src/lib/*")
    },
    {
        find: "@templates",
        replacement: path.resolve(__dirname, "src/components/templates")
    },
]

const svelteWrapper = (cfg, ctx) => ({
    ...cfg,
    preprocess: autoPreprocess({}),
})

const rollupWrapper = cfg => {
    cfg.plugins = [
        ...cfg.plugins,
        replace({
            __buildEnv__: `'${process.env.NODE_ENV}'`,
        }),
        alias({ entries: aliasEntries }),
        typescript({ sourceMap: !production }),
    ]
    return cfg
}

export const config = {
    staticDir: 'static',
    distDir: 'dist',
    buildDir: `dist/build`,
    serve: !production,
    production,
    rollupWrapper,
    svelteWrapper,
    swWrapper: cfg => cfg,
}

const configs = createRollupConfigs(config)

export default configs
