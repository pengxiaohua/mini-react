import {
	getPackageJSON,
	resolvePackagePath,
	getBaseRollupPlugin
} from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';

const { name, module } = getPackageJSON('react');
// 获取 package 路径
const packagePath = resolvePackagePath(name, false);
// 获取 package 打包路径
const packageDistPath = resolvePackagePath(name, true);

export default [
	// react
	{
		input: `${packagePath}/${module}`,
		output: {
			file: `${packageDistPath}/index.js`,
			name: 'index.js',
			format: 'umd'
		},
		plugins: [
			getBaseRollupPlugin(),
			generatePackageJson({
				inputFolder: packagePath,
				outputFolder: packageDistPath,
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					main: 'index.js'
				})
			})
		]
	},
	// js-runtime
	{
		input: `${packagePath}/src/jsx.ts`,
		output: [
			// js-runtime
			{
				file: `${packageDistPath}/jsx-runtime.js`,
				name: 'jsx-runtime.js',
				format: 'umd'
			},
			// js-runtime-dev
			{
				file: `${packageDistPath}/jsx-dev-runtime.js`,
				name: 'jsx-dev-runtime.js',
				format: 'umd'
			}
		],
		plugins: getBaseRollupPlugin()
	}
];
