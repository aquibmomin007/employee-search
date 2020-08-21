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

const ADDITIV_EMPLOYEE_HTTP_ENDPOINT = "http://api.additivasia.io/api/v1/assignment/employees/"

const fetchEmployees = async (tree: Tree, nodeName: string, parentNodeName?: string) => {
  const result = await window.fetch(encodeURI(ADDITIV_EMPLOYEE_HTTP_ENDPOINT + nodeName))
  const data = await result.json()

  const emptyData = Object.keys(data).length === 0
  if (emptyData) return

  if (!tree._root) {
    tree._addNode(nodeName)
  } else {
    tree._addNode(nodeName, parentNodeName)
  }

  const list = data[1]
  if (!list || !list['direct-subordinates']) {
    return
  }
  
  const subordinates: string[] = list["direct-subordinates"]
  for (let i = 0; i < subordinates.length; i += 1) {
    await fetchEmployees(tree, subordinates[i], nodeName)
  }
}

export const fetchEmployeesInOrgChart = async (name: string) => {
  let tree = new Tree()
  await fetchEmployees(tree, name)
  return tree._root
}
