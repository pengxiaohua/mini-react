// 递归中的递阶段
import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';
import { processUpdateQueue, UpdateQueue } from './updateQueue';

// 递归中的递阶段
export const beginWork = (wip: FiberNode) => {
	// 比较，返回子fiberNode
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return null;
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.warn('beginWork未实现的类型', wip);
			}
			break;
	}
};

const updateHostRoot = (wip: FiberNode) => {
	// 获取fiberNode的state
	const baseState = wip.memorizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	// 将更新队列置空
	updateQueue.shared.pending = null;
	const { memorizedState } = processUpdateQueue(baseState, pending);
	wip.memorizedState = memorizedState;
};
