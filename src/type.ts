type Style = (name: string) => string | string[] | boolean
export interface LibItem {
    // library name
    libName: string
    // component style file path
    style?: Style | boolean | 'css'
    base?: boolean | string
    // default `es`
    libDirectory?: string
    // whether convert component name from camel to dash
    camel2Dash?: boolean
}

export interface ImportMaps {
    [key: string]: string[]
}

export type AstNode = {
    source: {
        value?: string
    }
}

export type Specifiers = {
    imported: {
        name?: string
    }
    local: {
        name?: string
    }
}
