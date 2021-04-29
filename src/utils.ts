import type {
  TreeNode,
  Tree,
  Path,
  Side,
  TreeOpComponent,
  TreeOp,
} from "./types";

let uid = 1;

export function uuid() {
  return ++uid;
}

export function last<O = any>(args: O[]) {
  return args && args[args.length - 1];
}

export function traverse(model: TreeNode, fn: (node: TreeNode) => boolean) {
  let ret = fn(model);
  if (ret) {
    return ret;
  }
  const { children } = model;
  if (children) {
    for (const c of children) {
      traverse(c, fn);
    }
  }
  return ret;
}

export function transformOldToPathToNewToPath(fromPath: Path, toPath: Path) {
  if (isSibling(toPath, fromPath)) {
  } else {
    // transform toPath relative to next treeData
    toPath = transformPathWhenMove(toPath, fromPath, toPath);
    if (last(toPath)) {
      toPath = decrement(toPath);
    }
  }
  return toPath;
}

export function getNodeAtPath(path: Path, tree: Tree): TreeNode | undefined {
  if (!path.length) {
    return;
  }
  let n = 0;
  let parent: TreeNode | undefined = { children: tree };
  for (const i of path) {
    n = i;
    parent = parent.children && parent.children[n];
    if (!parent) {
      return;
    }
  }
  return parent;
}

export function getParentsAndSelfAtNodePath(
  path: Path,
  tree: Tree
): TreeNode[] {
  if (!path.length) {
    return [];
  }
  let n = 0;
  const ret: TreeNode[] = [];
  let parent: TreeNode | undefined = { children: tree };
  for (const i of path) {
    n = i;
    parent = parent.children && parent.children[n];
    if (!parent) {
      return ret;
    }
    ret.push(parent);
  }
  return ret;
}

export function removeNodeAtPath(path: Path, tree: TreeNode[]) {
  const parent: TreeNode | undefined = getNodeAtPath(path.slice(0, -1), tree);
  let children = parent?.children || tree;
  let node: undefined | TreeNode;
  const last = path[path.length - 1];
  if (children[last]) {
    node = children.splice(last, 1)[0];
  }
  return node;
}

export function addNodeAtPath(path: Path, newNode: TreeNode, tree: TreeNode[]) {
  const parent: TreeNode | undefined = getNodeAtPath(path.slice(0, -1), tree);
  let children = parent?.children || tree;
  const last = path[path.length - 1];
  children.splice(last, 0, newNode);
  return parent;
}

export function moveNode(fromPath: Path, toPath: Path, tree: TreeNode[]) {
  if (isEqual(fromPath, toPath) || !toPath.length || !fromPath.length) {
    return;
  }
  const removeNode = removeNodeAtPath(fromPath, tree);
  if (removeNode) {
    return addNodeAtPath(toPath, removeNode, tree);
  }
}

export function compare(path: Path, target: Path) {
  const m = Math.min(path.length, target.length);

  for (let i = 0; i < m; i += 1) {
    const pv = path[i];
    const tv = target[i];
    if (pv < tv) {
      return -1;
    }
    if (pv > tv) {
      return 1;
    }
  }
  return path.length === target.length ? 0 : null;
}

export function crop(a: Path, b: Path, size = Math.min(a.length, b.length)) {
  const ca: Path = a.slice(0, size);
  const cb: Path = b.slice(0, size);
  return [ca, cb];
}

export function decrement(path: Path, n = 1, index = path.length - 1) {
  return increment(path, 0 - n, index);
}

export function increment(path: Path, n = 1, index = path.length - 1) {
  const newPath: Path = [...path];
  newPath[index] += n;
  return newPath;
}

export function link(ancestor: Path, subPath: Path) {
  return ancestor.concat(subPath);
}

export function isAncestor(path: Path, target: Path) {
  const [p, t] = crop(path, target);
  return path.length < target.length && isEqual(p, t);
}

export function isDescendant(path: Path, target: Path) {
  return (
    path.length > target.length && isEqual(path.slice(0, target.length), target)
  );
}

export function isBefore(path: Path, target: Path) {
  const [p, t] = crop(path, target);
  return compare(p, t) === -1;
}

export function isAfter(path: Path, target: Path) {
  const [p, t] = crop(path, target);
  return compare(p, t) === 1;
}

export function isEqual(path: Path, target: Path) {
  const pl = path.length;
  const tl = target.length;
  if (pl !== tl) {
    return false;
  }
  for (let i = 0; i < tl; i++) {
    if (path[i] !== target[i]) {
      return false;
    }
  }
  return true;
}

export function isSibling(path: Path, target: Path) {
  if (path.length !== target.length) {
    return false;
  }
  const p = parent(path);
  const t = parent(target);
  return isEqual(p, t) && path[path.length - 1] !== target[path.length - 1];
}

export function isPrevSibling(path: Path, target: Path) {
  return isSibling(path, target) && isBefore(path, target);
}

export function isYounger(path: Path, target: Path) {
  const index = path.length - 1;
  const [p, t] = crop(path, target, index);
  const pl = path[index];
  const tl = target[index];

  return isEqual(p, t) && pl < tl;
}

export function isDeeper(path: Path, target: Path) {
  return path.length > target.length;
}

export function isParent(path: Path, target: Path) {
  return path.length + 1 === target.length && isEqual(path, parent(target));
}

export function isChild(path: Path, target: Path) {
  return (
    path.length === target.length + 1 && isEqual(path.slice(0, -1), target)
  );
}

export function next(path: Path) {
  if (path.length === 0) {
    return null;
  }

  const last = path[path.length - 1];
  return path.slice(0, -1).concat(last + 1);
}

