import type { Tree, TreeOp, Path, TreeNode, Side } from "./types";
import { internalType } from "./internal";

import * as treeUtils from "./utils";

export const utils = treeUtils;

export const type = {
  name: "tree",
  url: "https://github.com/yiminghe/ot-tree",
  create(tree: Tree) {
    return tree;
  },
  apply(tree: Tree, op: TreeOp) {
    for (let opComponent of op) {
      internalType.apply(tree, opComponent);
    }
    return tree;
  },
  makeInvertible(op: TreeOp, tree: Tree): TreeOp {
    return op.map((opComponent) =>
      internalType.makeInvertible(opComponent, tree)
    );
  },
  invert(op: TreeOp) {
    return op.map((opComponent) => internalType.invert(opComponent));
  },
  invertWithDoc(op: TreeOp, tree: Tree) {
    return type.invert(type.makeInvertible(op, tree));
  },
  transform(op: TreeOp, otherOp: TreeOp, side: Side): TreeOp {
    return treeUtils.transform(op, otherOp, side, internalType.transform)[0];
  },
};

export function insertOp(path: Path, newNode: TreeNode = {}): TreeOp {
  return [
    {
      type: "insert_node",
      path,
      newNode,
    },
  ];
}

export function removeOp(path: Path, removedNode?: TreeNode): TreeOp {
  return [
    {
      type: "remove_node",
      path,
      removedNode,
    },
  ];
}

export function moveOp(from: Path, to: Path): TreeOp {
  return [
    {
      type: "move_node",
      fromPath: from,
      toPath: to,
    },
  ];
}

export { internalType } from "./internal";

export type {
  Tree,
  TreeOpComponent,
  Path,
  TreeNode,
  Side,
  InsertNodeOperation,
  MoveNodeOperation,
  RemoveNodeOperation,
} from "./types";
