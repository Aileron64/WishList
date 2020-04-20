import Framework7 from 'framework7/framework7.esm.bundle';
import $$ from 'dom7';
import firebase from 'firebase/app';
import app from "./F7App.js";
import 'firebase/database';
import 'firebase/auth';

$$("#tab2").on("tab:show", () => 
{
    //put in firebase ref here
    const sUser = firebase.auth().currentUser.uid;
    firebase.database().ref("crudItems/" + sUser).on("value", (snapshot) =>
    {
        $$("#wishList").html("");
        const oItems = snapshot.val();
        
        if(oItems != null)
        {
            const aKeys = Object.keys(oItems);
            
            for(let n = 0; n < aKeys.length; n++)
            {
                let sCard = `<div class="card">`;

                if(oItems[aKeys[n]].picture != null)
                    if(oItems[aKeys[n]].picture.trim() != "")
                        sCard +=`
                        <div class="card-img card-content card-content-padding">
                            <img src="${oItems[aKeys[n]].picture}"></img>
                        </div>`;

                sCard += oItems[aKeys[n]].datePurchased 
                ? `<div class="card-text"><div class="purchased-item card-content card-content-padding">${oItems[aKeys[n]].item}</div>`
                : `<div class="card-text"><div class="card-content card-content-padding">${oItems[aKeys[n]].item}</div>`;        
               
                if(oItems[aKeys[n]].datePurchased)
                    sCard += `<div class="card-text card-content card-content-padding">
                    Purchased: ${oItems[aKeys[n]].datePurchased}
                    </div></div>`; 
                else
                    sCard += `</div><button class="purchased button button-raised" id="fin_${aKeys[n]}">Purchased</button>`;
                
                sCard += `<button class="remove button button-raised" id="del_${aKeys[n]}">Remove</button>`;
                sCard += `</div>`;
    
                $$("#wishList").append(sCard);
            }    
        }
    });
});

$$(".my-sheet").on("submit", e => 
{
    //submitting a new note
    e.preventDefault();
    const oData = app.form.convertToData("#addItem");
    const sUser = firebase.auth().currentUser.uid;
    const sId = new Date().toISOString().replace(".", "_");
    firebase.database().ref("crudItems/" + sUser + "/" + sId).set(oData);
    app.sheet.close(".my-sheet", true);
});

document.getElementById("tab2").addEventListener("click",
(event) =>
{
    const user = firebase.auth().currentUser.uid;

    console.log(event.target.id);

    if(event.target.classList.contains("remove"))
    {
        console.log("DELETE");
        firebase.database().ref("crudItems/" + user + "/" + event.target.id.replace("del_", "")).remove();
    }

    if(event.target.classList.contains("purchased"))
    {
        const date = new Date();
        console.log("FINISH");
        firebase.database().ref("crudItems/" + user + "/" + event.target.id.replace("fin_", "")).update(
            {
                datePurchased: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            });
    }
});