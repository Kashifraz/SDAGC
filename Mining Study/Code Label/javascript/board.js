let hidePost = {}

function toggleHide(hideshow, threadposts, responses) {
    const hideButton = document.getElementById(hideshow);
    const threadAll = document.getElementById(threadposts);
    if (!hideButton) throw new Error("Hide Button not found")
    if (!threadAll) throw new Error("Post not found")
    if (typeof hidePost[threadposts] == "undefined") {
        hidePost[threadposts] = true;
    }
    hidePost[threadposts] = !hidePost[threadposts];
    hideButton.innerText = (hidePost[threadposts]) ? responses[1] : responses[0];
    threadAll.hidden = (!hidePost[threadposts])
}

function toggleCreation() {
    const startThread = document.getElementById("startThreadText");
    const creationForm = document.getElementById("creation-form")
    if (!startThread) throw new Error("Text not found")
    if (!creationForm) throw new Error("Creation Form not found")
    startThread.style.display = "none";
    creationForm.hidden = false;
}

function escapeHTML(str){
    return new Option(str).innerHTML;
}

// totally not copied from khajiit
function parseMarkdown(msg) { // https://www.bigomega.dev/markdown-parser/
    // Parse messages with markdown, and return the HTML
    // This is a modified version of the one from https://www.bigomega.dev/markdown-parser/
    // You can use ** for bold, _ for italic, and ` for code
    let messages = msg.split(" ")
    let htmlText = messages.map(msg => msg
        .replace(/\&gt;\&gt;\&gt;(.*)/gim, '<a href="jfe<oiwfjoiewfnodfndofnmaidswoifdfshicujewcic$1sussfykakrtkrtkawreoifwfjkarting">FEWNUIFEWHFIUWENIFUN&gt;WEFSUSUSUSUSUSUSUSFUW&gt;EFUEWIFWEFJSDFNZXJNDZXKJSUSSYYTHATSABITSUS$1</a>')
        .replace(/\&gt;\&gt;(.*)/gim, '<a href="#post-:specialnyacosodaofferat<><>today!alsohikart!!$1">&gt;&gt;$1</a>')).join(" ")


    //htmlText = htmlText.replaceAll(/^\|\|(.*?)\|\|/gim, '<span class="spoiler">$1</span>')
    htmlText = htmlText.replaceAll(/\|\|(.*?)\|\|/gim, '<span class="spoiler">$1</span>')
    
    return htmlText.trim();


    /*
    let messages = msg.split("")
    const htmlText = messages.map(msg => msg
        .replace(/^\|\|(.*)\|\|$/gim, '<span class="spoiler">$1</span>')
        .replace(/\&gt;\&gt;(.*)/gim, '<a href="#post-:specialnyacosodaofferat<><>today!alsohikart!!$1">&gt;&gt;$1</a>')).join(" ")
    return htmlText.trim()*/

    
}

