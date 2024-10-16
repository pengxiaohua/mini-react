// 调用 beginWork 和 completeWork
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { HostRoot } from './workTags';
import { MutationMask, NoFlags } from './fiberFlags';

let workInProgress: FiberNode | null = null;

const prepareFreshStack = (root: FiberRootNode) => {
	workInProgress = createWorkInProgress(root.current, {});
};

export const scheduleUpdateOnFiber = (fiber: FiberNode) => {
	// TODO:调度功能
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
};

const markUpdateFromFiberToRoot = (fiber: FiberNode) => {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
};

const renderRoot = (root: FiberRootNode) => {
	// 初始化
	prepareFreshStack(root.current);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn('workLoop发生错误', e);
			}
			workInProgress = null;
		}
	} while (workInProgress !== null);

	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;

	// 提交
	commitRoot(root);
};

const commitRoot = (root: FiberRootNode) => {
	const finishedWork = root.finishedWork;

	if (finishedWork === null) {
		return;
	}

	if (__DEV__) {
		console.warn('commit阶段开始', finishedWork);
	}

	// 重置
	root.finishedWork = null;

	// 判断是否存在3个子阶段需要执行的操作
	const subtreeHasEffects =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

	if (subtreeHasEffects || rootHasEffect) {
		// beforeMutation
		// mutation
		root.current = finishedWork;
		// layout
	} else {
		root.current = finishedWork;
	}
};

const workLoop = () => {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
};

const performUnitOfWork = (fiber: FiberNode) => {
	// 如果有子节点，遍历子节点
	const next = beginWork(fiber);
	fiber.memorizedProps = fiber.pendingProps;

	// 如果没有子节点，则完成当前fiberNode
	if (next === null) {
		completeUnitOfWork(fiber);
	} else {
		// 如果有子节点，则继续向下遍历
		workInProgress = next;
	}
};

const completeUnitOfWork = (fiber: FiberNode) => {
	// 收集副作用
	let node: FiberNode | null = fiber;

	do {
		completeWork(node);

		const sibling = node.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		// 如果没有兄弟节点，则返回父亲节点
		node = node.return;
		workInProgress = node;
	} while (node !== null);
};
