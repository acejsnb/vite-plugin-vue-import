import type { ResolvedConfig } from 'vite';
import * as parser from '@babel/parser';
import generate from '@babel/generator';
import type { LibItem, ImportMaps, AstNode, Specifiers } from './type';

const parseName = (name: string): string => {
    const str = name[0].toLowerCase() + name.substring(1);
    return str.replace(/([A-Z])/g, ($1) => `-${$1.toLowerCase()}`);
}

const isString = (str: unknown) => (typeof str === 'string');
const isArray = (libs: unknown) => Array.isArray(libs);

export const optionsCheck = (libs: LibItem[]) => {
    if (isArray(libs) && libs?.length) return true;
    console.error('libs is required, please check your options!');
    return false;
};

export const codeIncludesLibName = (code: string, libs: LibItem[]) => !libs.every(({ libName }) => !new RegExp(`('${libName}')|("${libName}")`).test(code));

export function parseImportModule (
    code: string,
    libs: LibItem[],
    command: ResolvedConfig['command']
) {
    const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: [
            'jsx'
        ]
    });

    const astBody = ast.program.body;

    const importMaps: ImportMaps = {};
    const toBeRemoveIndex: number[] = [];
    let newImportStatement = '';
    if (isArray(astBody)) {
        astBody.forEach((astNode, index) => {
            const libName = (astNode as AstNode)?.source?.value || '';
            const matchLib = libs.find(lib => lib.libName === libName);
            if (astNode.type === 'ImportDeclaration' && matchLib) {
                const { camel2Dash = true } = matchLib;
                astNode.specifiers.forEach((item) => {
                    const name = (item as Specifiers)?.imported.name;
                    const localName = item?.local.name;
                    if (!name) {
                        return;
                    }
                    const { libDirectory = 'es' } = matchLib;
                    const libDir = libDirectory ? `${libDirectory}/` : '';
                    if (command === 'build') {
                        const finalName = camel2Dash ? parseName(name) : name;
                        newImportStatement += `import ${localName} from '${libName}/${libDir}${finalName}';`;
                        toBeRemoveIndex.push(index);
                    }
                    if (importMaps[libName]) {
                        importMaps[libName].push(name);
                    } else {
                        importMaps[libName] = [name];
                    }
                });
            }
        });
    }

    ast.program.body = astBody.filter((item: any, index: number) => !toBeRemoveIndex.includes(index));

    let codeRemoveOriginImport = generate(ast).code;
    codeRemoveOriginImport = `${newImportStatement} ; ${codeRemoveOriginImport}`;

    return { importMaps, codeRemoveOriginImport };
}

export const stylePathHandler = (stylePath: string | string[] | boolean) => {
    let str = '';
    if (isString(stylePath) && stylePath) {
        str += `import '${stylePath}';`;
    } else if (Array.isArray(stylePath)) {
        stylePath.forEach((item) => {
            str += `import '${item}';`;
        });
    }
    return str;
};

export const addImportToCode = (
    code: string,
    libs: LibItem[],
    command: ResolvedConfig['command'] = 'serve'
) => {
    const { importMaps, codeRemoveOriginImport } = parseImportModule(code, libs, command);

    let importStr = '';

    libs.forEach(({ libName, style = 'css', base = false, libDirectory = 'es', camel2Dash = true }) => {
        if (importMaps[libName]) {
            importMaps[libName].forEach(item => {
                if (camel2Dash) item = parseName(item);
                const basePath = base ? `import '${libName}/${libDirectory}/base.css';` : '';
                let stylePath;
                if (typeof style === 'function') {
                    stylePath = style(item);
                } else if (style === 'css' || style === true) {
                    stylePath = `${libName}/${libDirectory}/${item}/style.css`;
                } else if (style === false) {
                    stylePath = '';
                } else {
                    stylePath = `${libName}/${libDirectory}/${item}/style.${style}`;
                }
                const styleImportString = basePath + stylePathHandler(stylePath);
                importStr += styleImportString;
            });
        }
    });

    return `${importStr}${codeRemoveOriginImport}`;
};