function boardinit(boardpage) {
const title = document.getElementById("title");
if (!title) throw new Error("Title not found");

console.log("hello world!")


function directReplyPost(e, postID) {
    e=e||event; // IE sucks

    var target = e.target||e.srcElement; // and sucks again

    // target is the element that has been clicked
    if (target && target.className=='remove') 
    {
        target.parentNode.parentNode.removeChild(target.parentNode);
        return false; // stop event from bubbling elsewhere
    }

    toggleCreation();
    const form = document.getElementById("createPost");
    window.scrollTo(0, form.offsetTop);
    form.hidden = false;
    document.getElementById("generally-subject").hidden = true;
    document.getElementById("post-comment").value = `>>${postID}`;
    document.getElementById("isReply").value = true;
    document.getElementById("replyTo").value = postID;
}

// Board Data stuff, will get it through axios request thikng
async function init(name) {
    const createPost = document.getElementById("createPost");
    if (createPost) {
        const urlCheck = document.getElementById("post-url")
        const imgPreview = document.getElementById("imgpreviewchange")
        urlCheck.onchange = function () {
            if (urlCheck.value.length && (urlCheck.value.startsWith("http://") || urlCheck.value.startsWith("https://"))) {
                //imgPreview.src = `${URL}/external?url=${encodeURIComponent(urlCheck.value)}`;;
		// too much requests loll glitch doesnt like that
		imgPreview.src = `https://external-content.duckduckgo.com/iu/?u=${encodeURIComponent(urlCheck.value)}`
		// yeah i think duckduckgo wont mind that too much
            }
        }

        const sortingOption = document.getElementById("sorting-option");
        if (sortingOption) {
            const url = new URI(window.location);
            let sortingA = null;
            if (url.search != "" && url.searchParams.has("filter")) {
                sortingA = url.searchParams.get("filter");
            }
            if (sortingA != null) {
                sortingOption.value = sortingA;
            }
            sortingOption.onchange = function () {
                const sorting = sortingOption.value;
                // Add a ?sorting=sorting to the end of the existing url using window.location
                const url = new URI(window.location);
                url.searchParams.set("filter", sorting);
                window.location = url;
            }
        }

        createPost.addEventListener('submit', async event => {
            event.preventDefault();
            const errorText = document.getElementById("errorText");
            const subject = document.getElementById("post-subject").value;
            const comment = document.getElementById("post-comment").value;
            const spoiler = document.getElementById("post-spoiler").checked;
            const isReply = document.getElementById("isReply").value;
            const replyTo = document.getElementById("replyTo").value;
            
            const file = document.getElementById("post-url").value;
            try {
                const session = localStorage.getItem("kartissus")
                const response = await axios({
                    url: `${URL}/boards/${(isReply == "false") ? name : `${parseInt(replyTo)}/post`}`,
                    method: "POST",
                    headers: {
                        "authorization": session
                    },
                    data: {
                        subject,
                        content: comment,
                        file,
                        board: name,
                        spoiler: (spoiler) ? 1 : 0,
                    }
                });
                if (response.status === 200) window.location.reload();
            } catch (error) {
                console.error(error);
                errorText.innerText = error.response.data;
            }
        })
    }


    const mainBoard = document.getElementById("board");
    const openBoard = document.getElementById("boardopened");
    if (!mainBoard) throw alert("G O N E") // finally racism is solved (wait what)
    if (!openBoard) throw alert("I M  I N S I D E  Y O U R  W A L L S")
    
    try {
        const session = localStorage.getItem("kartissus")
        // Check if the URL has a ?filter query parameter
        const url = new URI(window.location);
        let sorting = null;
        if (url.search != "" && url.searchParams.has("filter")) {
            sorting = url.searchParams.get("filter");
        }

        const req = await axios({
            url: `${URL}/boards/${name}?page=1&filter=${(sorting != null) ? sorting : "newest"}`,
            method: "GET",
            headers: {
                "authorization": session
            }
        });
        const board = req.data;
        /*
const board = {
    name: "/gen/",
    threads: [{
        id: 1, // also thread ID as well
        user: {
            name: "Anonymous",
            id: "c0p3Am41d"
        },
        date: "12/03/2022 19:44",
        content: ">be me",
        file: null,
        replies: [{
            id: 2,
            user: {
                name: "Anonymous",
                id: "c0p3Am42d"
            },
            date: "12/03/2022 20:45",
            content: ">be me\ni dont know if this was a good idea or a bad one\n||this is a spoiler",
            file: null
        }, {
            id: 3,
            user: {
                name: "Anonymous",
                id: "c0p3Am42d"
            },
            date: "12/04/2022 00:64",
            content: ">be me\n>>nyaco.tk frontend dev\n>start work on the frontend\n>things are going good\n>wait\n>this is just the front page\n>yeshoney.jpg\ni dont know if this was a good idea or a bad one",
            file: "https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg"
        }]
    }]
}*/
        function createThreadDiv(thread, threadID) {
            // we do a LIL too much trolling
            const threadDiv = document.createElement("div");
            threadDiv.classList.add("thread");
            // Button
            const hideShowButton = document.createElement("button");
            hideShowButton.id = `hideshow-${thread.id}`;
 
            hideShowButton.classList.add("hideshow");
            //hideShowButton.innerText = "hide";
            hideShowButton.innerText = "go back to board";
            hideShowButton.hidden = true;
        
            // Posts div
            const postsDiv = document.createElement("div");
            postsDiv.id = 'thread-posts-' + thread.id;
        
            threadDiv.appendChild(hideShowButton);

            // posts
            const postDiv = generatePost(thread, false);
            //threadDiv.appendChild(postDiv);
            postsDiv.appendChild(postDiv);

            const fewReplies = document.createElement("div");
            const mostReplies = document.createElement("div");

            let previewReplies = thread.replies;
            const allReplies = JSON.parse(JSON.stringify(thread.replies)) // js i cant;
            if (previewReplies.length > 5 && !threadID) {
                // Offset the replies based on the recent reply, for example, if the most recent reply is at index 6, we do not show the first index
                // If the most recent reply is at index 7, we do not show the second index
                // If the most recent reply is at index 8, we do not show the third index
                // If the most recent reply is at index 9, we do not show the fourth index
                // etc...
                // Use splice and use a for loop to do this
                // Have the index be at the end of the array
                previewReplies = previewReplies.slice(thread.replies.length - 5, thread.replies.length);
                
                // really github copilot, it took you this many comments to figure that out, just wow
            }

            previewReplies.forEach(reply => {
                const replyDiv = generatePost(reply, true, previewReplies.indexOf(reply));
                const index = previewReplies.indexOf(reply);
                if (index < 5) fewReplies.appendChild(replyDiv);
            })

            allReplies.forEach(reply => {
                const replyDiv = generatePost(reply, true, allReplies.indexOf(reply));
                //replyDiv.style.clear = "left"

                //else mostReplies.appendChild(replyDiv);
                mostReplies.appendChild(replyDiv);
                
                //threadDiv.appendChild(replyDiv);
            })
            mostReplies.id = `reply-more-${thread.id}`;
            //const hideShowReplies = document.createElement("button");
            //hideShowReplies.id = `hs-replies-${thread.id}`;
            const openThreadText = document.createElement("span");
            const hideShowReplies = document.createElement("a");
            mostReplies.hidden = true;
            hidePost[`reply-more-${thread.id}`] = false;
            openThreadText.classList.add("hideshow");
            hideShowReplies.innerText = "open thread"
            hideShowReplies.href = `#thread-${thread.id}`
            openThreadText.style.position = "relative";
            openThreadText.style.bottom = "0.5rem";
            hideShowReplies.hidden = false
            if (thread.replies.length > 5) {
                // Create a span with the text "x reply(ies) omitted, hideShowReplies to view", replacing hideShowReplies with the hideShowReplies element
                openThreadText.innerText = `${thread.replies.length - 5} repl${(thread.replies.length > 6) ? "ies" : "y"} omitted, `;

                openThreadText.appendChild(hideShowReplies);
                openThreadText.appendChild(document.createTextNode(" to view"));
                
                
            } else {
                openThreadText.appendChild(hideShowReplies)
            }
            postsDiv.appendChild(openThreadText);
            postsDiv.appendChild(document.createElement("br"));
            if (thread.replies.length) {
                postsDiv.appendChild(fewReplies);
                postsDiv.appendChild(mostReplies);
            }
            threadDiv.appendChild(postsDiv);
            threadDiv.appendChild(document.createElement("hr"));
            
            mainBoard.appendChild(threadDiv);
/*
hideShowButton.onclick = function () {
                ///toggleHide(`hideshow-${thread.id}`, `thread-posts-${thread.id}`, ["show", "hide"]);
                // Show mainBoard again and remove all HTML from openBoard
                mainBoard.hidden = false;
                openBoard.hidden = true;

                hideShowButton.hidden = true;
                hideShowReplies.hidden = false;

                // Move all children of openBoard to mainBoard
                while (openBoard.firstChild) {
                    mainBoard.appendChild(openBoard.firstChild);
                }

                // Remove all children of openBoard
                while (openBoard.firstChild) {
                    openBoard.removeChild(openBoard.firstChild);
                }


                // Move thread to mainBoard
                //const thread = document.querySelector('.thread')
                //mainBoard.insertBefore(openBoard, mainBoard.firstChild);
                //openBoard.innerHTML = "";
            };
*/

            function showThread() {
                const startThreadText = document.getElementById("startThreadText");
                if (startThreadText) {
                    startThreadText.innerHTML = "<span><a><b>[reply to thread]</b></a></span>";
                    document.getElementById("generally-subject").hidden = true;
                    document.getElementById("post-comment").value = `>>${thread.id}`;
                    document.getElementById("isReply").value = true;
                    document.getElementById("replyTo").value = thread.id;
                }
                //toggleHide(`hs-replies-${thread.id}`, `reply-more-${thread.id}`, ["show all comments", "hide fewer comments"]);
                // hide mainBoard
                mainBoard.hidden = true;
                openBoard.hidden = false;
                // append threadDiv to openBoard
                hideShowButton.hidden = false;
                hideShowReplies.hidden = true;
                fewReplies.hidden = true;
                mostReplies.hidden = false;
                // Create a clone of threadDiv with the button events and all, then append it to openBoard
                const threadDivClone = threadDiv.cloneNode(true);
                threadDivClone.childNodes[0].onclick = function () {
                    ///toggleHide(`hideshow-${thread.id}`, `thread-posts-${thread.id}`, ["show", "hide"]);
                    // Show mainBoard again and remove all HTML from openBoard
                    mainBoard.hidden = false;
                    openBoard.hidden = true;

                    hideShowButton.hidden = true;
                    hideShowReplies.hidden = false;
                    fewReplies.hidden = false;
                    mostReplies.hidden = true;
                    // Remove all children of openBoard
                    while (openBoard.firstChild) {
                        openBoard.removeChild(openBoard.firstChild);
                    }
                    history.pushState("", document.title, window.location.pathname);
                    startThreadText.innerHTML = "<span><a><b>[start thread]</b></a></span>";
                    document.getElementById("generally-subject").hidden = false;
                    document.getElementById("post-comment").value = "";
                    document.getElementById("isReply").value = false;
                    document.getElementById("replyTo").value = -1;
                }

                openBoard.appendChild(threadDivClone);
                const replyButtons = threadDivClone.querySelectorAll('[id^="_clickableID-"]');
                replyButtons.forEach(button => {
                    const postID = button.id.split("-")[1];
                    button.onclick = (e) => directReplyPost(e, postID);
                })
                
                //mainBoard.innerHTML = ""
            }
            hideShowReplies.onclick = showThread;
            if (thread.id == threadID) showThread();

            /*
        <div class="thread">
                    <button id="hideshow" onClick="toggleHide('thread-posts-somerandomid');" class="hideshow">hide</button>
                    <div id="thread-posts-somerandomid">
                        <div class="thread-info" hidden>File: <a href="https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg">https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg</a> (33.2KB, 591x512)</div>
                        <div class="thread-file"><img src="https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg" width="160" hidden></div>
                        <div class="thread-contents">
                            <div class="thread-op-info"><b>nyaco.tk <span style="color:green;">Anonymous</span></b> c0p3&m41d | <a href="">1</a> (12/03/2022 19:44) <a>[reply]</a></div>
                            <div class="thread-text">
                                <p>
                                    <font style="color:purple;">
                                        &gt;be me<br>
                                    </font>
                                </p>
                                <button>show all comments</button>
                            </div>
                        </div>
                        <div class="thread-reply">
                            <div class="thread-reply-contents">
                                <div class="thread-info" hidden>File: <a href="https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg">https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg</a> (33.2KB, 591x512)</div>
                                <div class="thread-file" hidden><img src="https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg" width="160" hidden></div>
                                <div class="thread-contents">
                                    <div class="thread-op-info"><b><span style="color:green;">Anonymous</span></b> c0p3&m41d | <a href="">2</a> (12/03/2022 19:44)</div>
                                    <div class="thread-text">
                                        <p>
                                            <font style="color:purple;">
                                                &gt;be me<br>
                                            </font>
                                            i dont know if this was a good idea or a bad one<br>
                                            <span class="spoiler">this is a spoiler</span><br>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="thread-reply" style="clear:left;">
                            <div class="thread-reply-contents">
                                <div class="thread-info" >File: <a href="https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg">https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg</a> (33.2KB, 591x512)</div>
                                <div class="thread-file"><img src="https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg" width="160" ></div>
                                <div class="thread-contents">
                                    <div class="thread-op-info"><b><span style="color:green;">Anonymous</span></b> c0p3&m41d | <a href="">3</a> (12/03/2022 19:44)</div>
                                    <div class="thread-text">
                                        <p>
                                            <font style="color:purple;">
                                                &gt;be me<br>
                                                &gt;nyaco.tk frontend dev<br>
                                                &gt;start work on the frontend<br>
                                                &gt;things are going good<br>
                                                &gt;wait<br>
                                                &gt;this is just the front page<br>
                                                &gt;yeshoney.jpg<br>
                                            </font>
                                            i dont know if this was a good idea or a bad one<br>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            */
        }
        let specificThread = null;
        if (window.location.hash.startsWith("#thread-")) {
            const threadId = parseInt(window.location.hash.split("-")[1]);
            const thread = board.threads.find(thread => thread.id == threadId);
            if (!thread) {
                alert("I AM INSIDE YOUR WALLS.")
                window.location.href = `/${boardpage}`;
                return;
            }
            specificThread = threadId;
            const sorting = document.getElementById("sorting");
            if (sorting) sorting.hidden = true;
        }
        board.threads.forEach(thread => createThreadDiv(thread, specificThread != null && specificThread));
        
        //mainBoard.appendChild(document.createElement("hr"))
    } catch (error) {
        if (error.response && error.response.status === 401) {
            window.location.href = "/";
        }
        console.log(error);
    }
}

init(boardpage);

function generatePost(post, isReply, index) {
    /*
<div class="thread-info" hidden>File: <a href="https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg">https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg</a> (33.2KB, 591x512)</div>
						<div class="thread-file" hidden><img src="https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg" width="160" hidden></div>
						<div class="thread-contents">
							<div class="thread-op-info"><b><span style="color:green;">Anonymous</span></b> c0p3&m41d | <a href="">2</a> (12/03/2022 19:44)</div>
							<div class="thread-text">
								<p>
									<font style="color:purple;">
										&gt;be me<br>
									</font>
									i dont know if this was a good idea or a bad one<br>
									<span class="spoiler">this is a spoiler</span><br>
								</p>
							</div>
						</div>
    */
    const div = document.createElement("div");
    if (isReply) {
        div.classList.add("thread-reply")
        if (index == 0) {
            div.style.float = "inherit";
            div.style.display = "table";
            
        } else {
            div.style.clear = "left"
        }
    }
    
    if (post.file != null) {
        const img = document.createElement("img");
        if (post.spoiler) img.classList.add("spoiler");
        //img.src = `${URL}/external?url=${encodeURIComponent(post.file)}`;
        img.src = `https://external-content.duckduckgo.com/iu/?u=${encodeURIComponent(post.file)}`
	    if (["https://cdn.upload.systems","https://i.upload.systems"].filter(x=>post.file.startsWith(x)).length) {
            img.src = post.file;
        }
        img.loading = "lazy"; // performance gain
        img.alt = "Image Loading...";
        const { width, height } = {
            width: img.naturalWidth,
            height: img.naturalHeight
        };
        img.onerror = function () {
            img.hidden = true;
        };
        img.width = 160
        img.resetImage = false;
        img.onclick = function () {
            img.resetImage = !img.resetImage;
            if (!img.resetImage) img.width = img.naturalWidth; else img.width = 160;
            // Reset the width to the original
        }
          

        const threadInfo = document.createElement("div");
        threadInfo.classList.add("thread-info");
        const t1 = document.createElement("span");
        t1.innerText = "File: ";
        const t2 = document.createElement("span");
        t2.innerText = ` (${width}x${height})`;
        const link = document.createElement("a");
        link.href = post.file;
        link.innerText = (post.file && post.file.length) && (post.file.length > 142) ? post.file.substring(0, 142) + "..." : post.file;
        threadInfo.appendChild(t1);
        threadInfo.appendChild(link);
        threadInfo.appendChild(t2);
        div.appendChild(threadInfo)

        const threadFile = document.createElement("div");
        threadFile.classList.add("thread-file");
        threadFile.appendChild(img);
        div.appendChild(threadFile);
    }
    const threadContents = document.createElement("div");
    threadContents.classList.add("thread-contents");

    const opInfo = document.createElement("div");
    opInfo.classList.add("thread-op-info");
    const b1 = document.createElement("b");
    const span0 = document.createElement("span");
    span0.innerText = post.title + " ";
    const span1 = document.createElement("span");
    span1.style.color = "aqua";
    span1.innerText = post.user.name;
    b1.appendChild(span0);
    b1.appendChild(span1);

    opInfo.appendChild(b1);

    const id = document.createElement("span");
    id.style = "thread-op-tag"
    id.innerText = ` ${post.user.id} `;

    opInfo.appendChild(id);

    const clickableID = document.createElement("a");
    clickableID.innerText = `${post.id}${isReply ? " (reply)" : ""}`;
    //clickableID.href="#createPost"
    clickableID.id = `_clickableID-${post.id}-${Math.random()}`;
    clickableID.onclick = function() {
        toggleCreation();
        const form = document.getElementById("createPost");
        window.scrollTo(0, form.offsetTop);
        form.hidden = false;
        document.getElementById("generally-subject").hidden = true;
        document.getElementById("post-comment").value = `>>${post.id}`;
        document.getElementById("isReply").value = true;
        document.getElementById("replyTo").value = post.id;
    }

    opInfo.appendChild(clickableID);

    const date = document.createElement("span");
    date.innerText = ` (${post.date})`;

    opInfo.appendChild(date);

    threadContents.appendChild(opInfo);

    const threadText = document.createElement("div");
    threadText.classList.add("thread-text");
/*
    if (isReply) {
        const gotoReply = document.createElement("a");
        gotoReply.innerText = `>>${post.replyTo}`;
        gotoReply.href = `#post-${post.replyTo}`;
        threadText.appendChild(gotoReply);
    }*/

    const content = document.createElement("p");
    const text = post.content.split("\n")
    for (let i = 0; i < text.length; i++) {
        // implementing markdown
        //<span class="spoiler">this is a spoiler</span><br>
        const line = text[i];
        const span = document.createElement("span");
        span.innerHTML = parseMarkdown(escapeHTML(line))
        /*if (line.startsWith(">>")) {
            
        } else */if (line.startsWith(">") && !line.startsWith(">>")) {
            // turning text to purple
            span.style.color = "aquamarine";
            /*span.innerText = line;
            content.appendChild(span);
            content.appendChild(document.createElement("br"));*/
        } else {
            /*
            // create an a tag which links to the post
            console.log(spaces)
            if (tagPost.length) {
                // create an a tag which links to the post
                const a = document.createElement("a");
                a.href = `#post-${tagPost[0].substring(2)}`;
                a.innerText = tagPost[0];
                content.appendChild(a);
            } else {
                const span = document.createElement("span");
                span.innerText = line;
                content.appendChild(span);
            }*/
            //parseMarkdown(escapeHTML(content.content))
            //const span = document.createElement("span");
            //span.innerHTML = parseMarkdown(escapeHTML(line))
        }
        // Use .replaceAll on span to replace :specialnyacosodaofferat<><>today!alsohikart!! with the linked post ID
        span.innerHTML = span.innerHTML.replaceAll(":specialnyacosodaofferat<><>today!alsohikart!!", "")
        span.innerHTML = span.innerHTML.replaceAll("FEWNUIFEWHFIUWENIFUN&gt;WEFSUSUSUSUSUSUSUSFUW&gt;EFUEWIFWEFJSDFNZXJNDZXKJSUSSYYTHATSABITSUS", "&gt;&gt;&gt;")
        if (span.innerHTML.includes("jfe<oiwfjoiewfnodfndofnmaidswoifdfshicujewcic") && span.innerHTML.includes("sussfykakrtkrtkawreoifwfjkarting")) {
            // Here we are going to parse the message and replace the href source with /post/<id>
            
            const regex = /jfe<oiwfjoiewfnodfndofnmaidswoifdfshicujewcic(.*?)sussfykakrtkrtkawreoifwfjkarting/gim;
            let match = regex.exec(span.innerHTML);
            while (match != null) {
                const id = match[1];
                // Split the text with /
                const split = id.split("/");
                // Recreate the url
                const url = `/${split[1]}${(split[2] && split[2].length) ? "#thread-" + split[2] : ""}`;
                // Replace the url with the new url
                span.innerHTML = span.innerHTML.replace(id, url);
                match = regex.exec(span.innerHTML);
            }

            // Replace anything regarding the regex with nothing
            span.innerHTML = span.innerHTML.replaceAll(regex, "$1")

            // thank you github copilot

            //console.log(link)
            
            
        }

        //.replace(":specialnyacosodaofferat<><>today!alsohikart!!");
        content.appendChild(span);
        content.appendChild(document.createElement("br"));
    }

    // ill do the highlighting later
    //content.innerText = post.content;

    threadText.appendChild(content);
    threadContents.id = `post-${post.id}`;
    threadContents.appendChild(threadText);

    const hr = document.createElement("hr");


    div.appendChild(threadContents);
    //div.appendChild(hr);

    return div;
    //<span style="color:green;">Anonymous</span></b> c0p3&m41d | <a href="">2</a> (12/03/2022 19:44)
}
// silly
}