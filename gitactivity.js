const request=require("request");
const cheerio=require("cheerio");
const fs=require("fs");
let data={};
request("https://github.com/topics",callback);
function callback(error,response,html){
    if(!error){
        const manipulationTool=cheerio.load(html);
        let alltopics=manipulationTool(".no-underline.d-flex.flex-column.flex-justify-center");
        for(let i=0;i<alltopics.length;i++){
            topic(manipulationTool(manipulationTool(alltopics[i]).find("p")[0]).text(),
            "https://github.com/" + manipulationTool(alltopics[i]).attr("href"));

        }
    }
}//another work to go on link of topics nd find 5 project name and url we need above function also to get topic url to get inside projects
function topic(topicname,url){
    request(url,function (error,response, html){
        let manipulationTool=cheerio.load(html);
        let allprojects=manipulationTool(".f3.color-text-secondary.text-normal.lh-condensed");
        allprojects=allprojects.slice(0,5);
        for(let i=0;i<allprojects.length;i++){
            //to store all topic name nd project name in json file
           if(!data[topicname]){
               data[topicname]=[];
               data[topicname].push({name:manipulationTool(manipulationTool(allprojects[i]).find("a")[1]).text().trim(),})
           }
           else{
            data[topicname].push({name:manipulationTool(manipulationTool(allprojects[i]).find("a")[1]).text().trim(),})

           }
           project(manipulationTool(manipulationTool(allprojects[i]).find("a")[1]).text().trim(),
           topicname,
           "https://github.com/" + manipulationTool(manipulationTool(allprojects[i]).find("a")[1]).attr("href"));
            

        }
        fs.writeFileSync("data.json",JSON.stringify(data));


    
    });
}
function project(projectname,topicname, projecturl){
    projecturl=projecturl + "/issues";//this line needed bcz above project url take to issue by adding this
    request(projecturl,function(error,response,html){
        let manipulationTool=cheerio.load(html);
        let allissues=manipulationTool(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
        let index = -1;
        for (let j = 0; j < data[topicname].length; j++) {
          if (data[topicname][j].name == projectname) {//name key made ourself
          index = j;
          break;
        }
    }
        allissues=allissues.slice(0,5);
        for(let i=0;i<allissues.length;i++){

            let name=manipulationTool(allissues[i]).text();
            let link="https://github.com/" + manipulationTool(allissues[i]).attr("href");
            
            if (!data[topicname][index].issues) {
                data[topicname][index].issues = [];
                data[topicname][index].issues.push({ name, link });//issues key made ourself
            }
            else {
                data[topicname][index].issues.push({ name, link });
            }
            
        }
        fs.writeFileSync("data.json",JSON.stringify(data));

    })
    
}