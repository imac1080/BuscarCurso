
 window.addEventListener("keydown", checkKeyPress, false);
 var webHeroku="https://youtubepaxsem.herokuapp.com";
 
 function checkKeyPress(key){
   if(key.keyCode == "13"){
        nuevoVideo();
   }
 }

  function nuevoVideo(){
    if (document.getElementById("Content_TextBoxNullText_I").value!="")
    eliminarVideos().then((onResolved) => {
        var linkytText="";
    fetch(webHeroku+'/buscarCurso',{
        method:'POST',
        body:JSON.stringify({
            curso:document.getElementById("Content_TextBoxNullText_I").value
        }),
        headers:{
            "Content-Type":"application/json; charset=UTF-8"
        }
    })       
    .then(response=>{
        return response.json();
    }).then(json=>{
        document.getElementById("currentCurso").textContent=document.getElementById("Content_TextBoxNullText_I").value;
        document.getElementById("Content_TextBoxNullText_I").value="";
        for (let i = 0; i < Object.keys(json).length; i++) {
            linkytText=JSON.stringify(json[i].linkyt);
            linkytText=linkytText.split("/");    
            linkytText=linkytText[3].split("=");        
            linkytText=linkytText[linkytText.length-1].split("\"");
            anadirVideos(linkytText[0]);
          }
          if(Object.keys(json).length==0){
            document.getElementById("Content_TextBoxNullText_I").value="";
            var divError = document.createElement('DIV');
            divError.classList.add('col');
            divError.innerHTML = '<div> <img  width="100%" height="225" src="https://i.imgur.com/0OWjA79.png" alt="Error"> </div>'        
            document.getElementById("tablaCursos").appendChild(divError);
          }
        
    });
    })    
  }
  
  function anadirVideos(linkytText2){
    var descripcionYt;
    var tiempoVideo;
    fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id='+linkytText2+'&fields=items/snippet/title,items/snippet/description,items/contentDetails/duration&key=AIzaSyAFV817GnXJIvp9WTnRpO5V1S1mHCOQBu8',{
        method:'GET'
    })       
    .then(response=>{
        return response.json();
    }).then(json=>{
        descripcionYt=JSON.stringify(json.items[0].snippet.description);
        tiempoVideo=JSON.stringify(json.items[0].contentDetails.duration).split("M");
        tiempoVideo=tiempoVideo[0].split("PT");
        var divCreado = document.createElement('DIV');
        descripcionYt2=descripcionYt.split("\\n")
        descripcionYt="";
        if (descripcionYt2.length>10){
          for (let i = 0; i < 10; i++) 
            descripcionYt=descripcionYt+descripcionYt2[i]+"<br />";        
        }else{
          for (let i = 0; i < descripcionYt2.length-1; i++) 
            descripcionYt=descripcionYt+descripcionYt2[i]+"<br />";        
        }

        divCreado.classList.add('col');
        divCreado.innerHTML = '<div><div class="card shadow-sm">'
        +'<iframe width="100%" height="225" src="https://www.youtube-nocookie.com/embed/'+linkytText2+'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
         +'<div class="card-body"><p class="card-text">'+descripcionYt+'<div class="d-flex justify-content-between align-items-center">'
           +'<small class="text-muted">'+tiempoVideo[1]+' mins</small></div></div></div></div>'
        
           document.getElementById("tablaCursos").appendChild(divCreado);
    });

   
  }

  function limpiar(){    
    document.getElementById("Content_TextBoxNullText_I").value="";
    eliminarVideos();
  }

  function eliminarVideos(){
    const elements = document.getElementsByClassName("col");
    document.getElementById("currentCurso").textContent="";
    if(elements.length!=0){
        for (let i = elements.length-1; i >= 0; i--) {
            elements[i].parentNode.removeChild(elements[i]);  
            if(elements.length==0){
                return Promise.resolve("Success");
            }
          }         
    }else{
        return Promise.resolve("Success");
    }

  }