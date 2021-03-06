// ui functions
ZenPen = window.ZenPen || {};
ZenPen.ui = (function() {

	// Base elements
	var body, article, uiContainer, overlay, aboutButton, descriptionModal, header;

	// Buttons
	var screenSizeElement, colorLayoutElement, targetElement, saveElement;

	// Word Counter
	var wordCountValue, wordCountBox, wordCountElement, wordCounter, wordCounterProgress;
	
	//save support
	var supportsSave, saveFormat, textToWrite;
	
	var expandScreenIcon = '&#xe000;';
	var shrinkScreenIcon = '&#xe004;';

	var darkLayout = false;

	function init() {
		
		supportsSave = !!new Blob()?true:false;
		
		bindElements();

		wordCountActive = false;

		if ( ZenPen.util.supportsHtmlStorage() ) {
			loadState();
		}


		
	    // alert($('header').attr('ctitle'))
		console.log( "Checkin under the hood eh? We've probably got a lot in common. You should totally check out ZenPen on github! (https://github.com/tholman/zenpen)." );
		
		//初始化标签
		updateTags()
		setTimeout(function(){
		updateTotalCount()
		},100)	

		setInterval(function(){
					updateTags()
					setTimeout(function(){
					updateTotalCount()
					},100)
		},500)

		//更新所有
		/*$('.tag').prepend("<div class='tag_d'>"+$('.dec').attr('ctitle')+"</div>")
		$('.tag').prepend("<div class='tag_a'>"+$('.author').attr('ctitle')+"</div>")
		$('.tag').prepend("<div class='tag_h'>"+$('header').attr('ctitle')+"</div>")
		$('.tag .p').append('<li>泡泡1</li>')*/
	}





	// 初始化更新标签
	function updateTags(e) {
		console.log("更新标签")
		
		if($('.header').text().length>=$('.header').data('max')){
			// var str1=$('.header').text().substring(0,$('.header').data('max'))
			setTimeout(function(){
				 // $('.header').text(str1);
				 // $('.header').blur();
				 $('.header').next('.limit').find('.max').text($('.header').data('max'))
				 $('.header').next('.limit').find('.curr').text($('.header').text().length)
			},100)

        }else{
 				$('.header').next('.limit').find('.max').text($('.header').data('max'))
				 $('.header').next('.limit').find('.curr').text($('.header').text().length)        	
        }



		if($('.author').text().length>=$('.author').data('max')){
			// var str2=$('.author').text().substring(0,$('.author').data('max'))
			setTimeout(function(){
				 // $('.author').text(str2);
				 // $('.author').blur();
				 $('.author').next('.limit').find('.max').text($('.author').data('max'))
				 $('.author').next('.limit').find('.curr').text($('.author').text().length)
			},100)

        }else{
 				$('.author').next('.limit').find('.max').text($('.author').data('max'))
				 $('.author').next('.limit').find('.curr').text($('.author').text().length)        	
        }    




		if($('.dec').text().length>=$('.dec').data('max')){
			// var str3=$('.dec').text().substring(0,$('.dec').data('max'))
			setTimeout(function(){
				 // $('.dec').text(str3);
				 // $('.dec').blur();
				 $('.dec').next('.limit').find('.max').text($('.dec').data('max'))
				 $('.dec').next('.limit').find('.curr').text($('.dec').text().length)
			},100)

        }else{
 				$('.dec').next('.limit').find('.max').text($('.dec').data('max'))
				 $('.dec').next('.limit').find('.curr').text($('.dec').text().length)        	
        }   		


		

		$('.article-tags').html('')
		$('article>p').each(function(index, el) {
			var that=$(this)
			var curr=$(this).text().length;
			var maxWord=ZenPen.editor.getmaxWord()
			if(curr>=maxWord){
				/* setTimeout(function(){
				 	that.text(that.text().substring(0,maxWord));
				 },100)*/
				 // curr=maxWord
			}else{

			}
				 	// $('article').focus();


			$('.article-tags').append('<li><span class="t">气泡'+(index+1)+':</span><span class="l"><em class="curr">'+curr+'</em>/<em class="max">'+maxWord+'</em>字</span></li>')
			var p_height=$(this).height()
			$('.article-tags li').eq(index).height(p_height)
		});
		
		
	}



	function loadState() {

		// Activate word counter
		if ( localStorage['wordCount'] && localStorage['wordCount'] !== "0") {			
			wordCountValue = parseInt(localStorage['wordCount']);
			wordCountElement.value = localStorage['wordCount'];
			wordCounter.className = "word-counter active";
			updateWordCount();
		}

		// Activate color switch
		if ( localStorage['darkLayout'] === 'true' ) {
			if ( darkLayout === false ) {
				document.body.className = 'yang';
			} else {
				document.body.className = 'yin';
			}
			darkLayout = !darkLayout;
		}

	}

	function saveState() {

		if ( ZenPen.util.supportsHtmlStorage() ) {
			localStorage[ 'darkLayout' ] = darkLayout;
			localStorage[ 'wordCount' ] = wordCountElement.value;
		}
	}

	function bindElements() {

		// Body element for light/dark styles
		body = document.body;

		uiContainer = document.querySelector( '.ui' );

		// UI element for color flip
		colorLayoutElement = document.querySelector( '.color-flip' );
		colorLayoutElement.onclick = onColorLayoutClick;

		// UI element for full screen		
		screenSizeElement = document.querySelector( '.fullscreen' );
		screenSizeElement.onclick = onScreenSizeClick;

		targetElement = document.querySelector( '.target ');
		targetElement.onclick = onTargetClick;
		
		//init event listeners only if browser can save
		if (supportsSave) {

			saveElement = document.querySelector( '.save' );
			saveElement.onclick = onSaveClick;
			
			var formatSelectors = document.querySelectorAll( '.saveselection span' );
			for( var i in formatSelectors ) {
				formatSelectors[i].onclick = selectFormat;
			}
			
			document.querySelector('.savebutton').onclick = saveText;
		} else {
			document.querySelector('.save.useicons').style.display = "none";
		}

		// Overlay when modals are active
		overlay = document.querySelector( '.overlay' );
		overlay.onclick = onOverlayClick;

		article = document.querySelector( '.content' );
		article.onkeyup = onArticleKeyUp;

		wordCountBox = overlay.querySelector( '.wordcount' );
		wordCountElement = wordCountBox.querySelector( 'input' );
		wordCountElement.onchange = onWordCountChange;
		wordCountElement.onkeyup = onWordCountKeyUp;

		descriptionModal = overlay.querySelector( '.description' );
		
		saveModal = overlay.querySelector('.saveoverlay');

		wordCounter = document.querySelector( '.word-counter' );
		wordCounterProgress = wordCounter.querySelector( '.progress' );

		aboutButton = document.querySelector( '.about' );
		aboutButton.onclick = onAboutButtonClick;

		header = document.querySelector( '.header' );
		header.onkeypress = onHeaderKeyPress;
		header.oninput = onHeaderKeyPress;

		//作者
		// author
		author = document.querySelector( '.author' );
		author.onkeypress = onauthorKeyPress;
		author.onchange = onauthorKeyPress;
		//描述
		// dec
		dec = document.querySelector( '.dec' );
		dec.onkeypress = ondecKeyPress;
		dec.onchange = ondecKeyPress;
	}

	function onScreenSizeClick( event ) {

		screenfull.toggle();
   		if ( screenfull.enabled ) {
			document.addEventListener( screenfull.raw.fullscreenchange, function () {
				if ( screenfull.isFullscreen ) {
					screenSizeElement.innerHTML = shrinkScreenIcon;
				} else {
					screenSizeElement.innerHTML = expandScreenIcon;	
				}
    		});
    	}
	};

	function onColorLayoutClick( event ) {
		if ( darkLayout === false ) {
			document.body.className = 'yang';
		} else {
			document.body.className = 'yin';
		}
		darkLayout = !darkLayout;

		saveState();
	}

	function onTargetClick( event ) {
		overlay.style.display = "block";
		wordCountBox.style.display = "block";
		wordCountElement.focus();
	}

	function onAboutButtonClick( event ) {
		overlay.style.display = "block";
		descriptionModal.style.display = "block";
	}
	
	function onSaveClick( event ) {
		overlay.style.display = "block";
		saveModal.style.display = "block";
	}

	function saveText( event ) {

		if (typeof saveFormat != 'undefined' && saveFormat != '') {
			var blob = new Blob([textToWrite], {type: "text/plain;charset=utf-8"});
			/* remove tabs and line breaks from header */
			var headerText = header.innerHTML.replace(/(\t|\n|\r)/gm,"");
			if (headerText === "") {
			    headerText = "ZenPen";
			}
			saveAs(blob, headerText + '.txt');
		} else {
			document.querySelector('.saveoverlay h1').style.color = '#FC1E1E';
		}
	}
	
	/* Allows the user to press enter to tab from the title */
	function onHeaderKeyPress( event ) {
		if ( event.keyCode === 13 ) {
			event.preventDefault();
			article.focus();
		}
		// alert("sd")
		updateWordCount()
	}
	function onauthorKeyPress( event ) {
		if ( event.keyCode === 13 ) {
			event.preventDefault();
			author.focus();
		}
		updateWordCount()
	}
	function ondecKeyPress( event ) {
		if ( event.keyCode === 13 ) {
			event.preventDefault();
			dec.focus();
		}
		updateWordCount()
	}

	/* Allows the user to press enter to tab from the word count modal */
	//输入文字
	function onWordCountKeyUp( event ) {
		
		
		if ( event.keyCode === 13 ) {
			event.preventDefault();
			
			setWordCount( parseInt(this.value) );

			removeOverlay();

			article.focus();
		}
	}

	function onWordCountChange( event ) {

		setWordCount( parseInt(this.value) );
	}

	//
	function setWordCount( count ) {

		// Set wordcount ui to active
		if ( count > 0) {

			wordCountValue = count;
			wordCounter.className = "word-counter active";
			updateWordCount();

		} else {

			wordCountValue = 0;
			wordCounter.className = "word-counter";
		}
		
		saveState();
	}

	function onArticleKeyUp( event ) {
		if ( wordCountValue > 0 ) {
			updateWordCount();
		}
	}


	//获取指定DOM字数
	function getCount(el){
		var t=0
		// t+=el.childNodes[0].length
		var length = el.childNodes.length;
		for(var i = 0; i < length; i++) {
		    var node = el.childNodes[i];
		    if(node.nodeType != 8) {

				if ( node.nodeType != 1 ) {
				    // Strip white space.
				    t += node.length;
				} else {
				    t += getCount( node );
				}
		    }
		}		
		// console.log(t)
		return t
	}

	//获取全部字数
	function updateTotalCount() {
		TotalCount=0

		// TotalCount=getCount(document.querySelector( ".body" ))
		$('.article-tags em.curr').each(function(index, el) {
			var num=$(this).text()
			if(num!=null){
			TotalCount+=parseInt(num)
			}
		});
		console.log(TotalCount)
		// console.log(wordCount+"字")
		document.querySelector( '.count' ).innerHTML=TotalCount
	}


	//更新文字数
	function updateWordCount() {

		var wordCount = ZenPen.editor.getWordCount();

		var percentageComplete = wordCount / wordCountValue;
		wordCounterProgress.style.height = percentageComplete * 100 + '%';

		document.querySelector( '.header' )
		updateTags()//更新标签
		updateTotalCount()//更新所有


		if ( percentageComplete >= 1 ) {
			wordCounterProgress.className = "progress complete";
		} else {
			wordCounterProgress.className = "progress";
		}
	}

	function selectFormat( e ) {
		
		if ( document.querySelectorAll('span.activesave').length > 0 ) {
			document.querySelector('span.activesave').className = '';
		}
		
		document.querySelector('.saveoverlay h1').style.cssText = '';
		
		var targ;
		if (!e) var e = window.event;
		if (e.target) targ = e.target;
		else if (e.srcElement) targ = e.srcElement;
		
		// defeat Safari bug
		if (targ.nodeType == 3) {
			targ = targ.parentNode;
		}
			
		targ.className ='activesave';
		
		saveFormat = targ.getAttribute('data-format');
		
		var header = document.querySelector('header.header');
		var headerText = header.innerHTML.replace(/(\r\n|\n|\r)/gm,"") + "\n";
		
var author = document.querySelector('.author');
		var authorText = author.innerHTML.replace(/(\r\n|\n|\r)/gm,"") + "\n";		

var dec = document.querySelector('.dec');
		var decText = dec.innerHTML.replace(/(\r\n|\n|\r)/gm,"") + "\n";		

		var body = document.querySelector('article.content');
		var bodyText = body.innerHTML;
			
		textToWrite = formatText(saveFormat,headerText,authorText
,decText,bodyText);
		
		var textArea = document.querySelector('.hiddentextbox');
		textArea.value = textToWrite;
		textArea.focus();
		textArea.select();
saveText( event )
	}


	function formatText( type, header,author,dec,body ) {
		
		var text;
		switch( type ) {

			case 'html':
				header = "<h1>" + header + "</h1>";
				text = header + body;
				text = text.replace(/\t/g, '');
			break;

			case 'markdown':
				header = header.replace(/\t/g, '');
				header = header.replace(/\n$/, '');
				header = "#" + header + "#";
			
				text = body.replace(/\t/g, '');
			
				text = text.replace(/<b>|<\/b>/g,"**")
					.replace(/\r\n+|\r+|\n+|\t+/ig,"")
					.replace(/<i>|<\/i>/g,"_")
					.replace(/<blockquote>/g,"> ")
					.replace(/<\/blockquote>/g,"")
					.replace(/<p>|<\/p>/gi,"\n")
					.replace(/<br>/g,"\n");
				
				var links = text.match(/<a href="(.+)">(.+)<\/a>/gi);
				
                                if (links !== null) {
                                        for ( var i = 0; i<links.length; i++ ) {
                                                var tmpparent = document.createElement('div');
                                                tmpparent.innerHTML = links[i];
                                                
                                                var tmp = tmpparent.firstChild;
                                                
                                                var href = tmp.getAttribute('href');
                                                var linktext = tmp.textContent || tmp.innerText || "";
                                                
                                                text = text.replace(links[i],'['+linktext+']('+href+')');
                                        }
                                }
				
				text = header +"\n\n"+ text;
			break;

			case 'plain':
				header = header.replace(/\t/g, '');
				author = author.replace(/\t/g, '');
				dec = dec.replace(/\t/g, '');
			
				var tmp = document.createElement('div');
				tmp.innerHTML = body;
				text = tmp.textContent || tmp.innerText || "";
				
				text = body
				text = text.replace(/<\/p><p>/g, "\n")


				text = text.replace(/\t/g, '')
					.replace(/<p>/g,"")
					.replace(/<\/p>/g,"")
					.replace(/<br>/g,"")
					.replace(/<\/br>/g,"")
					//.replace(/\n{3}/g,"\n")
					//.replace(/\n/,""); //replace the opening line break
				
				text = "*气泡字数*\n" + $('.count').text()+"\n"+ "\n*气泡数量*\n" + $('.article-tags li').length+"\n"+"\n*文章标题*\n"+header +"\n*作者笔名*\n"+ author +"\n*文章简介*\n"+ dec + "\n*气泡内容*\n"+ text ;
			break;
			default:
			break;
		}
		
		return text;
	}

	function onOverlayClick( event ) {

		if ( event.target.className === "overlay" ) {
			removeOverlay();
		}
	}

	function removeOverlay() {
		
		overlay.style.display = "none";
		wordCountBox.style.display = "none";
		descriptionModal.style.display = "none";
		saveModal.style.display = "none";
		
		if ( document.querySelectorAll('span.activesave' ).length > 0) {
			document.querySelector('span.activesave').className = '';
		}

		saveFormat='';
	}

	return {
		init: init
	}

})();
