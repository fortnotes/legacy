/**
 * Helper functions
 */

var sjcl = require('./sjcl.min');


// array prototypes
Array.prototype.has = function ( value ) {
    return this.indexOf(value) >= 0;
};
// Array.prototype.empty = function () {
//     return !(this.length > 0);
// };
// Array.prototype.each = function ( func ) {
//     var i, l = this.length;
//
//     for ( i = 0; i < l; i++ ) {
//         func(this[i], i);
//     }
// };
// IE compatibility
// if ( !Array.indexOf ) {
//     Array.prototype.indexOf = function ( obj, start ) {
//         var i;
//         for ( i = (start || 0); i < this.length; i++ ) {
//             if ( this[i] === obj ) { return i; }
//         }
//         return -1;
//     };
// }

// string prototypes
// String.prototype.trim = function() {
//    return this.replace(/^\s+|\s+$/g,"");
// };
// String.prototype.ltrim = function() {
//    return this.replace(/^\s+/g,"");
// };
// String.prototype.rtrim = function () {
//     return this.replace(/\s+$/g, '');
// };


/**
 * Firebug debug compatible with IE
 * free list of params
 */
// function fb () {
//     if ( window.console && window.console.info )
//         // send all arguments to firebug
//         console.info(arguments.length == 1 ? arguments[0] : arguments);
//
// }


/**
 * Moves focus to the given html element on enter key pressed
 * @param src object to track
 * @param dest given html element to jump to
 */
// window.onEnterFocus = function onEnterFocus ( src, dest ) {
//     src.onkeypress = function ( event ) {
//         if ( event.keyCode || event.keyCode ) {
//             if ( (event.keyCode === 13) || (event.keyCode === 13) ) {
//                 dest.focus();
//
//                 return false;
//             }
//         }
//
//         return true;
//     };
// };


/**
 * Clicks the given html element on enter key pressed
 * @param src object to track
 * @param dest given html element to click to
 */
window.onEnterClick = function onEnterClick ( src, dest ) {
    src.addEventListener('keydown', function ( event ) {
        if ( event.keyCode === 13 ) {
            //dest.focus();
            dest.click();
        }
    });
};


/**
 * New link type to select value from the set
 * @param obj html element to expand
 * @param data list of values and titles like {300:{title:'5 minutes',next:1200}, 1200:{title:'20 minutes',next:300}}
 * @param id default value to select
 */
// function LinkSet ( obj, data, id ) {
//     if ( !obj ) return;
//
//     this.obj  = obj;
//     this.data = data;
//
//     /**
//      * Set currect value and title from the data
//      * @param id to select
//      */
//     this.ItemSelect = function ( id ) {
//         // if somebody alredy have 1 munute (probably should be removed in the future)
//         if ( id == 60 ) data[60] = {next:300,  title: '1 minute'};
//         // check input
//         if ( id && data && data[id] ) {
//             // set value and html
//             this.obj.value = id;
//             this.obj.innerHTML = data[id].title;
//             var pthis = this;
//             // set onclick handler and pass this object pointer for future selection
//             this.obj.onclick = function(){
//                 pthis.ItemSelect(data[id].next);
//             };
//         }
//     };
//
//     // do the default selection
//     this.ItemSelect(id);
// }


/**
 * Adds the given value to the obj as a child recursively
 * @param obj DOMElement to be appended
 * @param value data to add (simple text values, DOMElements, array of DOMElements)
 * @return DOMElement owner of all added data
 * @example elchild(mydiv, 'Hello world'); // simple text value
 * @example elchild(mydiv, someotherdiv); // DOMElement
 * @example elchild(mydiv, [div1, div2, div3]); // DOMElement list
 * @example elchild(mydiv, [div1, 'hello', 'world']); // combined case
 */
window.elchild = function elchild ( obj, value ) {
    // check input
    if ( obj && value ) {
        // DOMElement
        if ( value.nodeType ) {
            obj.appendChild(value);
        } else if ( value instanceof Array ) {
            // array of DOMElements of simple values
            for ( var i = 0; i < value.length; i++ ) {
                elchild(obj, value[i]);
            }
        } else {
            // simple values
            obj.appendChild(document.createTextNode(value));
        }
    }

    return obj;
};


/**
 * Removes all child elements from the given object
 * @param obj DOMElement to be updated
 * @return DOMElement cleared
 */
window.elclear = function elclear ( obj ) {
    if ( obj && obj.hasChildNodes() ) {
        while ( obj.hasChildNodes() ) {
            obj.removeChild(obj.firstChild);
        }
    }

    return obj;
};


/**
 * Assigns a list of attribute values to the given object
 * @param obj DOMElement
 * @param attr list of attributes with values
 * @return DOMElement the same as the given one
 * @example elattr(myimg, {src:'face.png', className:'main'});
 */
