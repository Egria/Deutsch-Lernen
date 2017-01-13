var jqueryFunction;
$(document).ready(function () {
    //below the xml file wordlist is loaded
    var isIndexPage;

    var srcTree = new ActiveXObject("Msxml2.DOMDocument.6.0");
    srcTree.async = false;
    srcTree.load('Wordlist_11.xml');
    if ($("#Centering").length) {
        isIndexPage = true;
    }
    else {
        isIndexPage = false;
            var url=self.parent.getURL();
    			if(url!=null){
    				var newFileName=url.match("=(.*)");	
		            self.parent.frames["right_frame"].location = 'Wort/' + newFileName[1];				
   			}
    }
    if (!isIndexPage) {
        var xsltTree = new ActiveXObject("Msxml2.DOMDocument.6.0");
        xsltTree.async = false;
        // You can substitute other XSLT file names here.
        xsltTree.load("navigation.xslt");
        self.parent.frames["wordList"].document.getElementById("resTree").innerHTML = srcTree.transformNode(xsltTree);
        //document.getElementById("resTree").innerHTML=srcTree.transformNode(xsltTree);
    }
    var dic = new Array();
    var xmlObj = srcTree.documentElement.childNodes;
    for (j = 0; j < xmlObj.length; j++) {
        var entry = xmlObj.item(j);
        var attr = entry.attributes.item(0).value;
        //var jplus=j+1;//here getAttribute method should be used;
        dic[entry.text] = attr;//jplus.toString();	
    }

    var LastSearchedWord = '';
    $("button").click(function () {
            ChangeContent();
    });
    function ChangeContent() {
        var newFileName = GetAddress();
        if (isIndexPage) {
            self.location = 'FrameSetTest.html?wordAddress='+newFileName;
        }
        else if (newFileName) {
            self.parent.frames["right_frame"].location = 'Wort/' + newFileName;
            self.parent.frames["wordList"].scrollController();
            var st = $("#searchField");//prepend # select id.
            st.focus();
            st.select();
        }
    }

    jqueryFunction = function SearchContent(possibleWord) {
        $("#searchField").val(possibleWord);
        return GetAddress();
    }
    function GetAddress() {
        var hasTheWord = 0;
        var wordform = $("#searchField").val();
        //alert("Location"+wordID);
        for (x in dic) {
            if (x == wordform) {
                hasTheWord = 1;
                break;
            }
        }
        if (hasTheWord == 1) {
            LastSearchedWord = wordform;
            //here call the scrollbar utility function
            return dic[wordform];
        }
        else
            return null;
    }
    $("#searchField").on("focus", function () {
        if ($("#searchField").val()=='Please Type the word you want to search' || (LastSearchedWord != ''))
        { $("#searchField").val(''); }
    });

    $("#searchField").on("blur", function () {
        if ($("#searchField").val()== '') {
            if (LastSearchedWord != '')
                $("#searchField").val(LastSearchedWord);
            else
                $("#searchField").val('Please Type the word you want to search');
        }
    });
    $("#searchField").keypress(function (e) {


        var keynum;
        if (window.event) // IE
        {
            keynum = e.keyCode;
            if (keynum == 13)
                ChangeContent();
        }
    });

     /*   var htmlcontent = "";
        for (x in dic) {
            htmlcontent = htmlcontent + "<option value=\"" + x + "\"></option>";
        }
        $("#Words").html(htmlcontent);
    */
    $("#searchField").on('input', function () {
        var entry = $("#searchField").val();
        if(entry==''){
        $("#Words").html('');
        }
        else{
        addWordToList(entry);
   	  }
    });

        function addWordToList(entry) {
            var htmlcontent = "";
            var c = 0;
            for (x in dic) {
                if (x < entry) {
                    continue;
                }
                htmlcontent = htmlcontent + "<option value=\"" + x + "\"></option>";
                c = c + 1;
                if (c == 5) {
                    break;
                }
            }
            $("#Words").html(htmlcontent);
        }

});
