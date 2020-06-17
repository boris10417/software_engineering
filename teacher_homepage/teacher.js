/*
1.home page: 
顯示:
    1.(div table)簡單的作業消息清單:
        內容:課程,截止日期
(button)進入news page

2.news page:
顯示:   1.(div table)詳細的作業消息清單:
            內容:(text)消息id,(buttun)修改消息,(buttun)刪除消息,課程,作業說明,(buttun)題目檔案(下載),截止日期,(button)評分作品(進入works page)
        2.(buttun)新增消息(展開div id="add news"):
            內容:(text input)消息id
                ,(text input)課程
                ,(text input)作業說明
                ,(檔案 input)題目檔案
                ,(date input)截止日期
        
3.works page:

老師能操作的有:新增(消息)、修改(消息)、刪除(消息)、評分(作品)
*/

/*
    onlick中測試過可用的
    console.log(this);
    console.log(this.parentElement);
    console.log(this.parentElement.id);
    console.log(this.parentElement.nodeName);
    document.getElementsByTagName(this.parentElement.tag);

    未測試
    document.getElementsById( this.parentElement.parentElement.id  ) 
*/
/*

//當url是object的時候 以下方法可以拿到連結
    //console.log("url = " + Object.values(obj)[1]);
    //console.log("url = " + url['i']);
*/
//載入文件

//上傳檔案所需變數

let data = {    
    lesson:"undefined",
    description:"undefined",
    deadline:"undefined",
    file_url:"undefined"//########### url目前想法為 存在urlList/topic_file/  ###############
}
let news_count = 0;
//var dfd = $.Deferred();
//dfd.done(upload(storageRef ,file)).done(url_f(file_path)).done(data_push(data));

//測試用數據庫變數
let db = firebase.database().ref('newsList');
//數據庫
let data_base;//= firebase.database().ref('newsList');
//第n列
let current_select_news_no;//= current_dom_element.children(".count").html();


//當點擊了評價作品 或 修改消息 或 刪除消息時 須將元素暫存於此 抓的元素應為<tr>
let current_dom_element;//= $(this).parent().parent()
//newsList[]
let news_List_data;// = Object.values(data_from_db)

//let event =new Event();//="download_lesson_content()_done"

