export type Path = number[];

export type TreeNode = {
  data?: Record<string, any>;
  children?: TreeNode[];
};

export type Tree = TreeNode[];

export interface InsertNodeOperation {
  type: "insert_node";
  path: Path;
  newNode: TreeNode;
}

export interface RemoveNodeOperation {
  type: "remove_node";
  path: Path;
  removedNode?: TreeNode;
}

export interface MoveNodeOperation {
  type: "move_node";
  fromPath: Path;
  toPath: Path;
}

export type TreeOp =
  | InsertNodeOperation
  | RemoveNodeOperation
  | MoveNodeOperation;
