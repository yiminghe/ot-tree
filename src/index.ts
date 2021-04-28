import type {
  Tree,
  TreeOp,
  Path,
  TreeNode,
  InsertNodeOperation,
  RemoveNodeOperation,
  MoveNodeOperation,
} from "./types";
import {
  addNodeAtPath,
  removeNodeAtPath,
  moveNode,
  transformPathWhenInsert,
  transformPathWhenRemove,
  transformPathWhenMove,
  isEqual,
  isAncestor,
  isSibling,
  increment,
  decrement,
  invertPrevAndtoPath,
  getNodeAtPath,
} from "./utils";

import * as treeUtils from "./utils";

export const utils = treeUtils;

export const type = {
  name: "tree",
  url: "https://github.com/yiminghe/ot-tree",
  create(tree: Tree) {
    return tree;
  },
  apply(tree: Tree, op: TreeOp) {
    if (op.type === "insert_node") {
      addNodeAtPath(op.path, op.newNode, tree);
    } else if (op.type === "remove_node") {
      removeNodeAtPath(op.path, tree);
    } else if (op.type === "move_node") {
      moveNode(op.fromPath, op.toPath, tree);
    }
    return tree;
  },
  invert(op: TreeOp): TreeOp {
    if (op.type === "insert_node") {
      return {
        type: "remove_node",
        path: op.path,
      };
    } else if (op.type === "remove_node") {
      return {
        type: "insert_node",
        path: op.path,
        newNode: op.removedNode!,
      };
    } else if (op.type === "move_node") {
      const { fromPath, toPath } = op;
      return {
        type: "move_node",
        ...invertPrevAndtoPath(fromPath, toPath),
      };
    }
    return op;
  },
  transform(
    op: TreeOp,
    other: TreeOp,
    side: "left" | "right"
  ): TreeOp | TreeOp[] {
    let path: Path | undefined;
    // 表示 op 为 localOp
    const adjustWhenConflict = side === "right";
    if (op.type === "insert_node") {
      if (other.type === "insert_node") {
        path = transformPathWhenInsert(op.path, other.path, adjustWhenConflict);
        return {
          ...op,
          path,
        };
      }

      if (other.type === "remove_node") {
        path = transformPathWhenRemove(op.path, other.path);
        if (!path) {
          // insert into deleted tree
          return [];
        }
        return {
          ...op,
          path,
        };
      }

      if (other.type === "move_node") {
        path = transformPathWhenMove(op.path, other.fromPath, other.toPath);
        return {
          ...op,
          path,
        };
      }
    } else if (op.type === "remove_node") {
      if (other.type === "insert_node") {
        path = transformPathWhenInsert(op.path, other.path, true);
        return {
          ...op,
          path,
        };
      }

      if (other.type === "remove_node") {
        // remove same node
        if (isEqual(op.path, other.path)) {
          return [];
        }
        path = transformPathWhenRemove(op.path, other.path, adjustWhenConflict);
        if (!path) {
          // delete from a deleted tree
          return [];
        }
        return {
          ...op,
          path,
        };
      }

      if (other.type === "move_node") {
        path = transformPathWhenMove(op.path, other.fromPath, other.toPath);
        return {
          ...op,
          path,
        };
      }
    } else if (op.type === "move_node") {
      if (other.type === "insert_node") {
        return {
          ...op,
          fromPath: transformPathWhenInsert(op.fromPath, other.path, true),
          toPath: transformPathWhenInsert(op.toPath, other.path, true),
        };
      }

      if (other.type === "remove_node") {
        // first remove
        const fromPath = transformPathWhenRemove(
          op.fromPath,
          other.path,
          adjustWhenConflict
        );
        if (!fromPath) {
          return [];
        }
        // then add
        const toPath = transformPathWhenRemove(op.toPath, other.path);
        if (!toPath) {
          return [];
        }
        return {
          ...op,
          fromPath,
          toPath,
        };
      }

      if (other.type === "move_node") {
        let a = op.fromPath;
        let d = op.toPath;
        const c = other.fromPath;
        const b = other.toPath;

        if (isEqual(a, c) && isEqual(b, d)) {
          return [];
        }

        // loop
        if (
          (isEqual(c, d) || isAncestor(c, d)) &&
          (isEqual(a, b) || isAncestor(a, b))
        ) {
          if (adjustWhenConflict) {
            // local invert other and re apply
            return [type.invert(other), op];
          }

          // server transformed do nothing
          return [];
        }

        // server do not transform when fromPath equal
        if (isEqual(a, c) && !adjustWhenConflict) {
          return op;
        }

        let toPath = transformPathWhenMove(
          op.toPath,
          other.fromPath,
          other.toPath
        );
        if (isEqual(op.toPath, other.toPath)) {
          if (isSibling(other.toPath, other.fromPath)) {
            if (adjustWhenConflict) {
              toPath = increment(toPath);
            }
          } else {
            if (!adjustWhenConflict) {
              toPath = decrement(toPath);
            }
          }
        }
        return {
          ...op,
          fromPath: transformPathWhenMove(
            op.fromPath,
            other.fromPath,
            other.toPath
          ),
          toPath,
        };
      }
    }
    return op;
  },

  invertWithDoc(op: TreeOp, tree: Tree) {
    return type.invert(type.makeInvertible(op, tree));
  },

  makeInvertible(op: TreeOp, tree: Tree) {
    if (op.type === "remove_node") {
      return {
        ...op,
        removedNode: getNodeAtPath(op.path, tree),
      };
    }
    return op;
  },
};

export function insertOp(
  path: Path,
  newNode: TreeNode = {}
): InsertNodeOperation {
  return {
    type: "insert_node",
    path,
    newNode,
  };
}

export function removeOp(
  path: Path,
  removedNode?: TreeNode
): RemoveNodeOperation {
  return {
    type: "remove_node",
    path,
    removedNode,
  };
}

export function moveOp(from: Path, to: Path): MoveNodeOperation {
  return {
    type: "move_node",
    fromPath: from,
    toPath: to,
  };
}
