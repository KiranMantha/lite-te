import get from 'lodash/get';
import forEach from 'lodash/forEach';
import kebabCase from 'lodash/kebabCase';
import assign from 'lodash/assign';
import registry from './registerComponent';
import attachDomEvents from './domEvents';

const getHtmlFromVDom = (vdom, parentNode, context) => {
    let isEvent = /^on/;
    let isExpression = /{([^{}]+)}/g;
    let hasBind = /.bind(.*?)/g;
    let match;
    let node;
    let _component = registry.getComponent(vdom.type);
    if (_component && typeof _component === 'function') {
        for (let prop in vdom.props) {
            if (prop !== 'children') {
                let value = vdom.props[prop];
                if (match = isExpression.exec(value)) {
                    let _value = get(context, match[1].trim(), '');
                    vdom.props[prop] = _value;
                }
            }
        }
        let nodeConstructor = new _component(vdom.props);        
        node = document.createElement(kebabCase(nodeConstructor.constructor.name));
        nodeConstructor.parentElement = parentNode;
        nodeConstructor.localName = node.localName;
        assign(node, nodeConstructor);
    } else if (!node) {
        node = document.createElement(vdom.type);
        node._vdom = vdom;
        //Add properties
        for (let prop in vdom.props) {
            if (prop !== 'children') {
                let listener;
                if (prop.match(isEvent)) {
                    if (match = hasBind.exec(vdom.props[prop])) {
                        listener = (new Function('context', `return context.${vdom.props[prop]}`))(context);
                    } else {
                        listener = context[vdom.props[prop]]
                    }
                    node.addEventListener(prop.substring(2), listener, false);
                } else if (match = isExpression.exec(vdom.props[prop])) {
                    let _value = get(context, match[1].trim(), '');
                    vdom.props[prop] = _value;
                    node.setAttribute(prop, vdom.props[prop]);
                } else {
                    node.setAttribute(prop, vdom.props[prop]);
                }
            }
        }

        //Append Children Nodes
        for (let child of vdom.children) {
            if (typeof child === 'string') {
                let found = [];
                while (match = isExpression.exec(child)) {
                    found.push(match[1]);
                }
                if (found.length > 0) {
                    forEach(found, (val) => {
                        let value = get(context, val.trim(), '');
                        let textnode = document.createTextNode(value);
                        node.appendChild(textnode);
                    });
                } else {
                    let textnode = document.createTextNode(child);
                    node.appendChild(textnode);
                }
            } else {
                getHtmlFromVDom(child, node, context);
            }
        }
    }
    attachDomEvents(node);
    if(parentNode.hasOwnProperty('isLiteElement')) {
        document.querySelector(kebabCase(parentNode.constructor.name)).appendChild(node);
    } else {
        parentNode.appendChild(node);
    }
}

export default getHtmlFromVDom;