export default class JCLib {
    
    static getNodeByPath(rootNode: cc.Node, childPath: string): cc.Node {
        let childNames = [];
        if (childPath && childPath.length > 0) {
            childNames = childPath.split("/");
        }
        let currentNode = rootNode;
        for (let childName of childNames) {
            currentNode = currentNode.getChildByName(childName);
        }
        return currentNode;
    }

    static getComponentByPath<T extends cc.Component>(rootNode: cc.Node, childPath: string, type: {prototype: T}): T {
        return this.getNodeByPath(rootNode, childPath).getComponent(type);
    }
}
