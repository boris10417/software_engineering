$(document).ready(function(){

    // console.log(firebase);

    let database = firebase.database();
    let personal = database.ref('personalData');
    // let data = {
    //     name: "Shelly",
    //     password: "conan"
    // }
    // personal.push(data);

    let name;
    let pass;
    //let identify;
    $("#username").change(function(){
        name = $(this).val();
    });

    $("#password").change(function(){
        pass = $(this).val();
    });

    $("#input").click(function(){
        personal.on('value', gotData, errData);
        
    });

    function gotData(data)
    {
        // console.log(data.val());
        let exist = 0;
        let index;
        let obj = data.val(); 
        let keys = Object.keys(obj);
        // console.log(keys); it is key array
        for(let i = 0; i < keys.length; i++){
            let k = keys[i];
            if(checkUserName(obj[k].name)){
                exist = 1;
                index = k;
            }
        }
        if(exist == 0){
            alert("username you entered is not success");
        }
        
        if(exist == 1 && obj[index].password == pass){
            alert("Login Success");

            localStorage.setItem("storageName",index);//id save to localStorage


            //根據身分決定跳轉的頁面
            if(obj[index].identify == 1){
                window.location.href = "teacher_homepage/home_page.html"+'?lesson_id='+obj[index].lesson;
            }
            else if(obj[index].identify == 0){
                window.location.href = "student_v1.3.1/student.html";
            }
        }
        else if(exist == 1 && obj[index].password != pass){
            alert("password you entered is not correct");
        }
        
    }

    function errData(err)
    {
        console.log("error");
        console.log("err");
    }

    function checkUserName(n)
    {
        if(n == name){
            return true;
        }
        return false;        
    }

    // function checkIdentity(n)
    // {
    //     if(n == 0){//n == "student"
    //         return true;
    //     }
    //     else{
    //         return false;
    //     }
    // }
    // let exist = 0;
    // let index;
    // $("#input").click(function(){
    //     // document.write(name + pass);
    //     for(let i = 0; i < nameData.length; i++){
    //         if(nameData[i] == name){
    //             exist = 1;
    //             index = i;
    //         }
    //     }
    //     if(exist == 0){
    //         alert("username you entered is not corrrect!!");
    //     }
    //     if(exist == 1 && passData[index] != pass){
    //         alert("password you entered is not corrrect!!");
    //     }
    //     else if(exist == 1 && passData[index] == pass){
    //         alert("Login Success!!");
    //     }
    // });
    
});