window.elattr = function elattr ( obj, attr ) {
    // check if DOMElement
    if ( obj && obj.nodeType && attr && attr instanceof Object ) {
        for ( var akey in attr ) {
            obj[akey] = attr[akey];
        }
    }

    return obj;
};


/**
 * Creates a DOMElement with given options
 * @param name html element name (a, img, div, ...)
 * @param attr list of attributes with values
 * @param [data] inner html value
 * @param [handlers] list of DOMElement event handlers (onclick, onload, ...)
 * @return {Node}
 * @example element('link', {rel:'stylesheet', type:'text/css', href:'http://some.url/'});
 */
window.element = function element ( name, attr, data, handlers ) {
    var tag = document.createElement(name);

    elattr(tag, attr);
    elchild(tag, data);

    // set all handlers
    if ( handlers && handlers instanceof Object ) {
        for ( var handler in handlers ) {
            tag[handler] = handlers[handler];
        }
    }

    return tag;
};


window.table = function table ( rows, cols, attr, handlers ) {
    var el = element('table', attr, null, handlers);

    for ( var i = 0; i < rows; i++ ) {
        el.insertRow(-1);
        for ( var j = 0; j < cols; j++ ) {
            el.rows[i].insertCell(-1);
        }
    }

    return el;
};


window.tblrow = function tblrow ( obj, cells, attrs ) {
    var row = obj.insertRow(-1);

    for ( var i = 0; i < cells.length; i++ ) {
        row.insertCell(-1);
        elchild(row.cells[i], cells[i]);
        elattr(row.cells[i], attrs[i]);
    }

    return obj;
};


/**
 * converts date from timestamp to simple date string
 * 1209589200 -> 2012.02.03 00:23
 * @return {String}
 */
window.TimestampToDateStr = function TimestampToDateStr ( tstamp ) {
    var theDate = tstamp ? new Date(tstamp * 1000) : new Date();
    var nyear = theDate.getFullYear();
    var nmonth = theDate.getMonth() + 1;
    var nday = theDate.getDate();
    var hour = theDate.getHours();
    var min = theDate.getMinutes();

    if ( nmonth < 10 ) nmonth = '0' + nmonth;
    if ( nday < 10 ) nday = '0' + nday;
    if ( hour < 10 ) hour = '0' + hour;
    if ( min < 10 ) min = '0' + min;

    return nyear + '.' + nmonth + '.' + nday + ' ' + hour + ':' + min;
};


// function time_data ( timestamp ) {
//     var dt = new Date(timestamp * 1000);
//     var dl = {y:dt.getFullYear(), m:dt.getMonth()+1, d:dt.getDate(), h:dt.getHours(), i:dt.getMinutes()};
//     // extend with zero where necessary
//     if ( dl.m < 10 ) dl.m = '0' + dl.m;
//     if ( dl.d < 10 ) dl.d = '0' + dl.d;
//     if ( dl.h < 10 ) dl.h = '0' + dl.h;
//     if ( dl.i < 10 ) dl.i = '0' + dl.i;
//     return dl;
// }


/**
 * Password generator with SJCL entropy mechanism
 * @param {Number} length size of the result password
 * @return {String}
 */
window.pwdgen = function pwdgen ( length ) {
    var charset = 'abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&{}()[]=+?*<>;,.:-_',
        letters = [], letter, result = '';

    while ( result.length < length ) {
        letter = null;
        // generate a char
        if ( sjcl.random.isReady() ) {
            // get
            letter = String.fromCharCode(parseInt(sjcl.codec.hex.fromBits(sjcl.random.randomWords(1)).substr(0, 2), 16));
            // invalidate if not in dictionary
            if ( charset.indexOf(letter) === -1 ) letter = null;
        } else {
            letter = charset.charAt(Math.floor(Math.random() * charset.length));
        }
        // something is found
        if ( letter ) {
            // check if not a duplicate
            if ( letters.indexOf(letter.toLowerCase()) < 0 ) {
                // fill already used chars list
                letters.push(letter.toLowerCase());
                // fill the result
                result += letter;
            }
        }
    }
    return result;
};


/**
 * Ajax cross-domain request helper
 * @param url link to external resource
 */
// function jsonp ( url ) {
//     // create element and get data to callback
//     var script = element('script', {type:'text/javascript', src:url});
//     // insert to DOM
//     document.body.appendChild(script);
//     // clear after data processed in 5 secs
//     setTimeout(function(){
//         console.log('jsonp script tag clearing');
//         document.body.removeChild(script);
//     }, 10000);
// }


/**
 * Set input watermark hint
 * @param obj html element
 * @param text string hint
 * @param cin string color
 */
// function watermark ( obj, text, cin ) {
//     $(obj)
//         .focus(function(){
//             if ( this.value == text ) $(this).val('').css({color:cin});
//         })
//         .focusout(function(){
//             if ( !this.value ) $(this).val(text).css({color:''});
//         });
// }
