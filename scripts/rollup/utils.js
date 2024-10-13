import path from 'path';
import fs from 'fs';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const packagePath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

// 获取 package 路径
export const resolvePackagePath = (packageName, isDist) => {
	return isDist
		? `${distPath}/${packageName}`
		: `${packagePath}/${packageName}`;
};

// 获取 package.json 文件
export const getPackageJSON = (packageName) => {
	const path = `${resolvePackagePath(packageName, false)}/package.json`;
	// 读取文件
	const result = fs.readFileSync(path, 'utf-8');
	return JSON.parse(result);
};

// 获取基础 rollup 插件
export const getBaseRollupPlugin = ({
	alias = {
		__DEV__: true
	},
	typescript = {}
} = {}) => {
	return [replace(alias), cjs(), ts(typescript)];
};
