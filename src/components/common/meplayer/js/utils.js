function toggleClass(el, className) {
    if (el.classList) {
        el.classList.toggle(className);
    } else {
        const classes = el.className.split(' ');
        const existingIndex = classes.indexOf(className);

        if (existingIndex >= 0) classes.splice(existingIndex, 1);
        else classes.push(className);

        el.className = classes.join(' ');
    }
}

function addClass(el, className) {
    if (el.classList) el.classList.add(className);
    else el.className += ' ' + className;
}

function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);
    else
        el.className = el.className.replace(
            new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'),
            ' '
        );
}

function getAbsLeft(el) {
    let left = el.offsetLeft;
    while (el.offsetParent) {
        el = el.offsetParent;
        left += el.offsetLeft;
    }
    return left;
}

function parseSec(sec) {
    const tempMin = (sec / 60) | 0;
    const tempSec = sec % 60 | 0;
    const curMin = tempMin < 10 ? '0' + tempMin : tempMin;
    const curSec = tempSec < 10 ? '0' + tempSec : tempSec;
    return curMin + ':' + curSec;
}

export { toggleClass, addClass, removeClass, getAbsLeft, parseSec };
