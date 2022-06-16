import type { Plugin, ResolvedConfig } from 'vite';
import type { LibItem } from './type';
import { optionsCheck, addImportToCode, codeIncludesLibName } from './utils';

export default function ViteComponentsImport(libs: LibItem[]): Plugin {
    let viteConfig: ResolvedConfig;
    const name = '@eks/vite-plugin-vue-import';
    if (!optionsCheck(libs)) return { name };
    return {
        name,
        configResolved(resolvedConfig) {
            viteConfig = resolvedConfig;
        },
        transform(code, id) {
            if (!/(node_modules)/.test(id) && codeIncludesLibName(code, libs)) {
                return {
                    code: addImportToCode(code, libs, viteConfig.command),
                    map: this?.getCombinedSourcemap()
                };
            }
            return {
                code,
                map: null
            };
        }
    };
}
