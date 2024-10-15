export type Flags = number;

export const NoFlags = 0b0000001;

export const Placement = 0b0000010;

export const Update = 0b0000100;

export const ChildDeletion = 0b0001000;

// mutation阶段需要执行的flags
export const MutationMask = Placement | Update | ChildDeletion;

// layout阶段需要执行的flags
export const LayoutMask = Update;

// mutation和layout阶段需要执行的flags
export const MutationLayoutMask = MutationMask | LayoutMask;
