// 递归中的归阶段

import { FiberNode } from './fiber';

export const completeWork = (fiber: FiberNode) => {
	// 收集副作用
	console.log({ fiber });
};
