type employeeNode = {
  name: string;
  designation?:string | undefined;
}

export type TreeNode = {
  value: employeeNode,
  children: TreeNode[],
}

//Reference: https://gist.github.com/mollerjorge/0283ac5f9905f1a3b5b95a7068f9c4d7#file-tree-js
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

  _addNode(value: employeeNode, parentValue?: string) {
    const newNode = { value, children: [] };

    if (this._root === null) {
      this._root = newNode;
      return;
    }

    this._traverse(node => {
      if (node && node.value.name === parentValue) {
        node.children.push(newNode);
      }
    });
  }
}

const ADDITIV_EMPLOYEE_HTTP_ENDPOINT = "http://api.additivasia.io/api/v1/assignment/employees/"

const fetchEmployees = async (tree: Tree, nodeName: string, parentNodeName?: string) => {
  const result = await window.fetch(encodeURI(ADDITIV_EMPLOYEE_HTTP_ENDPOINT + nodeName))
  const data = await result.json()
  const nodeDesignation = data[0]

  const emptyData = Object.keys(data).length === 0
  if (emptyData) return

  const nodeObj = {
    name: nodeName,
    designation: nodeDesignation
  }

  if (!tree._root) {
    tree._addNode(nodeObj)
  } else {
    tree._addNode(nodeObj, parentNodeName)
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

export const fetchEmployeePresent = async (name:string) => {
  const result = await window.fetch(encodeURI(ADDITIV_EMPLOYEE_HTTP_ENDPOINT + name))
  const data = await result.json()

  return data.length > 0
}