$(document).ready(function(){

    $("#out").click(function(){
        window.location.href = "../index.html";
    });

    $("#edit").click(function(){
        let newPass = prompt("please input your new password");
        
        let id = localStorage.getItem("storageName");
        let ref = firebase.database().ref('personalData/' + id);
        
        if(newPass != "" && newPass != null){
            ref.update({
                password: newPass
            });
            alert("your password is " + newPass);
        }
        
    });


    let add_display = false;
    let mod_display = false;
    //暫存news_table的id，需從資料庫拿到id取代此變數
    
    let file, storageRef ,file_path;
    //預設路徑
    file = "";
    storageRef = firebase.storage().ref('homework');

    //頁面載入 從資料庫下載資料並且顯示現有消息
    download_data_from_database();
    //download_lesson_content();
    //let url_buffer;
    //新增消息
    $(document).on("click",".add",function add_news(){
        
        //this.parentElement.parentElement.id   可以得到目前消息的id
        //需使用document.getElementsById( this.parentElement.parentElement.id  ) 已確保動態生成物件可以被抓到
        //阿亮的上傳套件:按下選擇檔案時
        

        
        //點擊後展開div 第二次點擊 收起div
        if(add_display){
            $(".add").attr("value","添加消息")
            $("#div_for_add_news").attr("style","display:none");
            add_display = false;
            //還原草稿區
            //$("#div_for_add_news").attr("style","display:none");    
            $("#div_for_add_news").empty();
        }
        else{
            $("#div_for_add_news").empty();
            $("#div_for_add_news").append(
                "<table class='complete_news_table'>"+
                        "<tr>"+
                            "<td>課程:<input id='news_table_lesson_name' type='text' placeholder='範例課程'></td>"+
                            "<td>作業說明:<input id='news_table_description' type='text' placeholder='範例作業說明'></td>"+
                            "<td>題目檔案上傳:<input type = 'file' id = 'fileButton'><input id='url_save' style='display:none' href=''></td>"+
                            "<td>截止日期<input type='date' id='news_table_deadline'></td>"+
                        "</tr>"+
                        
                    "</table>"+
                "<p style='text-align:center;'>"+
                        "<input type='button' id='make_sure_for_add_news' value='確定並送出'>"+
                    "</p>"
            ); 
            $(".add").attr("value","再點擊一次收起");
            $("#div_for_add_news").attr("style","display:block");
            add_display = true;

            //阿亮的上傳套件:按下選擇檔案時
            $("#fileButton").change(function(e){
                console.log("選擇檔案中");  
                file = e.target.files[0];
                file_path = 'homework/' + file.name;
                console.log(file.name);
                console.log(file_path);
                //按下選擇檔案時//storageRef = firebase.storage().ref(file_path)    
                storageRef = firebase.storage().ref(file_path);
                        
                console.log("storageRef = "+storageRef);
                    // let task = storageRef.put(file);
                    // console.log(task);
                //$(document).trigger("select a file");
                console.log("選擇檔案結束");  
            });
      
            //當確定並送出時
            $(document).on("click","#make_sure_for_add_news",function(){
                console.log("submit中");
                //添加新的訊息在列表中
                //暫存的div
                /*
                $("#news_table").append(
                    "<tr>"+
                    "<td class='count'>"+news_count+"</td>"+
                    "<td><input class='modify' type='button' value='修改消息'></td>"+
                    "<td><input class='delete' type='button' value='刪除消息'></td>"+
                    "<td class='lesson'>"+$("#news_table_lesson_name").val()+"</td>"+
                    "<td class='description'>"+$("#news_table_description").val() +"</td>"+
                    "<td ><a id='download_file'><input type='button' value='題目檔案下載'></td>"+
                    "<td class='deadline'>"+$("#news_table_deadline").val() +"</td>"+
                    "<td><a href='works_page.html'><input class='score' type='button' value='評分作品'></td>"+
                    "</tr>"
                );
                
                console.log("news_table create append done");
                */
                //console.log("download_file = "+'#download_file');
                console.log("file_path = "+file_path);
                //將url放入a中
                //url_f(file_path);
                               
                $(".add").attr("value","添加消息")
                add_display = false;
                //let random_id = randomPassword(6);

                console.log($("#news_table_lesson_name").val() +","+  $("#news_table_description").val() +","+ $("#news_table_deadline").val() );
                $("#div_for_add_news").attr("style","display:none");
                //$(document).on("submit_done",upload(storageRef,file,file_path,data) );
                upload(storageRef,file,file_path,data);
            });
        }
    });

    //修改消息
    $(document).on("click",".modify",function modify_news(){
        console.log( $(this).parent());
        modi = $(this).parent().parent();
        //目前選擇的parent.parent = <tr>元素
        current_dom_element = $(this).parent().parent();
        // modify_news_id.children(".count").html();
        if(mod_display){
            $("#tr_for_modify_news").remove();
            mod_display = false;
        }
        else{
            //展開暫時的修改消息row
            $("<tr id='tr_for_modify_news'>"+
                    "<td></td>"+
                    "<td><input type='button' id='modify_yes' value='確定並送出'>"+
                    "<td><input type='button' id='modify_cancel' value='取消'></td>"+
                    "<td>課程<input id='news_modify_lesson_name' type='text' value="+current_dom_element.children(".lesson").html()+"></td>"+
                    "<td>作業說明:<input id='news_modify_description' type='text' value="+current_dom_element.children(".description").html()+"></td>"+
                    "<td>題目檔案上傳:</td>"+
                    "<td>截止日期<input type='date' id='news_modify_deadline'value="+current_dom_element.children(".deadline").html()+"></td>"+
                "</tr>"
            ).insertAfter(current_dom_element.closest("tr"));

            mod_display = true;  
        }
        $("#modify_cancel").click(function (){
            $("#tr_for_modify_news").remove();
            mod_display = false;
        });
        
        $("#modify_yes").click(function(){
            
            data.lesson = String($("#news_modify_lesson_name").val());
            data.description = String($("#news_modify_description").val());
            data.deadline = String($("#news_modify_deadline").val());

            console.log("in modify_yes, data = ("+data.lesson+","+data.description +","+data.deadline);


            firebase.database().ref('newsList').once('value', function (snapshot) {
                let data_from_db = snapshot.val();
                Object.values(data_from_db);
                //Object.values(data_from_db)['0'].lesson;
                let key = Object.keys(data_from_db);
                //編號no  用來操作第no筆資料
                current_select_news_no = current_dom_element.children(".count").html();

                console.log("current_select_news_no = "+current_select_news_no);
                //對編號no的key進行資料更新
                firebase.database().ref('newsList').child(key[current_select_news_no]).update(
                    {
                        lesson:data.lesson,
                        description:data.description,
                        deadline:data.deadline
                    }
                );
                $("#tr_for_modify_news").remove();
                //頁面重新載入
                location.reload(true);
            });


        });
        //
    });
    //刪除消息
    $(document).on("click",".delete",function delete_news(){
        let delete_news_id = $(this).parent().parent();
        if (confirm('你確定要刪除嗎?')) {
            firebase.database().ref('newsList').once('value', function (snapshot) {
                let data_from_db = snapshot.val();
                //Object.values(data_from_db);
                //Object.values(data_from_db)['0'].lesson;
                let key = Object.keys(data_from_db);
                //data_from_db[key]
                //點modify時會抓到 編號no (string)
                let no = delete_news_id.children(".count").html();
                console.log(".lesson = " +delete_news_id.children(".lesson").html());
                console.log(".description = " + delete_news_id.children(".description").html());


                //firebase.database().ref('newsList').child(key[no]).remove();
                getTargetKeyFromRoot_return_version('newsList',delete_news_id.children(".lesson").html(),delete_news_id.children(".description").html())
                getTargetKeyFromRoot_return_version('lessonList',delete_news_id.children(".lesson").html(),delete_news_id.children(".description").html())
                
                
            });
        } 
        else {}
    });
   
    //評分作品
    //須根據目前的lesson 跟 description找到test_node底下對應的 key
    $(document).on("click",".score",function(){
        console.log("評分作品start");
        current_dom_element = $(this).parent().parent();
        current_select_news_no = current_dom_element.children(".count").html();


        
        console.log("current_dom_element = "+current_dom_element);
        console.log("current_select_news_no = "+current_select_news_no);

        //拿到目前被選取的課程 與 作業說明
        let current_lesson = current_dom_element.children(".lesson").html();
        let current_description = current_dom_element.children(".description").html();

        
        //arr = getTargetContentFromRoot('personal',"std_id","identify");//[1051440,1053326]
        //key_arr = getTargetKeyFromRoot('personal',"identify");//[-mqwudqoiwjd , -mbwodijqoiwi]

        console.log("current_lesson = "+current_lesson);
        console.log("current_description = "+current_description);
        //firebase.database().ref('newsList').child();
        //data_from_db = snapshot.val()
        //藉由目前被選取的課程 與 作業說明找到test_node裡對應的key
        //key_arr = getTargetKeyFromRoot('newsList',"軟體工程","hw1");
        //arr = getTargetKeyFromRoot('test_node',current_lesson,current_description);
        //console.log("arr = "+arr);
        getTargetKeyFromRoot('lessonList',current_lesson,current_description);
         
        //console.log("pass_key = "+pass_key)
        //alert("即將跳轉頁面")
        //目前pass key會傳test_node[第current_select_news_no個]資料的亂數key   並且塞進網址後方

        //location.href = 'works_page.html'+'?lesson_id='+ pass_key[0];
        //download_lesson_content();
        
        /*
        //download_lesson_content()
        $(document).on("download_lesson_content()_done",function(){
            if(confirm("即將跳轉頁面")){
                location.href = 'works_page.html';
                //download_lesson_content();
            }
            else{
            }
            //location.href = 'works_page.html';
        });*/
    });
});

