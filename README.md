# vite-plugin-vue-import

[![OSCS Status](https://www.oscs1024.com/platform/badge/xiongshuang/vite-plugin-vue-import.svg?size=small)](https://www.oscs1024.com/project/xiongshuang/vite-plugin-vue-import?ref=badge_small)

#### 按需加载vue3组件

### 安装
- `npm i -D vite-plugin-vue-import`
- `yarn add -D vite-plugin-vue-import`
- `pnpm add -D vite-plugin-vue-import`

### 使用

- 默认加载`double-ui-vue/es/[componentName]/style.css`
```js
// vite.config.js
import { defineConfig } from 'vite';
import viteComponentsImport from 'vite-plugin-vue-import';

export default defineConfig({
    // ...
    plugins: [
        viteComponentsImport([
            {
                libName: 'double-ui-vue'
            }
        ])
    ]
    // ...
});

```

- 不加载单个组件css
```js
// vite.config.js
import { defineConfig } from 'vite';
import viteComponentsImport from 'vite-plugin-vue-import';

export default defineConfig({
    // ...
    plugins: [
        viteComponentsImport([
            {
                libName: 'double-ui-vue',
                style: false
            }
        ])
    ]
    // ...
});

```

- 加载less，style返回`double-ui-vue/es/[componentName]/style.less`
```js
// vite.config.js
import { defineConfig } from 'vite';
import viteComponentsImport from 'vite-plugin-vue-import';

export default defineConfig({
    // ...
    plugins: [
        viteComponentsImport([
            {
                libName: 'double-ui-vue',
                style: 'less'
            }
        ])
    ]
    // ...
});

```

- 自定义加载css
```js
// vite.config.js
import { defineConfig } from 'vite';
import viteComponentsImport from 'vite-plugin-vue-import';

export default defineConfig({
    // ...
    plugins: [
        viteComponentsImport([
            {
                libName: 'double-ui-vue',
                style: (name) => `double-ui-vue/es/${name}/style.css`
            }
        ])
    ]
    // ...
});

```

- 加载base.css， 默认值`double-ui-vue/es/base.css`
```js
// vite.config.js
import { defineConfig } from 'vite';
import viteComponentsImport from 'vite-plugin-vue-import';

export default defineConfig({
    // ...
    plugins: [
        viteComponentsImport([
            {
                libName: 'double-ui-vue',
                base: `double-ui-vue/es/base.css`
            }
        ])
    ]
    // ...
});

```

### options参数

| 参数           | 说明         | 类型                                          | 默认值   | 必须    |
|--------------|------------|---------------------------------------------|-------|-------|
| libName      | 库名         | string                                      | 'es'  | true  |
| style        | 加载css方式    | true/false/'css'/'less'/'sass'/(name) => {} | 'css' | false |
| base         | 加载base.css | boolean / string                            | 'css' | false |
| libDirectory | 组件文件夹      | string                                      | 'es'  | false    |
| camel2Dash   | 驼峰转横线      | boolean                                     | true  | false    |
