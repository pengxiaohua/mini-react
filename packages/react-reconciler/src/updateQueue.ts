import { Action } from 'shared/ReactTypes';

export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

// 创建更新
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};

// 创建更新队列
export const createUpdateQueue = <State>() => {
	return {
		shared: { pending: null }
	} as UpdateQueue<State>;
};

// 入队
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	updateQueue.shared.pending = update;
};

/**
 * 执行更新
 * @param baseState 初始状态
 * @param pendingUpdate 待执行的更新
 */
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memorizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memorizedState: baseState
	};

	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		// baseState 为函数时，执行函数
		if (action instanceof Function) {
			result.memorizedState = action(baseState);
		} else {
			// baseState 为普通值时，直接赋值
			result.memorizedState = action;
		}
	}

	return result;
};
