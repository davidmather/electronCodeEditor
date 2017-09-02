var sidebarWidth = 185;

document.getElementById("launch_file_in_chrome").addEventListener("click", function (e) {
    exec('start chrome '+currentfile.replace("C:", "http://localhost:8888"));
});

document.getElementById("launch_file_in_firefox").addEventListener("click", function(e) {
    exec('start firefox '+currentfile.replace("C:", "http://localhost:8888"));
});

document.getElementById("launch_file_in_edge").addEventListener("click", function(e) {
    exec('start microsoft-edge:'+currentfile.replace("C:", "http://localhost:8888"));
});

document.getElementById("toggleFileSelectMenu").addEventListener("click", function(e) {
    if(document.getElementById("sidebar").style.display != "none") {
        document.getElementById("sidebar").style.display = "none";
        document.getElementById("content").style.left = "0px";
        document.getElementById("content").style.width = (window.innerWidth + 16) + "px";
        sidebarWidth = 0;
    } else {
        document.getElementById("sidebar").style.display = "block";
        document.getElementById("content").style.left = "200px";
        document.getElementById("content").style.width = "100%";
        document.getElementById("content").style.width = (window.innerWidth - 185) + "px";
        sidebarWidth = 185;
    }
});

document.getElementById("min-btn").addEventListener("click", function(e) {
    var window = remote.getCurrentWindow();
    window.minimize();
});

document.getElementById("max-btn").addEventListener("click", function(e) {
    var window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
        window.maximize();
    } else {
        window.unmaximize();
    }
});

document.getElementById("close-btn").addEventListener("click", function(e) {
    var window = remote.getCurrentWindow();
    window.close();
});

document.getElementById("exit_button").addEventListener("click", function(e) {
    var window = remote.getCurrentWindow();
    window.close();
});

document.getElementById("open_file").addEventListener("click", function(e) {
    directory = dialog.showOpenDialog({properties: ['openFile']})[0];
    filePath = directory.replace(/^.*[\\\/]/, '');
    directory = directory.replace(filePath,"");
    CodeMirror.modeURL = "node_modules/codemirror/mode/%N/%N.js";
    if (fs.lstatSync(directory + filePath).isDirectory()) {
        directory = directory + filePath + "/";
        document.getElementById("list").innerHTML = "";
        list_files(directory);
    } else {
        fs.readFile(directory + filePath, 'utf8', function(err, data) {
            if (err) {
                return console.log(err);
            }

            var val = filePath,
                m, mode, spec;
            if (m = /.+\.([^.]+)$/.exec(val)) {
                var info = CodeMirror.findModeByExtension(m[1]);
                if (info) {
                    mode = info.mode;
                    spec = info.mime;
                }
            } else if (/\//.test(val)) {
                var info = CodeMirror.findModeByMIME(val);
                if (info) {
                    mode = info.mode;
                    spec = val;
                }
            } else {
                mode = spec = val;
            }

            widgets = [];
            waiting;
            if (mode) {
                console.log(spec);
                myCodeMirror.setOption("mode", spec);
                CodeMirror.autoLoadMode(myCodeMirror, mode);
                console.log(mode);

                if (mode == "javascript") {
                    document.getElementById("content").addEventListener("keyup", runJSHint, false);
                    setTimeout(updateHints, 100);

                } else {
                    document.getElementById("content").removeEventListener("keyup", runJSHint, false);
                    clearTimeout(waiting);
                }
            }
            myCodeMirror.setValue(data);
            currentfile = directory + filePath;
            document.getElementById("currentFileName").innerHTML = filePath;
        });
    }

});

document.getElementById("open_folder").addEventListener("click", function(e) {
    directory =dialog.showOpenDialog({properties: ['openDirectory']})[0].split("\\").join('/')+"/";
	document.getElementById("list").innerHTML = "";
    list_files(directory);
});

document.getElementById("open_dev_tools").addEventListener("click", function(e) {
    remote.getCurrentWindow().toggleDevTools();
});

window.addEventListener("resize", function() {
    document.getElementById("content").setAttribute("style", "width:" + (window.innerWidth - sidebarWidth) + "px");
}, false);

document.getElementById("selectAll").addEventListener("click", function(e){
    myCodeMirror.execCommand("selectAll");
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});

