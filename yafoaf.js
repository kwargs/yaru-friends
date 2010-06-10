
var fcache = {};
var xslt = null;

get_tree = function(url){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send();
  return xhr.responseXML;
}

tree2text = function(xml_doc){
    // WTF: TextSerializer ??? 
    var xmls = new XMLSerializer();
    var xml_str =  xmls.serializeToString(xml_doc);
    // in chrome !!! 
    return xml_str.slice(xml_str.indexOf("<pre>")+5, xml_str.indexOf("</pre>"));
    // in firefox:
    // remove <transformiix:result xmlns:transformiix="http://www.mozilla.org/TransforMiix">
    return xml_str.replace(/^<[^>]+>/, '').replace(/<\/[^>]+>$/, '');
}

load_foaf_data = function(url){
    var foaf = get_tree(url);
    if (xslt == null){
        xslt = new XSLTProcessor(); 
        xslt.importStylesheet(get_tree("foaf2json.xsl"));
    }
    return JSON.parse(tree2text(xslt.transformToDocument(foaf)));
}

function is_group_url(url){
    return /\.xml\?.*clubs=1/.test(url);
}

function url2login(url){
    return url.replace(/http:\/\/(.+)\.ya.ru.*/, '$1');
}

function load_foaf(start_url){
    var urls = [start_url];
    var passed_urls = [];
    var friends = [];
    while (urls.length > 0) {
        /*console.debug('current');
        console.debug(urls);
        console.debug('passed');
        console.debug(passed_urls);*/
        var current_url = urls.pop();
        if ((passed_urls.indexOf(current_url) == -1) && !is_group_url(current_url)){
            var data = load_foaf_data(current_url);
            passed_urls.push(current_url);
            for (var i in data.friends) {
                friends.push(url2login(data.friends[i]));
            }
            if (data.next && data.next.length) {
                urls = urls.concat(data.next);
            }
        }
    }
    return friends;
}

function ya_foaf(username){
    if (fcache[username] == undefined) {
        fcache[username] = load_foaf("http://" + username + ".ya.ru/foaf.xml");
    }
    return fcache[username];
}
