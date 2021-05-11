export type Path = number[];

export type Side = 'left' | 'right';

export type TreeNode = {
  data?: Record<string, any>;
  children?: TreeNode[];
};

export type Tree = TreeNode[];

export interface InsertNodeOperation {
  type: 'insert_node';
  path: Path;
  newNode: TreeNode;
}

export interface RemoveNodeOperation {
  type: 'remove_node';
  path: Path;
  removedNode?: TreeNode;
}

export interface MoveNodeOperation {
  type: 'move_node';
  fromPath: Path;
  toPath: Path;
}

export interface EditNodeOperation {
  type: 'edit_node';
  path: Path;
  data: Record<string, any>;
  prevData?: Record<string, any>;
}

export type TreeOpComponent =
  | EditNodeOperation
  | InsertNodeOperation
  | RemoveNodeOperation
  | MoveNodeOperation;

export type TreeOp = TreeOpComponent[];
