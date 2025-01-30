import {onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth , db } from "./firebaseConfig.js";
import { collection, addDoc, getDocs,  Timestamp, query, orderBy, deleteDoc, doc, updateDoc, where} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


  const form = document.querySelector(`#form`)
  const title = document.querySelector('#title');
  const description = document.querySelector('#description');
  const card = document.querySelector('#card');

// user Login /Logout Functiom

onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid);
      
      
    } else {
      window.location=`index.html`
    }
  });

  // User Logout Function
  const logOut=document.querySelector(`#logout-btn`)
  logOut.addEventListener(`click` , ()=>{
    signOut(auth).then(() => {
        alert(`Logout Successfully`)
        window.location=index.html
      }).catch((error) => {
        console.log(error);
        
      });
  })


  //Get Data From Firestore

  let arr = [];

function renderPost() {
   
    arr.map((item) => {
        card.innerHTML += `
        <div class="card mt-2">
        <div class="card-body">
           <p class = fs-5><span class="h4 fw-bold">Tilte:</span> ${item.title}</p>
           <p class = fs-5><span class="h5 fw-bold">Description:</span> ${item.description}</p>
           <button type="button" class="fw-bold btn btn-danger" id="delete">Delete</button>
           <button type="button" class="fw-bold btn btn-info" id="update">Update</button>
        </div>
    </div>`
    })

    const del = document.querySelectorAll('#delete');
    const upd = document.querySelectorAll('#update');

    del.forEach((btn, index) => {
        btn.addEventListener('click', async () => {
            console.log('delete called', arr[index]);
            await deleteDoc(doc(db, "posts", arr[index].docId))
                .then(() => {
                    console.log('post deleted');
                    arr.splice(index, 1);
                    renderPost()
                });
        })
    })
    upd.forEach((btn, index) => {
        btn.addEventListener('click', async () => {
            console.log('update called', arr[index]);
            const updatedTitle = prompt('enter new Title');
            const updatedDescribtion = prompt(`enter new description`)
            await updateDoc(doc(db, "posts", arr[index].docId), {
                title: updatedTitle,
                description:updatedDescribtion
            });
            arr[index].title = updatedTitle;
            renderPost()

        })
    })
}
renderPost()


async function getDataFromFirestore() {
  arr.length = 0;  
  const q = query(collection(db, "posts"), orderBy("postDate", "desc"));
  const querySnapshot = await getDocs(q);
  
  querySnapshot.forEach((docSnapshot) => {
      arr.push({
          ...docSnapshot.data(),
          docId: docSnapshot.id 
      });
  });

  console.log(arr);  
  renderPost(); 
}


getDataFromFirestore();


form.addEventListener('submit', async (event) => {
  event.preventDefault();
  card.innerHTML = '';  
  
  try {
      const docRef = await addDoc(collection(db, "posts"), {
          title: title.value,
          description: description.value,
          uid: auth.currentUser.uid,
          postDate: Timestamp.fromDate(new Date()),
      });
      console.log("Document written with ID: ", docRef.id);
      
      
      getDataFromFirestore();
  } catch (e) {
      console.error("Error adding document: ", e);
  }
});