let modi;



//提交結束後 上傳檔案到storage
//警告 database跟storage 不一樣






//測試時先宣告在global
let data_from_db;
//目前的課程 每次重新載入此html都要有這個
let lesson_id;
//進入此頁面時 應該先去資料庫抓到資料 接著對現有的消息塞入表格
function download_data_from_database(){
    
    console.log("download_from_database()中");

    // change url string to object
    let params = Object.fromEntries(new URLSearchParams(location.search));
    console.log("params = "+params);
    lesson_id = Object.values(params); //filter(key => key === params['lesson_id'])
    console.log("lesson_id = "+lesson_id);
    data_base = firebase.database().ref('newsList');

    $("#news_page_to_home_page").empty();
    $("#news_page_to_home_page").append("<input type = 'button' value = '返回首頁'></input>");
    $("#news_page_to_home_page").attr("href", "home_page.html" + "?lesson_id=" + lesson_id);

    data_base.once('value', function (snapshot) {
        data_from_db = snapshot.val();
        console.log("data_from_db = "+data_from_db);
        //console.log("data = "+data);
        news_List_data = Object.values(data_from_db);

        for(let i=0;i < news_List_data.length;i++){
            //使用
            if(lesson_id == news_List_data[i]['lesson']){
                table_create( news_List_data[i]['lesson'] , news_List_data[i]['description'] , news_List_data[i]['file_url'],news_List_data[i]['deadline']);
                home_page_display(news_List_data[i]['lesson'],news_List_data[i]['deadline']);
                news_count++;
            }
            
        }
        
        $(document).trigger("download_data_to_html_done");
    });
        
    
}


