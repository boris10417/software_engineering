/*
    進入此頁面時 網址後會接上lessonId 可拿到目前選取的(課程 作業次數)的亂數key ex:-M5HsNuN4TSaC1ZcqGT2
    抓下亂數key後 找到課程,作業次數 

    //
*/

let newsList_db;
let newsList_keys;
let stu_id_keys;
let si ;
let elem;
let clicked_stu_id;
let params;
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



    // change url string to object
    params = Object.fromEntries(new URLSearchParams(location.search));

    download_lesson_content(params);

    //當確定並送出新的分數 按鈕觸發
    $(document).on("click",".score_change_sure_button",function(){
        //<tr>
        elem = $(this).parent().parent().parent();
        //被選的學生id 用以判斷目前要修改誰的分數
        clicked_stu_id = elem.children('.stu_id').html();
        console.log("clicked_stu_id = "+clicked_stu_id);
        //新的分數
        let changed_score = document.getElementById("score_change_number_input_"+clicked_stu_id).value;
        console.log("score = "+changed_score);

        //資料庫更新被修改的分數 路徑為test_node/[目標key]/student/[被選取的學生id]
        firebase.database().ref('lessonList/'+current_test_node_key+'/student/'+clicked_stu_id).update(
            {
                score:changed_score
            }
        );
        alert("score has changed! = "+ changed_score);
        //location.href = 'works_page.html'+'?lesson_key='+ current_test_node_key+'?lesson_id='+lesson_id;
        location.reload(true)
    })


});

//暫存課程與第n次作業
let current_lesson;
let current_description;
//目前課程,作業次數的key ex:-M5HsNuN4TSaC1ZcqGT2
let current_test_node_key;
let arr;
let lesson_id;
//作品頁面區開始------------------------------------------------------------------------------

//從資料庫下載 被選擇的 課程的資料 做table
function download_lesson_content(params){
    //清空items_table
    console.log("items_table清空");
    $("#items_table").empty();
    
    console.log("download_lesson_content()中");
        firebase.database().ref('lessonList').once('value', function (test_node_snapshot) {
            test_node_db = test_node_snapshot.val();

            //newsList_keys = [RYUKJBB,TVUBVUBU]
            test_node_keys = Object.keys(test_node_db);
            console.log("lessonList_keys = "+test_node_keys);

            //載入html的時候會得到目前需操作的test_node[n]的key 存在全域變數current_test_node_key
            arr = Object.values(params);
            arr = arr[0].split('?');
            
            current_test_node_key =arr[0];
            lesson_id = arr[1].split('=')[1];
            console.log("current_test_node_key = "+current_test_node_key)
            //news_List_data = Object.values(newsList_db);
            //lesson_List_data = Object.values(lessonList_db);
            //目前的課程 與 hw2
            current_subject = test_node_db[current_test_node_key].subject;
            current_hw_id = test_node_db[current_test_node_key].hw_id;
            ////1.hw no:hw3
            //$("#hw no").attr('value',hw_id);

            //get stu_id所需的路徑
            let stu_id_path = "/lessonList/"+current_test_node_key+'/student'; 
            console.log("stu_id_path = "+stu_id_path);

            //抓到目標課程 目標作業no 的 stu_id_List下的學的id群
            firebase.database().ref(stu_id_path).once('value', function (lessonList_snapshot){
                let stu_id_List_db= lessonList_snapshot.val();
                //stu_id_keys [1051440,1053326]
                stu_id_keys = Object.keys(stu_id_List_db);
                console.log("stu_id_keys = "+stu_id_keys[0]);


                //建立table 根據學生數調整顯示的row數量
                for(let i=0;i < stu_id_keys.length;i++){
                    //stu_id_keys[0]: 1051440
                    let current_stu_id_key = stu_id_keys[i];
                    item_table_create(current_stu_id_key,stu_id_List_db[current_stu_id_key].item,stu_id_List_db[current_stu_id_key].score);
                
                }
                $("#lesson").html(current_subject);
                $("#hw_no").html(current_hw_id);
                $(document).trigger("download_lesson_content()_done");
                console.log("inside firebase download_lesson_content()_done");
            });
            
        });
        console.log("outside firebase download_lesson_content()_done");
        //$(document).trigger("download_lesson_content()_done");
}
//key[current_select_news_no]可以拿到目前選擇的消息的key
let ite;
//建立所選的key[current_select_news_no].lesson的
function item_table_create(stu_id,item,score){
    ite = item;
    si = stu_id;
    console.log("create one id!");
    //需要寫
    //2.table:學生id,下載按鈕,評分    
    //根據 lessonList/網站實務/hw_List/hw2/stu_id_List/ 建立table

    //in works_page.html
    $("#items_table").append("<tr class='row' value='tr is here'>"+
                "<td class='stu_id'>"+stu_id+"</td>"+
                "<td><a href="+item.path+" id='download_item_"+stu_id+"'><input type='button' value='下載作品'></a></td>"+
                "<td>成績:<span id='score_"+stu_id+"'>"+score+"</span></td>"+
                "<td><input id='modify_score_button_"+stu_id+"' type='button' value='修改分數' onclick='modify_score("+stu_id+")'></td>"+
                        "<td><div style='display: none;' id='score_change_div_"+stu_id+"'>"+
                        "<input  type='number' id='score_change_number_input_"+stu_id+"' >"+
                        "<input  type='button' class='score_change_sure_button' value='確定並送出' >"+
                        "</div></td>"+
            "</tr>");
   //id :download_item_stu_id, score_stu_id , modify_score_button_stu_id , score_change_div_stu_id , score_change_number_input_stu_id , score_change_sure_button_stu_id
   
   $("#go_to_last_page").empty(); 
   //go to last page
   $("#go_to_last_page").append("<a href='news_page.html?lesson_id="+ lesson_id+"'><input type='button' value='返回上頁'></input>");
   
}


//測試用
let el;
function modify_score(stu_id){
    //展開收起方塊
    $("#score_change_div_"+stu_id).toggle();
    //預設舊分數
    //$("#score_change_number_input_"+stu_id).attr("value",  Number($("#score_"+stu_id).html())  );
    console.log("$('score_'+stu_id).html() = "+$("#score_"+stu_id).html());
    //展開後按鈕內容變更
    if($("#score_change_div_"+stu_id).css("display") == "block"){
        $("#modify_score_button_"+stu_id).attr("value","再按一次收回");
    }
    else{
        $("#modify_score_button_"+stu_id).attr("value","修改分數");
    }
    //upload(stu_id,$("#score_change_number_input_"+stu_id).attr("value"));
}

/*
function upload(new_score){


}
//作品頁面區結束------------------------------------------------------------------------------
*/