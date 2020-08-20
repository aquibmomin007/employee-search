export type TreeNode = {
  value: string,
  children: TreeNode[],
}

export class Tree {
  _root: TreeNode | null;

  constructor() {
    this._root = null;
  }

  _traverse(callback: (node: TreeNode) => void) {
    function goThrough(node: TreeNode ) {
      callback(node);
      node.children.forEach(child => goThrough(child));
    }

    if (this._root) {
      goThrough(this._root);
    }
  }


  _addNode(value: string, parentValue?: string) {
    const newNode = { value, children: [] };

    if (this._root === null) {
      this._root = newNode;
      return;
    }

    this._traverse(node => {
      if (node && node.value === parentValue) {
        node.children.push(newNode);
      }
    });
  }
}

const fetchEmployees = (tree: Tree) => async (nodeName: string, parentNodeName?: string) => {
    const result = await window.fetch(encodeURI("http://api.additivasia.io/api/v1/assignment/employees/" + nodeName))
    const data = await result.json()

    if (Object.keys(data).length === 0) {
      return null
    }

    if (!tree._root) {
        tree._addNode(nodeName)
    } else {
        tree._addNode(nodeName, parentNodeName)
    }

    if (!data[1]) {
        return
    } else {
        data[1]["direct-subordinates"].forEach((sub: string) => fetchEmployees(tree)(sub, nodeName))
    }
}

export const fetchEmployeesInOrgChart = async (name: string) => {
  let tree = new Tree()
  await fetchEmployees(tree)(name)
  return tree._root
}
