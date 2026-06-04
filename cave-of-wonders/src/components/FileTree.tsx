import { motion } from 'framer-motion';
import type { TreeFile } from '../types';

interface Props {
  files: TreeFile[];
  /** Paths produced by the current phase — highlighted as freshly added. */
  newPaths: string[];
  reducedMotion: boolean;
}

interface TreeNode {
  name: string;
  path: string;
  isFile: boolean;
  children: TreeNode[];
}

/** Build a nested folder/file tree from flat repo-relative paths. */
function buildTree(files: TreeFile[]): TreeNode[] {
  const root: TreeNode = { name: '', path: '', isFile: false, children: [] };
  for (const { path } of files) {
    const parts = path.split('/');
    let node = root;
    parts.forEach((part, i) => {
      const isFile = i === parts.length - 1;
      const childPath = parts.slice(0, i + 1).join('/');
      let child = node.children.find((c) => c.name === part);
      if (!child) {
        child = { name: part, path: childPath, isFile, children: [] };
        node.children.push(child);
      }
      node = child;
    });
  }
  return root.children;
}

function Row({
  node,
  depth,
  newPaths,
  reducedMotion,
}: {
  node: TreeNode;
  depth: number;
  newPaths: string[];
  reducedMotion: boolean;
}) {
  const isNew = node.isFile && newPaths.includes(node.path);
  return (
    <>
      <motion.div
        className={`tree__row${node.isFile ? ' is-file' : ' is-dir'}${isNew ? ' is-new' : ''}`}
        data-testid={node.isFile ? 'tree-file' : undefined}
        style={{ paddingLeft: 8 + depth * 14 }}
        initial={isNew && !reducedMotion ? { opacity: 0, x: -8 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.3 }}
      >
        <span className="tree__icon">{node.isFile ? fileIcon(node.name) : '📁'}</span>
        <span className="tree__name">{node.name}</span>
        {isNew && <span className="tree__badge">✓</span>}
      </motion.div>
      {node.children.map((child) => (
        <Row key={child.path} node={child} depth={depth + 1} newPaths={newPaths} reducedMotion={reducedMotion} />
      ))}
    </>
  );
}

function fileIcon(name: string): string {
  if (name.endsWith('.md')) return '📄';
  if (name.endsWith('.spec.ts') || name.endsWith('.test.ts')) return '🧪';
  return '🟦';
}

/** Cumulative project file tree that grows as phases produce files. */
export default function FileTree({ files, newPaths, reducedMotion }: Props) {
  const tree = buildTree(files);
  return (
    <aside className="tree" data-testid="file-tree">
      <div className="tree__title">EXPLORER</div>
      <div className="tree__root">fridgechef/</div>
      {tree.map((node) => (
        <Row key={node.path} node={node} depth={0} newPaths={newPaths} reducedMotion={reducedMotion} />
      ))}
    </aside>
  );
}
