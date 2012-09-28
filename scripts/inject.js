function inject(name, callback){
    var s = document.createElement('script');
    s.src = chrome.extension.getURL("scripts/" + name);
    s.onload = callback || function(){};
    (document.head||document.documentElement).appendChild(s);
}

inject("filepicker.js", function(){
    inject("main.js");
});
