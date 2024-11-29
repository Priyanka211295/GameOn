
var express=require("express");
var a=express();
var fileupload=require("express-fileupload");
a.use(fileupload());
a.use(express.static("Public"));
a.use(express.urlencoded(true));
var mysql2=require("mysql2");
var cloudinary=require("cloudinary").v2;

a.listen(1500,function(){
    console.log("Server started");
})

cloudinary.config({ 
    cloud_name: 'dj4dommuy', 
    api_key: '438245931596139', 
    api_secret: 'OXnORddlBE4ChMc5YrWVfLvga5s'// Click 'View API Keys' above to copy your API secret
});

a.get("/",function(req,resp){
    let path=__dirname+"/Public/index.html";
    resp.sendFile(path);
})

a.get("/Org-dashboard",function(req,resp){
    let path=__dirname+"/Public/dashOrganizer.html";
    resp.sendFile(path);
})

//////////////////////// DATABASE
let config="mysql://avnadmin:AVNS_Lqqk4a-j-C9NTMukoyt@mysql-2d86f665-priyanka619-4fa5.k.aivencloud.com:10647/defaultdb";
let mysqlServer=mysql2.createConnection(config);
mysqlServer.connect(function(err){
    if(err==null)
        console.log("connected to aiven database");
    else
    console.log(err.message);
})
///////////////////////////////
a.post("/save",async function(req,resp){
    
     let filename="";
     if(req.files==null)
        filename="nopic.jpg";
    else
    {
        filename=req.files.pic.name;
        let path=__dirname+"/Public/uploades/"+filename;
        console.log(path);
        req.files.pic.mv(path);

      await cloudinary.uploader.upload(path).then(function(result){
        filename=result.url;
        console.log(filename);
      })
    }
    req.body.pic=filename;


    let email=req.body.txtMail;
    let org=req.body.txtOrg;
    let contact=req.body.txtCon;
    let add=req.body.txtAdd;
    let city=req.body.txtCity;
    let proof=req.body.optId;
    let pic=req.body.pic;
    let sport=req.body.optSport;
    let txt=req.body.txtArea;
    let web=req.body.txtWeb;
    let ins=req.body.txtInsta;
    mysqlServer.query("insert into organizations values(?,?,?,?,?,?,?,?,?,?,?)",[email,org,contact,add,city,proof,pic,sport,txt,web,ins],function(err){
        if(err==null)
            resp.send("Record saved in database");
        else
        resp.send(err.message);
    })
})
/////////////////////////////////////////////////////////

a.get("/signup-process",function(req,resp){
   //resp.send(req.query);
   let email=req.query.txtEmail;
   let pwd=req.query.txtPwd;
   let utype=req.query.utype;
       mysqlServer.query("insert into users values(?,?,?,current_date(),?)",[email,pwd,utype,1],function(err){
        if(err==null)
            resp.send("Record Saved");
        else
            resp.send(err.message); 
        })
    })
///////////////////////////////////////

a.get("/login-process",function(req,resp){
    let email=req.query.txtMail;
    let pwd=req.query.txtPass;
    
    mysqlServer.query("select * from users where emailid=? and pwd=?",[email,pwd],function(err,jsonArray){
       // resp.send(jsonArray);
        if(jsonArray.length==1)
        {
            resp.send(jsonArray[0]["utype"]);
        }
        else
        resp.send("Invalid emailid and password");
    })
})  

//////////////////////////////////////////////
a.get("/search-user",function(req,resp){
    let email=req.query.txtMail;
    mysqlServer.query("select * from organizations where emailid=?",[email],function(err,jsonArray){
        if(err!=null)
            resp.send(err.message);
        else
        resp.send(jsonArray);
    })
})
/////////////////////////////////////////////////
a.post("/update",async function(req,resp){
    let filename="";
        filename=req.files.pic.name;
        let path=__dirname+"/Public/uploades/"+filename;
        req.files.pic.mv(path);

        await cloudinary.uploader.upload(path).then(function(result){
            filename=result.url;
            console.log(filename);
        })
    req.body.pic=filename;

    let email=req.body.txtMail;
    let org=req.body.txtOrg;
    let contact=req.body.txtCon;
    let add=req.body.txtAdd;
    let city=req.body.txtCity;
    let proof=req.body.optId;
    let pic=req.body.pic;
    let sport=req.body.optSport;
    let txt=req.body.txtArea;
    let web=req.body.txtWeb;
    let ins=req.body.txtInsta;

    mysqlServer.query("update organizations set organization=?,contact=?,address=?,city=?,proof=?,ppic=?,sports=?,prev=?,website=?,insta=? where emailid=?",[org,contact,add,city,proof,pic,sport,txt,web,ins,email],function(err){
        if(err==null)
            resp.send("Record updated successfully");
        else
        resp.send(err.message);
    })
})

///////////////////////////////////////////////
a.get("/Orgdeatils",function(req,resp){
    let path=__dirname+"/Public/publish-tournaments.html";
    resp.sendFile(path);
})