export function previous(path: Path) {
  if (path.length === 0) {
    return null;
  }

  const last = path[path.length - 1];
  if (last <= 0) {
    return null;
  }
  return path.slice(0, -1).concat(last - 1);
}

export function parent(path: Path) {
  return path.slice(0, -1);
}

export function ancestors(path: Path) {
  const ancestors: Path[] = [];
  for (let i = 0; i < path.length; i += 1) {
    ancestors.push(path.slice(0, i));
  }
  return ancestors;
}

export function common(a: Path, b: Path) {
  const path: Path = [];
  for (let i = 0; i < a.length && i < b.length; i++) {
    const av = a[i];
    const bv = b[i];

    if (av !== bv) break;

    path.push(av);
  }

  return path;
}

export function relative(path: Path, ancestor: Path) {
  if (!isAncestor(ancestor, path) || isEqual(path, ancestor)) {
    return null;
  }

  return path.slice(ancestor.length);
}

function relation(path1: Path, path2: Path) {
  const pEqual = isEqual(path1, path2);
  const pYounger = isYounger(path1, path2);
  const pAbove = isAncestor(path1, path2);
  return {
    pEqual,
    pYounger,
    pAbove,
  };
}

export function transformPathWhenInsert(
  path: Path,
  fromPath: Path,
  adjustWhenConflict?: boolean
): Path {
  const { pEqual, pYounger, pAbove } = relation(fromPath, path);
  if ((pEqual && adjustWhenConflict) || pYounger || pAbove) {
    return increment(path, 1, fromPath.length - 1);
  }
  return path;
}

export function transformPathWhenRemove(
  path: Path,
  fromPath: Path,
  adjustWhenConflict?: boolean
): Path | undefined {
  const { pEqual, pYounger, pAbove } = relation(fromPath, path);
  if (pYounger) {
    return decrement(path, 1, fromPath.length - 1);
  }
  if ((pEqual && adjustWhenConflict) || pAbove) {
    return;
  }
  return path;
}

export function transformPathWhenMove(
  path: Path,
  fromPath: Path,
  newPath: Path
): Path {
  // Stay
  if (isEqual(fromPath, newPath)) {
    return path;
  }

  const npIndex = newPath.length - 1;
  const pIndex = fromPath.length - 1;
  const { pAbove, pYounger, pEqual } = relation(fromPath, path);
  const { pYounger: npYounger, pAbove: npAbove, pEqual: npEqual } = relation(
    newPath,
    path
  );

  if (pAbove) {
    const subPath = relative(path, fromPath)!;

    if (isAfter(newPath, fromPath) && isDeeper(newPath, fromPath)) {
      return link(decrement(newPath, 1, fromPath.length - 1), subPath);
    }

    return link(newPath, subPath);
  } else if (pEqual) {
    if (isYounger(fromPath, newPath) && isDeeper(newPath, fromPath)) {
      return decrement(newPath, 1, fromPath.length - 1);
    }
    return newPath;
  } else if (isSibling(fromPath, newPath) && (npAbove || npEqual)) {
    if (pYounger) {
      return decrement(path, 1, pIndex);
    } else {
      return increment(path, 1, pIndex);
    }
  } else if (npEqual || npYounger || npAbove) {
    if (pYounger) {
      return increment(decrement(path, 1, pIndex), 1, npIndex);
    }
    return increment(path, 1, npIndex);
  } else if (pYounger) {
    return decrement(path, 1, pIndex);
  }
  return path;
}

export function transformOldtoPathToNewtoPath(fromPath: Path, toPath: Path) {
  if (isSibling(toPath, fromPath)) {
  } else {
    // transform toPath relative to next treeData
    toPath = transformPathWhenMove(toPath, fromPath, toPath);
    if (last(toPath)) {
      toPath = decrement(toPath);
    }
  }
  return toPath;
}

export function invertPrevAndtoPath(fromPath: Path, toPath: Path) {
  if (isEqual(fromPath, toPath)) {
    return { fromPath, toPath };
  }
  let newPrePath: Path = toPath,
    newtoPath: Path = fromPath;
  if (isSibling(fromPath, toPath)) {
  } else {
    newPrePath = transformPathWhenMove(toPath, fromPath, toPath);
    if (last(newPrePath)) {
      newPrePath = decrement(newPrePath);
    }
    newtoPath = increment(fromPath);
    newtoPath = transformPathWhenMove(newtoPath, fromPath, toPath);
  }
  return { fromPath: newPrePath, toPath: newtoPath };
}

export function transform(
  op: TreeOp,
  otherOp: TreeOp,
  side: Side,
  transformOne: (
    opComponent: TreeOpComponent,
    otherOpComponent: TreeOpComponent,
    side: Side
  ) => TreeOp
): [TreeOp, TreeOp] {
  if (!otherOp.length || !op.length) return [op, otherOp];

  const ops_00_01 = op[0];
  const ops_01_0n = op.slice(1);
  const ops_00_10 = otherOp[0];
  const ops_10_n0 = otherOp.slice(1);
  const invertSide = side === "right" ? "left" : "right";
  const ops_10_11 = transformOne(ops_00_01, ops_00_10, side);
  const ops_01_11 = transformOne(ops_00_10, ops_00_01, invertSide);
  const [ops_11_n1, ops_n0_n1] = transform(
    ops_10_n0,
    ops_10_11,
    invertSide,
    transformOne
  );
  const [ops_0n_1n, ops_11_1n] = transform(
    ops_01_11,
    ops_01_0n,
    invertSide,
    transformOne
  );
  const [ops_n1_nn, ops_1n_nn] = transform(
    ops_11_1n,
    ops_11_n1,
    side,
    transformOne
  );

  return [
    [...ops_n0_n1, ...ops_n1_nn],
    [...ops_0n_1n, ...ops_1n_nn],
  ];
}
