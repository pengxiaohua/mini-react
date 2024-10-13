// 返回的是ReactElement的数组结构
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import {
	Type,
	Key,
	Props,
	Ref,
	ReactElementType,
	ElementType
} from 'shared/ReactTypes';

// 实现 ReactElement 构造函数
const ReactElement = (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType => {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'pxh'
	};
	return element;
};

export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
	let key: Key = null;
	const props: Props = {};
	let ref: Ref = null;

	for (const prop in config) {
		const val = config[prop];

		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val;
			}
			continue;
		} else if (prop === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}

		// 判断是否是 props,如果是原型链上的属性，则跳过
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}

	const maybeChildrenLength = maybeChildren.length;
	if (maybeChildrenLength) {
		// 如果只有一个子元素，则直接赋值给 props.children
		if (maybeChildrenLength === 1) {
			props.children = maybeChildren[0];
		} else {
			// 如果有多个子元素，则将它们包装成一个数组
			props.children = maybeChildren;
		}
	}

	// 返回新的 ReactElement
	return ReactElement(type, key, ref, props);
};

export const jsxDEV = (type: ElementType, config: any) => {
	let key: Key = null;
	const props: Props = {};
	let ref: Ref = null;

	for (const prop in config) {
		const val = config[prop];

		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val;
			}
			continue;
		} else if (prop === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}

		// 判断是否是 props,如果是原型链上的属性，则跳过
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}

	// 返回新的 ReactElement
	return ReactElement(type, key, ref, props);
};
