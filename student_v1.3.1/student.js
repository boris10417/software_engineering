var reftoStudentID
var check = 0;
//與登入介面連結後可以獲得 stu_id
var stu_id="1053326"

$(document).ready(async function(){

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


    $("#homepage").append(
        "學生" + stu_id + "首頁"
    )

    //讀入作業資訊
    var database = firebase.database();
    var ReferenceFromTeacher = database.ref("newsList");
    
    //開始新增作業內容
    let number=1;
    const data = await fetchData_hw(ReferenceFromTeacher);
    data.map(hw => {
        let HwName=hw.lesson;//lesson
        let HwREADME=hw.file_url;//file_url
        let deadline=hw.deadline;//deadline
        let HwOutline=hw.description;//description
        increase(number,HwName,HwREADME,deadline,100,HwOutline);

        //取得地址 抓lenssonList裡面的成績和上傳的檔案並修改
        let ListID;
        reftoLessonID="lessonList";
        getID(number,reftoLessonID,HwName,HwOutline)

        number++;
    })
});

async function getID(number,reftoLessonID,HwName,HwOutline){
    var database = firebase.database();
    var datebase_score = database.ref(reftoLessonID);
    const data_score = await fetchData_hw(datebase_score);
    data_score.map(hw=>{
        //確認學號後便可控制提取的分數
        if(hw.description==HwOutline && hw.lesson==HwName){
            const reftoScore = reftoLessonID+ '/' + hw.id + "/student";
            const reftoFileName = reftoScore+ '/' + stu_id
            getUploadFileName(number,reftoFileName)
            getScore(number,reftoScore)

            //上傳作業區
            //按鈕名稱依序為 #UpLoad + number
            $('#UpLoad' + number).click(function(){
                //取得作業在database的位置
                let transHTML='StudentHwUpload.html'+
                '?lessonRef='+
                hw.id +
                '/' +
                stu_id +
                '/' +
                HwName +
                '/' +
                HwOutline;

                window.location.href = transHTML;
            });
        }
    });
}

//讀取分數
async function getScore(number,reftoStudentID){
    var database = firebase.database();
    var datebase_score = database.ref(reftoStudentID);
    const data_score = await fetchData_hw(datebase_score);
    data_score.map(hw=>{
        if(hw.id==stu_id){
            $('#score' + number).html(hw.score);
        }
    });
}

//有了這個就可以下載圖片  而不是開啟
async function downloadFile(url) {
  const storageRef = firebase.storage().refFromURL(url)
  storageRef.getDownloadURL().then(function(url) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function(event) {
      var blob = xhr.response;
    };
    xhr.open('GET', url);
    xhr.send();
  })
}

//取得檔案名稱並設立超連結 (v1.3新增下載圖片功能)
async function getUploadFileName(number,reftoStudentID){
    var database = firebase.database();
    var datebase_score = database.ref(reftoStudentID);
    const data_score = await fetchData_hw(datebase_score);
    
    data_score.map(hw=>{
        if(hw.id=="item"){
            console.log(hw)
            $('#Hw_UpLoad' + number).append(
                `　<button onclick="downloadFile('${hw.path}')"> <a href="`+
                hw.path+
                '" target="_blank" title="HwREADME">'+
                hw.name+
                '</a></button>'
            );
        }
    });
}

//建立一項作業
function increase(number,HwName,HwREADME,deadline,score,HwOutline){
    $("#student").append(
        '<tr>'+
            '<td align="center" rowspan="2">'+
                number+
            '</td>'+

            '<td id="HwName" align="center">'+
                HwName+
            '</td>'+

            '<td align="center" rowspan="2">'+
                '<a href="'+
                HwREADME+
                'target="_blank" title="HwREADME">作業附件</a><br><br>'+
            '</td>'+

            '<td align="center" rowspan="2">'+
                deadline+
            '</td>'+
            
            '<td id="Hw_UpLoad'+ number +'" align="center" rowspan="2">'+
                '<input id="UpLoad'+ number +'" type="button" value="作業上傳">'+
            '</td>'+
            '<td id="score'+ number + '" align="center" rowspan="2">'+
                score+
            '</td>'+
        '</tr>'+
        '<tr>'+
            '<td align="center">'+
                HwOutline+
            '</td>'+
        '</tr>'
    )
}
//提取各object內的資料
async function fetchData_hw(refDatabase) {
    let data;
    await refDatabase.once('value', (snapshot) => {
        const keys = Object.keys(snapshot.val());
        const vals = Object.values(snapshot.val());
        data = vals.map((val, index) => {
        return {
          id: keys[index],
          deadline: val.deadline,
          lesson: val.lesson,
          description: val.description,
          file_url: val.file_url,
          score: val.score,
          name: val.name,
          path: val.path,
          student: val.student
        }
      })
    })
    return data;
}