///////////////////////////////////////////////
a.post("/saveOrg-details",async function(req,resp){
    
    let filename="";
    if(req.files==null)
       filename="nopic.jpg";
   else
   {
       filename=req.files.pic.name;
       let path=__dirname+"/Public/uploades/"+filename;
       console.log(path);
       req.files.pic.mv(path);

     await cloudinary.uploader.upload(path).then(function(result){
       filename=result.url;
       console.log(filename);
     })
   }
   req.body.pic=filename;

   let email=req.body.txtMail;
   let game=req.body.txtGame;
   let title=req.body.txtTitle;
   let fee=req.body.txtFee;
   let date=req.body.txtDate;
   let city=req.body.txtCity;
   let location=req.body.txtLoc;
   let prize=req.body.txtPrize;
   let pic=req.body.pic;
   let info=req.body.txtInfo;
   
   mysqlServer.query("insert into tournaments values(?,?,?,?,?,?,?,?,?,?,?)",[null,email,game,title,fee,date,city,location,prize,pic,info],function(err){
       if(err==null)
           resp.send("Record saved in database");
       else
       resp.send(err.message);
   })
})
//////////////////////////////////////////////////
a.get("/login-process",function(req,resp){
resp.send(req.query);
})

a.get("/angular",function(req,resp){
    let path=__dirname+"/Public/tournaments-finder.html";
    resp.sendFile(path);
})


   a.get("/fetch-all-records",function(req,resp){
    let city=req.query.city;
    let game=req.query.game;
    mysqlServer.query("select * from tournaments where city=? and game=?",[city,game],function(err,jsonArray){
        if(err!=null)
            resp.send(err.message);
        else
        resp.send(jsonArray);
     })
   })

   a.get("/fetch-all-cities",function(req,resp)
    {
       mysqlServer.query("select distinct city from tournaments",function(err,jsonArrayC)
      {
       if(err!=null)
       resp.send(err.message);
       else
       resp.send(jsonArrayC);
       })
    })

   a.get("/fetch-all-games",function(req,resp)
      {
          mysqlServer.query("select distinct game from tournaments",function(err,jsonArrayG)
        {
          if(err!=null)
          resp.send(err.message);
          else
          resp.send(jsonArrayG);
        })
      })

   a.post("/savePlayer-details",async function(req,resp){

            let filename="";
            if(req.files==null)
               filename="nopic.jpg";
           else
           {
               filename=req.files.pic.name;
               let path=__dirname+"/Public/uploades/"+filename;
               console.log(path);
               req.files.pic.mv(path);
        
               await cloudinary.uploader.upload(path).then(function(result){
               filename=result.url;
               console.log(filename);
              })
           }
           req.body.pic=filename;
        
           let email=req.body.txtMail;
           let name=req.body.txtName;
           let game=req.body.txtGame;
           let mob=req.body.txtMob;
           let dob=req.body.txtDOB;
           let gender=req.body.txtGender;
           let add=req.body.txtAdd;
           let city=req.body.txtCity;
           let opt=req.body.optId;
           let info=req.body.txtInfo;
           
           mysqlServer.query("insert into players values(?,?,?,?,?,?,?,?,?,?)",[email,name,game,mob,dob,gender,add,city,opt,info],function(err){
               if(err==null)
                   resp.send("Record saved in database");
               else
               resp.send(err.message);
           })
        })

a.post("/modifyPlayer-details",async function(req,resp){
    
            let filename="";
            if(req.files==null)
            filename="nopic.jpg";
            else
           {
               filename=req.files.pic.name;
               let path=__dirname+"/Public/uploades/"+filename;
               console.log(path);
               req.files.pic.mv(path);
        
               await cloudinary.uploader.upload(path).then(function(result){
               filename=result.url;
               console.log(filename);
               })
           }
           req.body.pic=filename;
        
           let email=req.body.txtMail;
           let name=req.body.txtName;
           let game=req.body.txtGame;
           let mob=req.body.txtMob;
           let dob=req.body.txtDOB;
           let gender=req.body.txtGender;
           let add=req.body.txtAdd;
           let city=req.body.txtCity;
           let opt=req.body.optId;
           let info=req.body.txtInfo;

           mysqlServer.query("update players set name=?,games=?,mobile=?,dob=?,gender=?,address=?,city=?,idproof=?,otherinfo=? where email=?",[name,game,mob,dob,gender,add,city,opt,info,email],function(err){
            if(err==null)
            resp.send("Record updated successfully");
            else
            resp.send(err.message);
          
           })
        })
  a.get("/update-pass",function(req,resp){
            let email=req.query.txtEmail;
            let oldpass=req.query.curPwd;
            let newpass=req.query.newPwd;
            // console.log(email);
            // console.log(oldpass);
            // console.log(newpass);

            mysqlServer.query("update users set pwd=? where emailid=? and pwd=?",[newpass,email,oldpass],function(err,result){
                //console.log(result.affectedRows);

                if(err!=null)
                {
                    resp.send(err.message);
                }
                else if(result.affectedRows==1)
                {
                    resp.send("Password Updated successfully");
                }
                else
                {
                    resp.send("no email and pass");
                }
            })
        })


       
        








