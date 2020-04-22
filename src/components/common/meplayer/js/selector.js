/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * 元素选择器辅助工具模块
 * init  : 设定容器
 * select: 传入选择器则返回元素，传入选择器数组则返回对应的元素数组
 * $     : 辅助功能，使得无论传入选择器字符串还是元素本身，都能返回正确的元素
 */

let container;

function init(element) {
    container = $(element);
    return this;
}

function select(element) {
    let result;
    if (Array.isArray(element)) {
        const tempResults = [];
        for (const value of element) {
            tempResults.push($(value, container));
        }
        result = tempResults;
    } else {
        result = $(element, container);
    }
    return result;
}

function $(element, context) {
    let result;
    context = context || document;
    if (typeof element === 'string') {
        result = context.querySelector(element);
    } else if (element.toString().includes('HTMLDivElement')) {
        result = element;
    }

    return result;
}

export { init, select, $ };