function table_create(lesson,description,url,deadline){ 
    $("#news_table").append(
        "<tr>"+
        "<td class='count'>"+news_count+"</td>"+
        "<td><input class='modify' type='button' value='修改消息'></td>"+
        "<td><input class='delete' type='button' value='刪除消息'></td>"+
        "<td class='lesson'>"+lesson+"</td>"+
        "<td class='description'>"+description +"</td>"+
        "<td class='url'><a href="+url+"><input type='button' value='題目檔案下載'></td>"+
        "<td class='deadline'>"+deadline+"</td>"+
        "<td><input class='score' type='button' value='評分作品'></td>"+
        "</tr>"
    );//<a href='works_page.html'>拿掉以測試
}
//score
//score
let test_keys;
let test_lesson;
//全部東西都塞在upload裡才會動
function upload(storageRef,file,file_path,data) {
    if(file==""){
        console.log("目前沒file")
    }
    else{
        console.log("in upload() storageRef = "+storageRef);
        let a = storageRef.put(file);
        // console.log(a);
        // console.log(a.error_);
        alert("upload success!!");
        console.log("upload done");
        $(document).trigger("upload done",);


        //-----------------------------------------------------------------------
        console.log("url() start");

        //storageRef.child(filepath[i]).getDownloadURL().then(function(url)
        firebase.storage().ref().child(file_path).getDownloadURL().then(function(url){    
            // `url` is the download URL for 'images/stars.jpg'

            // This can be downloaded directly:
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function(event) {
                var blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();

            //console.log("url = "+url);//change file path to url 
            

            //firebase.database().ref('urlList/topic_file').push({url:url});
            //console.log("length of newsList = "+firebase.database().ref('newsList').length());
            //console.log("length of topic_file = "+firebase.database().ref('urlList/topic_file').length());


            // Or inserted into an <img> element:
            /*
            $("#dw" + i).attr("href", url);//it can download!!
            $("#myimg" + i).attr("src", url);//it can download!!
            */
            data.file_url = url;
            
            $(document).trigger("url done");
            console.log("data.file_url = "+data.file_url);
            console.log("url done");

            //data_push(data);

            //-------------------------------------------------------------------------------------------
        
            console.log("data_push start");
        
            //路徑newsList
            //let newsList = firebase.database().ref('newsList');
            //添加子節點
            //newsList.push(id);
            //添加屬性 url問題暫時無法解決 暫放undifined
            //console.log("id = " +id);

            data.lesson = String($("#news_table_lesson_name").val());
            data.description = String($("#news_table_description").val());
            data.deadline = String($("#news_table_deadline").val());
            
            console.log("in data_push() data = ("+data.lesson+","+data.description+","+data.file_url +","+data.deadline);
            //資料庫對於新的push沒有指定節點名稱會產生一個亂數 之後用他當id
            firebase.database().ref('newsList/').push(data);
            //console.log(url_buffer);

            //拿到帳號資料庫
            firebase.database().ref('personalData').once("value",function(snapshot){
                let personal_snap = snapshot.val();
                let personal_keys = Object.keys(personal_snap);
                
                //添加新的消息時 需要同時在lessonlist底下增加新的節點#####################################################
                firebase.database().ref('lessonList').once("value",function(snapshot){
                    let lesson_snap = snapshot.val();
                    let lessonList_keys = Object.keys(lesson_snap);
                    
                    test_lesson = lesson_snap;
                    test_keys = lessonList_keys;

                    console.log("test_lesson = " +test_lesson);
                    console.log("test_keys = " +test_keys);
                    console.log("data.lesson= " +data.lesson);
                    console.log("test_lesson.hasOwnProperty(data.lesson)= " + test_lesson.hasOwnProperty(data.lesson));


                    /*//已完成功能                    
                    //當lessonList有此課程時
                    if(lesson_snap.hasOwnProperty(data.lesson)){
                        alert("課程已經存在");

                        //接著檢查作業項目 hw N 是否存在
                        firebase.database().ref('test_node/'+data.lesson+'/hw_List').once("value",function(snapshot){
                            let hw_List_snap = snapshot.val();
                            let hw_List_keys = Object.keys(hw_List_snap);
                            //當作業項目存在
                            if(hw_List_snap.hasOwnProperty(data.description)){
                                alert("作業項目已經存在");

                                console.log("hw_List_snap = " +hw_List_snap);
                                console.log("hw_List_keys = " +hw_List_keys);
                                console.log("data.description= " +data.description);
                                alert("作業項目已經存在 結束");
                                location.reload(true);
                            }
                            else{
                                alert("作業項目不存在");
                                console.log("hw_List_snap = " +hw_List_snap);
                                console.log("hw_List_keys = " +hw_List_keys);
                                console.log("data.description= " +data.description);


                                let ht_List_path = {
                                    stu_id_List:{
                                        stu_id1:0,
                                        stu_id2:0
                                    } 
                                };
                                firebase.database().ref('test_node/'+data.lesson+'/hw_List/'+data.description).update(ht_List_path);

                                alert("作業項目不存在 結束");
                                location.reload(true);
                            }

                        });
                        //lesson_path['/'+data.lesson+'/hw_List/'+data.description+'/stu_id_List'] = 
                        
                    }
                    //當lessonList沒有此課程時
                    else{
                        alert("課程不存在");
                        //新增子路徑 直到/hw_List                       
                        let lesson_path = {
                            "hw_List":{
                                [data.description]:{
                                    "test":0
                                }
                            }
                        };
                        //更新 新的課程 整條路徑
                        firebase.database().ref('test_node/'+data.lesson).update(lesson_path);
                        alert("課程不存在 結束");
                        
                    }

                    *///----------------------------------------------------------------------------------------
                    //取所有學生的id
                    //personal_snap = ;
                    //personal_keys = ;
                    let student={};
                    for(var i = 0; i < personal_keys.length; i++){
                        var k = personal_keys[i];
                        if(personal_snap[k].identify == "0" ){
                            student[personal_snap[k].stu_id] = {item:"[url]",score:"0"}
                        }
                    }

                    /*測試功能*/
                    //目前想測試push()的方式  這樣尋找資料會比較方便
                    //資料結構:
                    let lesson_data ={
                        lesson:data.lesson,
                        description:data.description,
                        student
                    };
                    firebase.database().ref('lessonList').push(lesson_data);
                    alert("課程 結束");
                    
                    //測試功能結束
                    console.log("data_push done");
                    //頁面重新載入
                    location.reload(true);
                });
                /**///#################################################################################################
            });
            //console.log("data_push done");
                //url_f(file_path);
            //----------------------------------------------------------------------------------------------------   
        }); 
         
    } 
}


//首頁顯示新的消息
function home_page_display(lesson,deadline){
    //只需要顯示lesson 截止日期即可
    $("#simple_news_table").append(
        "<tr ><!--課程,截止日期-->"+
            "<td>[消息]</td><td>課程:"+lesson +"</td> <td>截止日期:"+deadline+"</td>"+
        "</tr>"
    );
    $("#go_to_news_page").attr("href","news_page.html"+'?lesson_id='+lesson_id);
}


//可拿到目前目標路徑中的 content內容的 array
//在newsList中找 軟體工程 hw1 的 key 回傳
//只有在newslist test_node中能作用
function getTargetContentFromRoot(root,lesson,description) {
    var num = [];
    // personal.on('value', gotData, errData);
    firebase.database().ref(root).on('value', function(snapshot){
        
        // console.log(snapshot);

        let obj = snapshot.val(); 
        let keys = Object.keys(obj);
        // console.log(keys); //it is key array

        for(var i = 0; i < keys.length; i++){
            var k = keys[i];
            if(obj[k].lesson == lesson &&obj[k].description == description){
                num.push(obj[k]);
            }
        }
        console.log("num="+num);
        return num;

    }, function errData(err){
        console.log("error");
        console.log("err");
        
    });
    
    // console.log(num);
    
    
}

//可拿到目前目標路徑中的 有content內容的key array
function getTargetKeyFromRoot(root,lesson,description) {
    var num = [];
    // personal.on('value', gotData, errData);
    firebase.database().ref(root).on('value', function(snapshot){
        
        // console.log(snapshot);

        let obj = snapshot.val(); 
        let keys = Object.keys(obj);
        // console.log(keys); //it is key array

        for(var i = 0; i < keys.length; i++){
            var k = keys[i];
            if(obj[k].lesson == lesson &&obj[k].description == description){
                num.push(k);
            }
        }
        console.log("num="+num);
        


        
        //目前pass key會傳test_node[第current_select_news_no個]資料的亂數key   並且塞進網址後方
        alert("即將跳轉頁面")
        location.href = 'works_page.html'+'?lesson_key='+ num +'?lesson_id='+lesson_id;

    }, function errData(err){
        console.log("error");
        console.log("err");
        
    });
    
    // console.log(num);
    
    
}


function getTargetKeyFromRoot_return_version(root,lesson,description){

    var num = [];
    // personal.on('value', gotData, errData);
    firebase.database().ref(root).once('value', function(snapshot){
        
        // console.log(snapshot);

        let obj = snapshot.val(); 
        let keys = Object.keys(obj);
        // console.log(keys); //it is key array

        for(var i = 0; i < keys.length; i++){
            var k = keys[i];
            if(obj[k].lesson == lesson &&obj[k].description == description){
                num.push(k);
            }
        }
        console.log("1.num="+num);
        

        //刪除lessonList中對應節點
        firebase.database().ref(root+'/'+num).remove();
        alert('已刪除此消息');
        //頁面重新載入
        location.reload(true);

    }, function errData(err){
        console.log("error");
        console.log("err");
        
    });
    
    //console.log("num="+num);
    //return num;
}