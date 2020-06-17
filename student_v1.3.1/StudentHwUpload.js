var data={
  name:" ",
  description:" ",
  path:" "

};
$(document).ready(async function(){
    /*---------------------------------------------------------
    ref = lessonList/-M9gz0eNu2tIG3OBJkEm/student/1051440/item

    %E8%BB%9F%E9%AB%94%E5%B7%A5%E7%A8%8B   軟體工程
    %E7%B6%B2%E7%AB%99%E5%AF%A6%E5%8B%99   網站實務
    %E7%A1%AC%E9%AB%94%E5%B7%A5%E7%A8%8B   硬體工程
    %E7%B6%B2%E8%B7%AF%E5%B7%A5%E7%A8%8B   網路工程
    -----------------------------------------------------------*/

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


    str=location.href.split("=");
    str2=str[1].split("/")
    console.log("start1:"+"\n"+str2[0]+"\n"+str2[1]+"\n"+str2[2]+"\n"+str2[3])
    const ref='lessonList/'+str2[0] + '/student/' + str2[1] + '/item'
    console.log(ref)
    
    if(str2[2] == "%E8%BB%9F%E9%AB%94%E5%B7%A5%E7%A8%8B"){
      var lessonName ="軟體工程"
    }
    else if(str2[2] == "%E7%B6%B2%E7%AB%99%E5%AF%A6%E5%8B%99"){
      var lessonName="網站實務"
    }
    else if(str2[2] == "%E7%A1%AC%E9%AB%94%E5%B7%A5%E7%A8%8B"){
      var lessonName="硬體工程"
    }
    else if(str2[2] == "%E7%B6%B2%E8%B7%AF%E5%B7%A5%E7%A8%8B"){
      var lessonName="網路工程"
    }

    $("#Upload").append(
      lessonName + str2[3] +" 作業上傳"
    )
    /*---------------------------------------------------------*/
    var database = firebase.database();
    var hwReference = database.ref(ref);
    /*---------------------------------------------------------
    var test = await fetchData(hwReference);
    test.map(hw => {
      console.log(hw)
      $('#dataList').append(`<img src=${hw.path}></img>`)  
    })
    console.log(test.length)
    ---------------------------------------------------------*/
    let file, storageRef;
    $("#file").change(function(e){
        
        file = e.target.files[0];
        
        storageRef = firebase.storage().ref('homework/' +
            file.name);
            
        // console.log(storageRef);
        // let task = storageRef.put(file);
        // console.log(task);
    });

    $("#send").click(function(){

        data = {
            name: $("#homeworkName").val(),
            description: $("#homeworkDetail").val(),
            path:""
        }
        
        upload(storageRef, file, hwReference);
        //changeToUrl(storageRef.location.path_, hwReference);

    });

});

function upload(storageRef, f, ref) {
    let a = storageRef.put(f);
    // console.log(a);
    // console.log(a.error_);

    a.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        console.log('Upload is ' + progress + '% done');

        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        a.snapshot.ref.getDownloadURL().then(function(url){
      
          // `url` is the download URL for file

          // This can be downloaded directly:
          var xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = function(event) {
              var blob = xhr.response;
          };
          xhr.open('GET', url);
          xhr.send();
          console.log(url);
          data.path = url;
          ref.set(data)
        }).then(()=>{
          alert("upload success!!");
          window.location.href = "student.html";
        });
      });
    
}

async function fetchData(refDatabase) {
  let data
  await refDatabase.once('value', (snapshot) => {
    const keys = Object.keys(snapshot.val())
    const vals = Object.values(snapshot.val())

    data = vals.map((val, index) => {
      return {
        id: keys[index],
        name: val.name,
        description: val.description,
        path: val.path
      }
    })
  })

  return data
}
// function changeToUrl(filepath, ref) {
//     var storagePath = firebase.storage().ref();
    
//     // console.log(filepath);

//     storagePath.child(filepath).getDownloadURL().then(function(url){
    
//     // `url` is the download URL for 'images/stars.jpg'

//     // This can be downloaded directly:
//     var xhr = new XMLHttpRequest();
//     xhr.responseType = 'blob';
//     xhr.onload = function(event) {
//         var blob = xhr.response;
//     };
//     xhr.open('GET', url);
//     xhr.send();

//     console.log(url);

//     // var data = {
//     //     name: $("#homeworkName").val(),
//     //     description: $("#homeworkDetail").val(),
//     //     path: url
//     // }
    
//     data.path = url;
//     ref.push(data);
    
//     })
//     .catch(function(error) {
//         // Handle any errors
//     });

//     // console.log(data);
// }