document.getElementById("undo").addEventListener("click", function(e){
    myCodeMirror.execCommand("undo");
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("redo").addEventListener("click", function(e){
    myCodeMirror.execCommand("redo");
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("copy").addEventListener("click", function(e){
   clipboard.writeText(myCodeMirror.getSelection(), 'selection');
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("cut").addEventListener("click", function(e){
   clipboard.writeText(myCodeMirror.getSelection(), 'selection');
   myCodeMirror.replaceRange("",  myCodeMirror.getCursor(true),myCodeMirror.getCursor(false));
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
 document.getElementById("Paste").addEventListener("click", function(e){
   myCodeMirror.replaceRange(clipboard.readText('selection'),  myCodeMirror.getCursor(true),myCodeMirror.getCursor(false));
     for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});

document.getElementById("Select_Line").addEventListener("click", function(e){
    var cursor = myCodeMirror.getCursor();
    myCodeMirror.setSelection({line: cursor.line, ch: 0},{line: cursor.line, ch: cursor.line.length});
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});

document.getElementById("Delete_Line").addEventListener("click", function(e){
    myCodeMirror.execCommand("deleteLine");
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});

document.getElementById("Indent").addEventListener("click", function(e){
    myCodeMirror.execCommand("indentMore");
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});

document.getElementById("Unindent").addEventListener("click", function(e){
    myCodeMirror.execCommand("indentLess");
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});

document.getElementById("find").addEventListener("click", function(e){
    myCodeMirror.execCommand("find");
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});

document.getElementById("findNext").addEventListener("click", function(e){
    myCodeMirror.execCommand("findNext");
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});

document.getElementById("findPrev").addEventListener("click", function(e){
    myCodeMirror.execCommand("findPrev");
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});

document.getElementById("replace").addEventListener("click", function(e){
    myCodeMirror.execCommand("replace");
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});


document.getElementById("replaceAll").addEventListener("click", function(e){
    myCodeMirror.execCommand("replaceAll");
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});


document.getElementById("increase_font_size").addEventListener("click", function(e){
    if(document.getElementById("content").style.fontSize === ""){
        document.getElementById("content").style.fontSize = "18px";
    } else if(document.getElementById("content").style.fontSize != "32px"){
        document.getElementById("content").style.fontSize = (parseInt(document.getElementById("content").style.fontSize,10) + 1) + "px";
    }
    console.log(document.getElementById("content").style.fontSize);
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});

document.getElementById("decrease_font_size").addEventListener("click", function(e){
    if(document.getElementById("content").style.fontSize == ""){
        document.getElementById("content").style.fontSize = "16px";
    } else if(document.getElementById("content").style.fontSize!="3px"){
        document.getElementById("content").style.fontSize = (parseInt(document.getElementById("content").style.fontSize,10) - 1) + "px";
    }

    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});

document.getElementById("restore_font_size").addEventListener("click", function(e){
    document.getElementById("content").style.fontSize = "17px";
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});

document.getElementById("goDocStart").addEventListener("click", function(e){
    myCodeMirror.execCommand("goDocStart");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goDocEnd").addEventListener("click", function(e){
    myCodeMirror.execCommand("goDocEnd");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goLineStart").addEventListener("click", function(e){
    myCodeMirror.execCommand("goLineStart");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goLineStartSmart").addEventListener("click", function(e){
    myCodeMirror.execCommand("goLineStartSmart");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goLineEnd").addEventListener("click", function(e){
    myCodeMirror.execCommand("goLineEnd");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goLineRight").addEventListener("click", function(e){
    myCodeMirror.execCommand("goLineRight");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goLineLeft").addEventListener("click", function(e){
    myCodeMirror.execCommand("goLineLeft");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goLineLeftSmart").addEventListener("click", function(e){
    myCodeMirror.execCommand("goLineLeftSmart");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goLineUp").addEventListener("click", function(e){
    myCodeMirror.execCommand("goLineUp");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goLineDown").addEventListener("click", function(e){
    myCodeMirror.execCommand("goLineDown");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goPageUp").addEventListener("click", function(e){
    myCodeMirror.execCommand("goPageUp");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goPageDown").addEventListener("click", function(e){
    myCodeMirror.execCommand("goPageDown");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goCharLeft").addEventListener("click", function(e){
    myCodeMirror.execCommand("goCharLeft");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goCharRight").addEventListener("click", function(e){
    myCodeMirror.execCommand("goCharRight");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goColumnLeft").addEventListener("click", function(e){
    myCodeMirror.execCommand("goColumnLeft");
    for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goColumnRight").addEventListener("click", function(e){
    myCodeMirror.execCommand("goColumnRight");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goWordLeft").addEventListener("click", function(e){
    myCodeMirror.execCommand("goWordLeft");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goWordRight").addEventListener("click", function(e){
    myCodeMirror.execCommand("goWordRight");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goGroupLeft").addEventListener("click", function(e){
    myCodeMirror.execCommand("goGroupLeft");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});
document.getElementById("goGroupRight").addEventListener("click", function(e){
    myCodeMirror.execCommand("goGroupRight");
            for(var i = 0; i != buttonArray.length; i++){
        document.getElementById(buttonArray[i]).style.display = "none";
    }
});